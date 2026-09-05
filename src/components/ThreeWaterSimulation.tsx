import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface Ripple {
  x: number;
  y: number;
  time: number;
  intensity: number;
}

export interface ThreeWaterSimulationProps {
  quote?: string;
  bgImageUrl?: string;
  className?: string;
}

export function ThreeWaterSimulation({
  quote = "However tonight found you — you don't have to carry it alone.",
  bgImageUrl,
  className = "w-full h-[360px]",
}: ThreeWaterSimulationProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Active ripples list & pointer tracking
  const ripplesRef = useRef<Ripple[]>([]);
  const lastMousePos = useRef<{ x: number; y: number; time: number }>({ x: 0.5, y: 0.5, time: 0 });
  const revealAlphaRef = useRef<number>(0);
  const lastMoveTimeRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;

    // 1. Orthographic 2D Camera, Scene, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || 900;
    const height = container.clientHeight || 360;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
    camera.position.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Offscreen Canvas Texture for Submerged Comforting Quote
    const quoteCanvas = document.createElement("canvas");
    quoteCanvas.width = 1200;
    quoteCanvas.height = 600;
    const quoteCtx = quoteCanvas.getContext("2d")!;

    const updateQuoteCanvas = (text: string) => {
      quoteCtx.clearRect(0, 0, quoteCanvas.width, quoteCanvas.height);

      // Clean, bright luminous celestial white serif text with NO drop shadow
      quoteCtx.fillStyle = "#FFFFFF";
      quoteCtx.shadowColor = "transparent";
      quoteCtx.shadowBlur = 0;
      quoteCtx.textAlign = "center";
      quoteCtx.textBaseline = "middle";
      quoteCtx.font = "italic 48px 'Fraunces', 'Caveat', 'Lora', Georgia, serif";

      // Word wrapping
      const words = text.split(" ");
      const lines: string[] = [];
      let currentLine = "";
      for (const w of words) {
        const testLine = currentLine ? `${currentLine} ${w}` : w;
        if (quoteCtx.measureText(testLine).width > 940) {
          lines.push(currentLine);
          currentLine = w;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);

      const lineHeight = 66;
      const startY = 300 - ((lines.length - 1) * lineHeight) / 2;
      lines.forEach((line, idx) => {
        quoteCtx.fillText(`"${line.replace(/^"|"$/g, "")}"`, 600, startY + idx * lineHeight);
      });
    };

    updateQuoteCanvas(quote);
    const quoteTexture = new THREE.CanvasTexture(quoteCanvas);
    quoteTexture.generateMipmaps = true;

    // Background Image Texture
    const emptyCanvas = document.createElement("canvas");
    emptyCanvas.width = 16;
    emptyCanvas.height = 16;
    const defaultBgTexture = new THREE.CanvasTexture(emptyCanvas);

    let loadedBgTex: THREE.Texture | null = null;

    // 3. 2D Mesh & Combined Fluid + Still Surface Shader
    const geometry = new THREE.PlaneGeometry(2, 2);

    const MAX_RIPPLES = 14;
    const ripplePositions = new Float32Array(MAX_RIPPLES * 2);
    const rippleTimes = new Float32Array(MAX_RIPPLES);
    const rippleIntensities = new Float32Array(MAX_RIPPLES);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(width, height) },
      uAspect: { value: width / height },
      uTextTexture: { value: quoteTexture },
      uBgTexture: { value: defaultBgTexture },
      uHasBg: { value: 0.0 },
      uDeepColor: { value: new THREE.Color("#162846") }, // deep twilight sapphire lake depths (matching video sky)
      uSurfaceColor: { value: new THREE.Color("#274A78") }, // serene twilight blue lake surface
      uBedColor: { value: new THREE.Color("#101C32") }, // deep midnight lake bed
      uSunColor: { value: new THREE.Color("#F8B0A6") }, // sunset rose cloud reflections
      uMousePos: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseSpeed: { value: 0 },
      uRevealAlpha: { value: 0 },
      uRipplesPos: { value: ripplePositions },
      uRipplesTime: { value: rippleTimes },
      uRipplesIntensity: { value: rippleIntensities },
      uActiveRipplesCount: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uResolution;
        uniform float uAspect;
        uniform sampler2D uTextTexture;
        uniform sampler2D uBgTexture;
        uniform float uHasBg;
        uniform vec3 uDeepColor;
        uniform vec3 uSurfaceColor;
        uniform vec3 uBedColor;
        uniform vec3 uSunColor;
        uniform vec2 uMousePos;
        uniform float uMouseSpeed;
        uniform float uRevealAlpha;
        uniform vec2 uRipplesPos[14];
        uniform float uRipplesTime[14];
        uniform float uRipplesIntensity[14];
        uniform int uActiveRipplesCount;

        // Cover-fit UV mapping for background image
        vec2 getCoverUv(vec2 uv, float screenAspect, float imgAspect) {
          vec2 coverUv = uv;
          if (screenAspect > imgAspect) {
            float scale = imgAspect / screenAspect;
            coverUv.y = (uv.y - 0.5) * scale + 0.5;
          } else {
            float scale = screenAspect / imgAspect;
            coverUv.x = (uv.x - 0.5) * scale + 0.5;
          }
          return coverUv;
        }

        // Soft, organic caustics matching clear natural pool
        float getCaustic(vec2 uv) {
          vec2 p = uv * 6.5;
          float t = uTime * 0.35;
          float c1 = sin(p.x * 1.1 + cos(p.y * 1.3 + t)) * 0.5 + 0.5;
          float c2 = cos(p.y * 1.2 + sin(p.x * 1.4 - t * 0.8)) * 0.5 + 0.5;
          return c1 * c2;
        }

        void main() {
          vec2 uv = vUv;

          // 1. Ambient gentle water currents
          vec2 p = uv * 3.5;
          float t = uTime * 0.55;
          float w1 = sin(p.x * 1.6 + t) * cos(p.y * 1.3 + t * 0.8) * 0.006;
          float w2 = sin(p.x * 2.8 - t * 0.6 + p.y * 2.0) * 0.004;
          vec2 ambientFlow = vec2(w1, w2);

          // 2. Interactive Concentric 2D Wave Ripples (Three.js fluid)
          vec2 rippleNormalOffset = vec2(0.0);
          float activeWaveEnergy = 0.0;

          for (int i = 0; i < 14; i++) {
            if (i >= uActiveRipplesCount) break;
            vec2 center = uRipplesPos[i];
            float elapsed = uTime - uRipplesTime[i];
            if (elapsed > 0.0 && elapsed < 3.8) {
              vec2 d = vec2((uv.x - center.x) * uAspect, uv.y - center.y);
              float dist = length(d);

              float waveSpeed = 0.52;
              float waveRadius = elapsed * waveSpeed;
              float waveWidth = 0.14;
              float ring = smoothstep(waveWidth, 0.0, abs(dist - waveRadius));
              float damping = exp(-elapsed * 1.3) * exp(-dist * 1.5);
              float wave = sin(dist * 34.0 - elapsed * 15.0) * ring * damping * uRipplesIntensity[i];

              rippleNormalOffset += normalize(d + 0.0001) * wave * 0.045;
              activeWaveEnergy += abs(wave);
            }
          }

          // 3. Cursor wake disturbance
          vec2 mouseDiff = vec2((uv.x - uMousePos.x) * uAspect, uv.y - uMousePos.y);
          float mouseDist = length(mouseDiff);
          float cursorWake = smoothstep(0.24, 0.0, mouseDist) * min(uMouseSpeed * 0.6, 0.5);
          rippleNormalOffset += normalize(mouseDiff + 0.0001) * cursorWake * 0.025;

          // 4. Combined 2D Surface Normal
          vec2 totalOffset = ambientFlow + rippleNormalOffset;
          vec3 normal = normalize(vec3(-totalOffset * 8.0, 1.0));

          // 5. Submerged Quote Reveal Logic (Mixed with wave physics)
          float cursorReveal = smoothstep(0.35, 0.06, mouseDist) * uRevealAlpha;
          float waveReveal = smoothstep(0.015, 0.18, activeWaveEnergy) * 0.65;
          float totalReveal = clamp(cursorReveal + waveReveal, 0.0, 1.0);

          // Optical Refraction of the Quote
          vec2 refractedUv = uv + totalOffset * 0.6;
          vec4 quoteTex = texture2D(uTextTexture, refractedUv);

          // 6. Base Twilight Lake Bed or Refracted Cloudscape Background Image
          float causticVal = getCaustic(uv + totalOffset * 0.5);
          vec3 bedColor = mix(uBedColor, uSurfaceColor, causticVal * 0.18);

          vec2 bgUv = getCoverUv(uv + totalOffset * 0.7, uAspect, 16.0 / 9.0);
          vec4 bgTex = texture2D(uBgTexture, bgUv);
          vec3 baseVisual = mix(bedColor, bgTex.rgb, uHasBg);

          // 7. Submerge the Quote underwater (reveals through cursor wave)
          vec3 waterUnderneath = mix(baseVisual, quoteTex.rgb, quoteTex.a * totalReveal * 0.95);

          // 8. Water Body Depth & Color Absorption
          vec3 waterBody = mix(waterUnderneath, uDeepColor, mix(0.35, 0.06, uHasBg));
          waterBody = mix(waterBody, uSurfaceColor, mix(0.30, 0.08, uHasBg));

          // 10. Soft Specular Light Glint on Ripple Wave Crests (Sunset Cloud Reflection)
          vec3 lightDir = normalize(vec3(0.25, 0.45, 0.85));
          float spec = pow(max(dot(normal, lightDir), 0.0), 20.0) * 0.35;
          vec3 specular = uSunColor * spec;

          // 11. Ambient Surface Fresnel Sheen (Sky Reflection)
          float fresnel = pow(1.0 - normal.z, 2.2) * 0.45;
          vec3 finalColor = mix(waterBody, uSunColor, fresnel * mix(0.38, 0.22, uHasBg)) + specular;

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Asynchronously load background image texture if provided
    if (bgImageUrl) {
      new THREE.TextureLoader().load(bgImageUrl, (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = true;
        loadedBgTex = tex;
        material.uniforms.uBgTexture.value = tex;
        material.uniforms.uHasBg.value = 1.0;
        material.needsUpdate = true;
      });
    }

    // 4. Cursor / Pointer Interaction
    const addRipple = (x: number, y: number, intensity = 1.0) => {
      ripplesRef.current.push({
        x,
        y,
        time: uniforms.uTime.value,
        intensity,
      });

      if (ripplesRef.current.length > MAX_RIPPLES) {
        ripplesRef.current.shift();
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;

      const now = performance.now();
      const dt = Math.max((now - lastMousePos.current.time) / 1000, 0.016);
      const dx = x - lastMousePos.current.x;
      const dy = y - lastMousePos.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy) / dt;

      uniforms.uMousePos.value.set(x, y);
      uniforms.uMouseSpeed.value = THREE.MathUtils.lerp(uniforms.uMouseSpeed.value, speed, 0.25);

      // Activate quote reveal on movement
      revealAlphaRef.current = 1.0;
      lastMoveTimeRef.current = now;

      if (speed > 0.22 && (Math.abs(dx) > 0.012 || Math.abs(dy) > 0.012)) {
        addRipple(x, y, Math.min(speed * 0.4, 1.2));
      }

      lastMousePos.current = { x, y, time: now };
    };

    const handlePointerDown = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      addRipple(x, y, 1.5);
      revealAlphaRef.current = 1.0;
      lastMoveTimeRef.current = performance.now();
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerdown", handlePointerDown);

    // Initial gentle ripples to invite the user
    setTimeout(() => addRipple(0.48, 0.52, 1.0), 400);

    // 5. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      renderer.setSize(newWidth, newHeight);
      uniforms.uResolution.value.set(newWidth, newHeight);
      uniforms.uAspect.value = newWidth / newHeight;
    };

    window.addEventListener("resize", handleResize);

    // 6. Animation Loop (using performance.now to eliminate THREE.Clock deprecation warning)
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTime) / 1000;
      uniforms.uTime.value = elapsedTime;

      // Smoothly fade reveal alpha when idle
      const now = performance.now();
      const idleTime = now - lastMoveTimeRef.current;
      if (idleTime > 1400) {
        revealAlphaRef.current = THREE.MathUtils.lerp(revealAlphaRef.current, 0.0, 0.035);
      }
      uniforms.uRevealAlpha.value = revealAlphaRef.current;

      // Pack active ripples
      const validRipples = ripplesRef.current.filter((r) => elapsedTime - r.time < 3.8);
      ripplesRef.current = validRipples;

      uniforms.uActiveRipplesCount.value = validRipples.length;
      for (let i = 0; i < MAX_RIPPLES; i++) {
        if (i < validRipples.length) {
          ripplePositions[i * 2] = validRipples[i].x;
          ripplePositions[i * 2 + 1] = validRipples[i].y;
          rippleTimes[i] = validRipples[i].time;
          rippleIntensities[i] = validRipples[i].intensity;
        } else {
          rippleTimes[i] = -100;
        }
      }

      uniforms.uMouseSpeed.value *= 0.9;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerdown", handlePointerDown);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      quoteTexture.dispose();
      defaultBgTexture.dispose();
      if (loadedBgTex) (loadedBgTex as THREE.Texture).dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [quote, bgImageUrl]);

  return (
    <div className={`relative overflow-hidden select-none ${className}`}>
      <div
        ref={containerRef}
        className="w-full h-full min-h-[340px] cursor-crosshair touch-none"
        title="Wave cursor across water to reveal quote"
      />
    </div>
  );
}

export default ThreeWaterSimulation;
