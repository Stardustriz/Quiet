import React, { useEffect, useRef, useState } from "react";

interface PixelRainDrop {
  x: number;
  y: number;
  speed: number;
  type: 0 | 1 | 2 | 3; // 0: micro pixel (2x2), 1: small dash (2x5), 2: stepped drop (2x8), 3: thin streak (1x9)
  opacity: number;
}

interface PixelSplash {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  opacity: number;
}

export function RainThunderEffect({ enabled }: { enabled: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [flashOpacity, setFlashOpacity] = useState<number>(0);

  // Web Audio refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rainGainRef = useRef<GainNode | null>(null);
  const pitterTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Subtle, Calming Web Audio (Gentle Rainfall + Distant Rolling Thunder)
  useEffect(() => {
    if (!enabled) {
      if (rainGainRef.current && audioCtxRef.current) {
        const now = audioCtxRef.current.currentTime;
        rainGainRef.current.gain.setTargetAtTime(0.0001, now, 0.4);
      }
      if (pitterTimerRef.current) {
        clearInterval(pitterTimerRef.current);
        pitterTimerRef.current = null;
      }
      return;
    }

    const initAudio = () => {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }

        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") {
          ctx.resume();
        }

        // Soft pink noise bed for steady distant rainfall
        const bufferSize = ctx.sampleRate * 4;
        const noiseBuffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
        for (let channel = 0; channel < 2; channel++) {
          const data = noiseBuffer.getChannelData(channel);
          let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
            b6 = white * 0.115926;
          }
        }

        const rainSource = ctx.createBufferSource();
        rainSource.buffer = noiseBuffer;
        rainSource.loop = true;

        const lowPass = ctx.createBiquadFilter();
        lowPass.type = "lowpass";
        lowPass.frequency.setValueAtTime(950, ctx.currentTime);

        const highPass = ctx.createBiquadFilter();
        highPass.type = "highpass";
        highPass.frequency.setValueAtTime(140, ctx.currentTime);

        const rainGain = ctx.createGain();
        rainGain.gain.setValueAtTime(0.0001, ctx.currentTime);
        rainGain.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 1.0);
        rainGainRef.current = rainGain;

        rainSource.connect(lowPass);
        lowPass.connect(highPass);
        highPass.connect(rainGain);
        rainGain.connect(ctx.destination);

        rainSource.start();

        // Subtle soft droplet pitter-patter
        const schedulePitter = () => {
          if (!enabled || !audioCtxRef.current) return;
          const actx = audioCtxRef.current;
          if (actx.state !== "running") return;

          try {
            const t = actx.currentTime + Math.random() * 0.08;
            const osc = actx.createOscillator();
            const gain = actx.createGain();
            const filter = actx.createBiquadFilter();

            osc.type = "sine";
            const freq = 800 + Math.random() * 1400;
            osc.frequency.setValueAtTime(freq, t);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.5, t + 0.035);

            filter.type = "bandpass";
            filter.frequency.setValueAtTime(freq, t);
            filter.Q.setValueAtTime(4.0, t);

            gain.gain.setValueAtTime(0.0001, t);
            gain.gain.linearRampToValueAtTime(0.012 + Math.random() * 0.015, t + 0.005);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(actx.destination);

            osc.start(t);
            osc.stop(t + 0.05);
          } catch {
            // Ignore
          }
        };

        pitterTimerRef.current = setInterval(() => {
          if (Math.random() > 0.45) schedulePitter();
        }, 130);
      } catch {
        // Audio policy fallback
      }
    };

    initAudio();

    return () => {
      if (rainGainRef.current && audioCtxRef.current) {
        const now = audioCtxRef.current.currentTime;
        rainGainRef.current.gain.setTargetAtTime(0.0001, now, 0.4);
      }
      if (pitterTimerRef.current) {
        clearInterval(pitterTimerRef.current);
        pitterTimerRef.current = null;
      }
    };
  }, [enabled]);

  // 2. Realistic Distant Rolling Thunder Audio
  const triggerThunderAudio = () => {
    const ctx = audioCtxRef.current;
    if (!ctx || ctx.state !== "running" || !enabled) return;

    try {
      const now = ctx.currentTime + 0.85;

      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(44, now);
      osc.frequency.exponentialRampToValueAtTime(22, now + 4.0);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(3.8, now);
      lfo.frequency.linearRampToValueAtTime(1.6, now + 3.6);

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(14, now);
      lfo.connect(osc.frequency);

      const bufferSize = ctx.sampleRate * 4;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const thunderFilter = ctx.createBiquadFilter();
      thunderFilter.type = "lowpass";
      thunderFilter.frequency.setValueAtTime(160, now);
      thunderFilter.frequency.exponentialRampToValueAtTime(50, now + 3.8);
      thunderFilter.Q.setValueAtTime(3.0, now);

      const thunderGain = ctx.createGain();
      thunderGain.gain.setValueAtTime(0.0001, now);
      thunderGain.gain.linearRampToValueAtTime(0.26, now + 0.4);
      thunderGain.gain.linearRampToValueAtTime(0.18, now + 1.1);
      thunderGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.2);

      osc.connect(thunderGain);
      noiseSource.connect(thunderFilter);
      thunderFilter.connect(thunderGain);
      thunderGain.connect(ctx.destination);

      osc.start(now);
      lfo.start(now);
      noiseSource.start(now);

      osc.stop(now + 4.5);
      lfo.stop(now + 4.5);
      noiseSource.stop(now + 4.5);
    } catch {
      // Ignore
    }
  };

  // 3. Gentle Multi-Stroke Lightning Flash (Subtle and not overwhelming)
  useEffect(() => {
    if (!enabled) {
      setFlashOpacity(0);
      return;
    }

    let flashTimer: NodeJS.Timeout;
    const scheduleNextFlash = () => {
      const nextDelay = 18000 + Math.random() * 18000;
      flashTimer = setTimeout(() => {
        triggerThunderAudio();

        // Realistic double-pulse twilight lightning
        setFlashOpacity(0.28);
        setTimeout(() => {
          setFlashOpacity(0.08);
          setTimeout(() => {
            setFlashOpacity(0.52);
            setTimeout(() => {
              setFlashOpacity(0.22);
              setTimeout(() => {
                setFlashOpacity(0);
              }, 180);
            }, 110);
          }, 55);
        }, 70);

        scheduleNextFlash();
      }, nextDelay);
    };

    scheduleNextFlash();
    return () => clearTimeout(flashTimer);
  }, [enabled]);

  // 4. Pixelated Rain Theme: Small, Subtle, Multi-Sized Particles
  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Populate high-density, small pixel raindrops with varied sizes
    // More particles (260 - 380) that are small, delicate, and low-opacity
    const particleCount = Math.min(Math.floor((width * height) / 4800), 340);
    const drops: PixelRainDrop[] = [];

    for (let i = 0; i < particleCount; i++) {
      const rand = Math.random();
      // 0: Micro pixel dot (35%)
      // 1: Small pixel dash (35%)
      // 2: Stepped pixel drop (20%)
      // 3: Fine pixel streak (10%)
      const type: 0 | 1 | 2 | 3 =
        rand < 0.35 ? 0 : rand < 0.7 ? 1 : rand < 0.9 ? 2 : 3;

      let speed = 7 + Math.random() * 5;
      let opacity = 0.16 + Math.random() * 0.18; // Less seenable, soft & gentle

      if (type === 0) {
        speed = 5 + Math.random() * 4;
        opacity = 0.14 + Math.random() * 0.15;
      } else if (type === 2) {
        speed = 9 + Math.random() * 5;
        opacity = 0.2 + Math.random() * 0.18;
      } else if (type === 3) {
        speed = 11 + Math.random() * 5;
        opacity = 0.18 + Math.random() * 0.16;
      }

      drops.push({
        x: Math.random() * (width + 120) - 60,
        y: Math.random() * height,
        speed,
        type,
        opacity,
      });
    }

    const splashes: PixelSplash[] = [];

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = false;

      // Draw Pixel Drops (Rendered with crisp integer pixel rectangles)
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i]!;
        const px = Math.round(d.x);
        const py = Math.round(d.y);

        // Soft twilight slate-lavender pixel color (subtle on light cream & dark hero sky)
        ctx.fillStyle = `rgba(115, 125, 155, ${d.opacity})`;

        switch (d.type) {
          case 0:
            // Type 0: Micro 2x2 pixel droplet
            ctx.fillRect(px, py, 2, 2);
            break;

          case 1:
            // Type 1: Small 2-step pixel dash (2x5 total)
            ctx.fillRect(px, py, 2, 3);
            ctx.fillRect(px - 1, py + 2, 2, 3);
            break;

          case 2:
            // Type 2: Stepped pixel streak (2x8 total)
            ctx.fillRect(px, py, 2, 3);
            ctx.fillRect(px - 1, py + 3, 2, 3);
            ctx.fillRect(px - 2, py + 5, 2, 3);
            break;

          case 3:
            // Type 3: Fine 1px vertical drizzle line (1x9)
            ctx.fillRect(px, py, 1, 5);
            ctx.fillRect(px - 1, py + 4, 1, 5);
            break;
        }

        // Gentle pixel drift slant
        d.x += 0.8;
        d.y += d.speed;

        // Bottom hit -> tiny pixel splash
        if (d.y > height - 6) {
          if (d.type !== 0 && splashes.length < 24 && Math.random() > 0.72) {
            splashes.push({
              x: px,
              y: height - 4,
              vx: (Math.random() - 0.5) * 1.8,
              vy: -(1.2 + Math.random() * 1.6),
              life: 0,
              maxLife: 6 + Math.floor(Math.random() * 5),
              opacity: d.opacity * 0.9,
            });
          }
          d.y = -12;
          d.x = Math.random() * (width + 120) - 60;
        }
      }

      // Draw Pixel Splash Particles (2x2 retro square sparks)
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i]!;
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.28; // pixel gravity
        s.life++;

        ctx.fillStyle = `rgba(130, 140, 175, ${
          s.opacity * (1 - s.life / s.maxLife)
        })`;
        ctx.fillRect(Math.round(s.x), Math.round(s.y), 2, 2);

        if (s.life >= s.maxLife) {
          splashes.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* 1. Full-Screen Pixelated Rain Canvas (Crisp Pixel-Art Theme) */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-35 select-none"
        style={{ width: "100vw", height: "100vh", imageRendering: "pixelated" }}
      />

      {/* 2. Twilight Lightning Atmosphere Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-40 transition-opacity duration-75 select-none"
        style={{
          opacity: flashOpacity,
          background:
            "radial-gradient(ellipse at 50% 15%, rgba(240, 235, 255, 0.6) 0%, rgba(210, 200, 235, 0.4) 60%, rgba(175, 160, 210, 0.25) 100%)",
          mixBlendMode: "screen",
        }}
      />
    </>
  );
}
