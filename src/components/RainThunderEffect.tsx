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

  // 1. Gentle Multi-Stroke Lightning Flash (Visual only)
  useEffect(() => {
    if (!enabled) {
      setFlashOpacity(0);
      return;
    }

    let flashTimer: NodeJS.Timeout;
    const scheduleNextFlash = () => {
      const nextDelay = 18000 + Math.random() * 18000;
      flashTimer = setTimeout(() => {
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

  // 2. Pixelated Rain Theme: Small, Subtle, Multi-Sized Particles
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
