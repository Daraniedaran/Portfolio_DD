import { useEffect, useRef } from "react";

/**
 * AmbientBackground: A modern, ultra-clean interactive background for developer portfolios.
 * Features:
 * - Fluid, deep ambient aurora gradient mesh
 * - Subtle geometric grid with radial mask
 * - Gentle interactive constellation / connection web that softly tracks the cursor
 * - 100% smooth, lightweight 60 FPS Canvas with zero lag or battery drain
 */
export default function AmbientBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates with smooth interpolation
    let targetMouseX = width / 2;
    let targetMouseY = height / 3;
    let mouseX = targetMouseX;
    let mouseY = targetMouseY;

    // Node network configuration
    const isMobile = width < 768;
    const NODE_COUNT = isMobile ? 35 : 65;
    const MAX_DIST = isMobile ? 100 : 140;

    class Node {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 1;
        this.baseAlpha = Math.random() * 0.4 + 0.2;
        // Subtle color tints: cream, brand red, teal
        const colors = [
          "rgba(56, 189, 248, ",  // sky blue
          "rgba(184, 17, 4, ",  // brand red
          "rgba(45, 212, 191, ",  // teal
          "rgba(255, 250, 205, ", // cream
        ];
        this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce gently off borders
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Gentle attraction/push from cursor
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180 && dist > 10) {
          const force = (180 - dist) / 180 * 0.015;
          this.x += dx * force;
          this.y += dy * force;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.colorPrefix + this.baseAlpha + ")";
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.colorPrefix + "0.6)";
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const nodes = Array.from({ length: NODE_COUNT }, () => new Node());

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      nodes.forEach((n) => {
        if (n.x > width) n.x = Math.random() * width;
        if (n.y > height) n.y = Math.random() * height;
      });
    };
    window.addEventListener("resize", handleResize);

    const handlePointerMove = (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    let lastTime = performance.now();

    function render(now) {
      animId = requestAnimationFrame(render);
      // Throttle for background smoothness (~60fps)
      if (now - lastTime < 16) return;
      lastTime = now;

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle interactive cursor glow spotlight
      const radGrad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 380);
      radGrad.addColorStop(0, "rgba(56, 189, 248, 0.07)");
      radGrad.addColorStop(0.45, "rgba(139, 92, 246, 0.04)");
      radGrad.addColorStop(1, "rgba(2, 6, 23, 0)");
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw connecting network lines
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.16;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // 3. Update and draw nodes
      nodes.forEach((n) => {
        n.update();
        n.draw();
      });
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none bg-[#f6f8fd]">
      {/* Aurora Ambient Mesh Blobs */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full bg-gradient-to-br from-cyan-500/15 via-sky-600/10 to-transparent blur-[120px] animate-pulse"
        style={{ animationDuration: "8s" }}
        aria-hidden="true"
      />
      <div
        className="absolute top-[30%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-bl from-[#FFFACD]/60 via-[#B81104]/10 to-transparent blur-[130px] animate-pulse"
        style={{ animationDuration: "12s" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-gradient-to-tr from-emerald-500/10 via-teal-600/10 to-transparent blur-[140px] animate-pulse"
        style={{ animationDuration: "10s" }}
        aria-hidden="true"
      />

      {/* Subtle modern engineering dot-grid pattern with vignette */}
      <div
        className="absolute inset-0 opacity-[0.22] [background-image:radial-gradient(rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)]"
        aria-hidden="true"
      />

      {/* Interactive Constellation Network Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

      {/* Top & Bottom Depth Gradients */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white via-white/60 to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent" aria-hidden="true" />
    </div>
  );
}
