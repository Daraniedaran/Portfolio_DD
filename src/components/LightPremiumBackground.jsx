import { useEffect, useRef } from "react";

/**
 * LightPremiumBackground — light, premium, animated site-wide background.
 * - Pastel aurora mesh (cyan / violet / amber / rose) with slow drift
 * - Faint dot-grid + diagonal light beams + rotating conic sheen
 * - Lightweight interactive constellation canvas (indigo/cyan/rose, mouse-reactive)
 * - White depth fades top/bottom for readability
 */
export default function LightPremiumBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    let tx = w / 2;
    let ty = h / 3;
    let mx = tx;
    let my = ty;

    const isMobile = w < 768;
    const COUNT = isMobile ? 32 : 60;
    const MAX = isMobile ? 110 : 150;

    const palette = [
      "184,17,4", // brand red
      "34,211,238", // cyan
      "255,250,205", // cream
      "244,114,182", // pink
      "251,146,60", // amber
    ];

    const nodes = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 1,
      c: palette[Math.floor(Math.random() * palette.length)],
      a: Math.random() * 0.35 + 0.35,
    }));

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      nodes.forEach((n) => {
        if (n.x > w) n.x = Math.random() * w;
        if (n.y > h) n.y = Math.random() * h;
      });
    };
    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });

    let last = performance.now();
    const render = (now) => {
      raf = requestAnimationFrame(render);
      if (now - last < 16) return;
      last = now;

      mx += (tx - mx) * 0.06;
      my += (ty - my) * 0.06;

      ctx.clearRect(0, 0, w, h);

      // cursor spotlight — soft premium glow
      const g = ctx.createRadialGradient(mx, my, 0, mx, my, 420);
      g.addColorStop(0, "rgba(184,17,4,0.10)");
      g.addColorStop(0.45, "rgba(255,250,205,0.35)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // links
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < MAX) {
            const alpha = (1 - d / MAX) * 0.22;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(100,116,139,${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        const dx = mx - n.x;
        const dy = my - n.y;
        const d = Math.hypot(dx, dy);
        if (d < 180 && d > 10) {
          const f = ((180 - d) / 180) * 0.02;
          n.x += dx * f;
          n.y += dy * f;
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${n.c},${n.a})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${n.c},0.35)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-gradient-to-b from-[#fbfdff] via-[#eef3ff] to-[#fdf4ff]"
      aria-hidden="true"
    >
      {/* Aurora mesh — pastel premium blobs */}
      <div className="absolute -top-[12%] -left-[10%] w-[58vw] h-[58vw] max-w-[680px] max-h-[680px] rounded-full bg-gradient-to-br from-[#FFFACD]/70 via-[#FDEEDA]/50 to-[#B81104]/10 blur-[110px] animate-aurora-1" />
      <div className="absolute top-[22%] -right-[12%] w-[52vw] h-[52vw] max-w-[620px] max-h-[620px] rounded-full bg-gradient-to-bl from-[#FFFACD]/60 via-[#B81104]/15 to-transparent blur-[120px] animate-aurora-2" />
      <div className="absolute bottom-[-14%] left-[18%] w-[62vw] h-[62vw] max-w-[720px] max-h-[720px] rounded-full bg-gradient-to-tr from-amber-200/60 via-rose-200/50 to-sky-200/40 blur-[130px] animate-aurora-3" />
      <div className="absolute top-[42%] left-[38%] w-[30vw] h-[30vw] max-w-[380px] max-h-[380px] rounded-full bg-gradient-to-br from-[#FFFACD]/60 to-[#B81104]/10 blur-[90px] animate-pulse-soft" />

      {/* Rotating conic sheen */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vmax] h-[120vmax] opacity-[0.16] animate-spin-slower [background:conic-gradient(from_0deg,transparent_0deg,rgba(184,17,4,0.22)_40deg,transparent_80deg,rgba(255,250,205,0.5)_140deg,transparent_180deg,rgba(244,114,182,0.18)_240deg,transparent_300deg,rgba(184,17,4,0.22)_360deg)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_62%)]" />

      {/* Diagonal light beams */}
      <div className="absolute inset-0 opacity-[0.35] [background:linear-gradient(115deg,transparent_42%,rgba(255,255,255,0.9)_50%,transparent_58%)] [background-size:220%_220%] animate-shimmer" />

      {/* Dot grid — light */}
      <div className="absolute inset-0 opacity-[0.5] [background-image:radial-gradient(rgba(100,116,139,0.22)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_88%)]" />
      {/* Fine grid lines */}
      <div className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(184,17,4,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(184,17,4,0.07)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />

      {/* Floating premium orbs */}
      <div className="absolute top-[16%] left-[12%] w-3 h-3 rounded-full bg-gradient-to-br from-[#FFFACD] to-[#B81104] shadow-[0_0_18px_rgba(184,17,4,0.6)] animate-float-slow" />
      <div className="absolute top-[64%] right-[14%] w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#FFFACD] to-[#B81104] shadow-[0_0_16px_rgba(184,17,4,0.55)] animate-float-slow" style={{ animationDelay: "-2s" }} />
      <div className="absolute bottom-[18%] left-[46%] w-2 h-2 rounded-full bg-gradient-to-br from-emerald-400 to-sky-300 shadow-[0_0_14px_rgba(52,211,153,0.5)] animate-float-slow" style={{ animationDelay: "-4s" }} />

      {/* Interactive constellation */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Depth fades — keep text readable */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/90 via-white/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-white/90 via-white/50 to-transparent" />
    </div>
  );
}
