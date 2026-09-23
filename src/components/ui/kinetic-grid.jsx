"use client";

import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────
// Visual math is a 1:1 port of the supplied kinetic-grid.tsx.

const CELL_SIZE = 55; // Desktop-ish size. Will dictate cols/rows
const INFLUENCE_RADIUS = 260;
const MAX_WARP = 24;
const DOT_SPACING = 28;
const LERP_SPEED = 0.08;

const LINE_BASE = { r: 100, g: 116, b: 139, a: 0.18 };
const NODE_BASE_RADIUS = 1.8;
const NODE_ACTIVE_RADIUS = 3.2;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function lerpN(a, b, t) {
  return a + (b - a) * t;
}

function lerpColor(base, active, t) {
  const r = Math.round(lerpN(base.r, active.r, t));
  const g = Math.round(lerpN(base.g, active.g, t));
  const b = Math.round(lerpN(base.b, active.b, t));
  const a = lerpN(base.a, active.a, t);
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

const THEMES = {
  default: {
    bg: "#161618",
    lineActive: { r: 74, g: 158, b: 255, a: 0.9 },
    nodeActive: { r: 74, g: 158, b: 255, a: 1.0 },
    glow: "74,158,255",
    ripple: "100,180,255",
    dot: "rgba(255,255,255,0.05)",
    nodeBase: { r: 255, g: 255, b: 255, a: 0.2 },
  },
  light: {
    bg: "rgba(248,250,252,0.55)",
    lineActive: { r: 184, g: 17, b: 4, a: 0.85 },
    nodeActive: { r: 184, g: 17, b: 4, a: 1.0 },
    glow: "184,17,4",
    ripple: "184,17,4",
    dot: "rgba(100,116,139,0.14)",
    nodeBase: { r: 100, g: 116, b: 139, a: 0.28 },
  },
  monochrome: {
    bg: "#000000",
    lineActive: { r: 255, g: 255, b: 255, a: 0.9 },
    nodeActive: { r: 255, g: 255, b: 255, a: 1.0 },
    glow: "255,255,255",
    ripple: "255,255,255",
    dot: "rgba(255,255,255,0.05)",
    nodeBase: { r: 255, g: 255, b: 255, a: 0.2 },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
// Ported from TypeScript to JSX for this Vite + JS portfolio.
// Two deliberate adaptations vs the original fixed-fullscreen version:
// 1. Canvas sizes to its parent wrapper (ResizeObserver) and mouse/ripple
//    coordinates are wrapper-relative, so it can be embedded in a section
//    (e.g. Hero) instead of only working as a full-page fixed layer.
// 2. Animation pauses when off-screen (IntersectionObserver) and renders a
//    single static frame when the user prefers reduced motion.

export default function KineticGrid({
  children,
  className,
  globalColor = "default",
}) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  const mouseRef = useRef({ x: -9999, y: -9999 });
  const targetMouseRef = useRef({ x: -9999, y: -9999 });
  const ripplesRef = useRef([]);
  const rafRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0 });
  const visibleRef = useRef(true);

  // ── Warp ────────────────────────────────────────────────────────────────────

  const getWarpedPoint = useCallback(
    (gx, gy, col, row, mouse, ripples, cols, rows) => {
      // Edge pin — smoothly locks boundary rows/cols in place
      const edgeMargin = 1.5;
      const colPin = Math.min(col / edgeMargin, (cols - 1 - col) / edgeMargin, 1);
      const rowPin = Math.min(row / edgeMargin, (rows - 1 - row) / edgeMargin, 1);
      const pinFactor = colPin * colPin * rowPin * rowPin;

      const dx = gx - mouse.x;
      const dy = gy - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const proximity = Math.max(0, 1 - dist / INFLUENCE_RADIUS) * pinFactor;

      // Ripple displacement
      let rx = 0;
      let ry = 0;
      for (const r of ripples) {
        const rdx = gx - r.x;
        const rdy = gy - r.y;
        const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
        const waveWidth = 55;
        const diff = rdist - r.radius;
        if (Math.abs(diff) < waveWidth) {
          const strength =
            (1 - Math.abs(diff) / waveWidth) * r.opacity * 18 * pinFactor;
          const angle = Math.atan2(rdy, rdx);
          const sign = diff < 0 ? -1 : 1;
          rx += Math.cos(angle) * strength * sign * -1;
          ry += Math.sin(angle) * strength * sign * -1;
        }
      }

      // Cursor warp with bell falloff
      if (dist < INFLUENCE_RADIUS && dist > 0 && pinFactor > 0) {
        const t = dist / INFLUENCE_RADIUS;
        const eased = t < 0.01 ? 0 : (1 - t) * (1 - t) * Math.min(1, dist / 60);
        const warpAmt = eased * MAX_WARP * pinFactor;
        const angle = Math.atan2(dy, dx);
        return {
          pt: {
            x: gx - Math.cos(angle) * warpAmt + rx,
            y: gy - Math.sin(angle) * warpAmt + ry,
          },
          proximity,
        };
      }

      return { pt: { x: gx + rx, y: gy + ry }, proximity };
    },
    [],
  );

  // ── Draw ────────────────────────────────────────────────────────────────────

  const draw = useCallback(
    (now) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { w: W, h: H } = sizeRef.current;
      if (W === 0 || H === 0) return;
      const mouse = mouseRef.current;
      const ripples = ripplesRef.current;

      const theme = THEMES[globalColor] ?? THEMES.default;

      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, W, H);

      // Static background dot texture
      ctx.fillStyle = theme.dot || "rgba(255,255,255,0.05)";
      for (let x = DOT_SPACING / 2; x < W; x += DOT_SPACING) {
        for (let y = DOT_SPACING / 2; y < H; y += DOT_SPACING) {
          ctx.beginPath();
          ctx.arc(x, y, 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        const age = (now - r.born) / 1000;
        // Ensure radius is never negative
        r.radius = Math.max(0, age * 400);
        r.opacity = Math.max(0, 1 - age * 1.2);
        if (r.opacity <= 0) ripples.splice(i, 1);
      }

      // ── Build warped grid ─────────────────────────────────────────────────
      const cols = Math.max(2, Math.ceil(W / CELL_SIZE)) + 1;
      const rows = Math.max(2, Math.ceil(H / CELL_SIZE)) + 1;
      const cellW = W / (cols - 1);
      const cellH = H / (rows - 1);

      const pts = [];
      const prox = [];

      for (let row = 0; row < rows; row++) {
        pts[row] = [];
        prox[row] = [];
        for (let col = 0; col < cols; col++) {
          const { pt, proximity } = getWarpedPoint(
            col * cellW,
            row * cellH,
            col,
            row,
            mouse,
            ripples,
            cols,
            rows,
          );
          pts[row][col] = pt;
          prox[row][col] = proximity;
        }
      }

      // ── Grid lines ────────────────────────────────────────────────────────
      const drawSeg = (p1, p2, pr1, pr2) => {
        const avg = (pr1 + pr2) / 2;
        const t = avg * avg * (3 - 2 * avg); // smoothstep
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = lerpColor(LINE_BASE, theme.lineActive, t);
        ctx.lineWidth = lerpN(0.8, 1.5, t);
        ctx.stroke();
      };

      ctx.lineCap = "butt";

      for (let row = 0; row < rows; row++)
        for (let col = 0; col < cols - 1; col++)
          drawSeg(
            pts[row][col],
            pts[row][col + 1],
            prox[row][col],
            prox[row][col + 1],
          );

      for (let col = 0; col < cols; col++)
        for (let row = 0; row < rows - 1; row++)
          drawSeg(
            pts[row][col],
            pts[row + 1][col],
            prox[row][col],
            prox[row + 1][col],
          );

      // ── Intersection nodes ────────────────────────────────────────────────
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const p = pts[row][col];
          const pr = prox[row][col];
          const t = pr * pr * (3 - 2 * pr); // smoothstep
          const r = lerpN(NODE_BASE_RADIUS, NODE_ACTIVE_RADIUS, t);

          // Outer glow ring for active nodes
          if (t > 0.3) {
            const glowR = r + lerpN(0, 6, (t - 0.3) / 0.7);
            const grd = ctx.createRadialGradient(
              p.x,
              p.y,
              r * 0.5,
              p.x,
              p.y,
              glowR,
            );
            grd.addColorStop(0, `rgba(${theme.glow},${(t * 0.3).toFixed(3)})`);
            grd.addColorStop(1, `rgba(${theme.glow},0)`);
            ctx.beginPath();
            ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
            ctx.fillStyle = grd;
            ctx.fill();
          }

          // Node fill
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fillStyle = lerpColor(
            theme.nodeBase || { r: 255, g: 255, b: 255, a: 0.2 },
            theme.nodeActive,
            t,
          );
          ctx.fill();
        }
      }

      // ── Ripple rings ──────────────────────────────────────────────────────
      for (const r of ripples) {
        // Ensure radius is positive before drawing arc
        const safeRadius = Math.max(0, r.radius);
        ctx.beginPath();
        ctx.arc(r.x, r.y, safeRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${theme.ripple},${(r.opacity * 0.28).toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    },
    [getWarpedPoint, globalColor],
  );

  // ── Setup ───────────────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    // Local loop (named function expression so rAF self-reference is lint-clean).
    const animate = function tick(now) {
      const m = mouseRef.current;
      const t = targetMouseRef.current;

      m.x = lerpN(m.x, t.x, LERP_SPEED);
      m.y = lerpN(m.y, t.y, LERP_SPEED);

      draw(now);
      rafRef.current = requestAnimationFrame(tick);
    };

    const reducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const setSize = () => {
      const rect = wrap.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      canvas.width = w;
      canvas.height = h;
      sizeRef.current = { w, h };
    };

    setSize();

    const toLocal = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const onPointerMove = (e) => {
      targetMouseRef.current = toLocal(e.clientX, e.clientY);
    };

    const onPointerLeaveWindow = () => {
      targetMouseRef.current = { x: -9999, y: -9999 };
    };

    const onClick = (e) => {
      const p = toLocal(e.clientX, e.clientY);
      const { w, h } = sizeRef.current;
      // Ignore clicks outside the grid (listener lives on the parent
      // section so clicks on overlaying content still ripple).
      if (p.x < 0 || p.y < 0 || p.x > w || p.y > h) return;
      ripplesRef.current.push({
        x: p.x,
        y: p.y,
        radius: 0,
        opacity: 1,
        born: performance.now(),
      });
    };

    let resizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(setSize);
      resizeObserver.observe(wrap);
    } else {
      window.addEventListener("resize", setSize);
    }

    // Pause work when the section scrolls out of view (battery-friendly).
    let io;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          const isVisible = entry.isIntersecting;
          const wasVisible = visibleRef.current;
          visibleRef.current = isVisible;
          if (isVisible && !wasVisible && !reducedMotion) {
            rafRef.current = requestAnimationFrame(animate);
          } else if (!isVisible && wasVisible && rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = 0;
          }
        },
        { threshold: 0 },
      );
      io.observe(wrap);
    }

    // NOTE: pointer/click listeners live above the grid's own box on purpose.
    // In Hero the content layer (a z-10 sibling) covers the canvas, so
    // wrap-level listeners would never fire when hovering text/buttons.
    // Window-level pointermove converted to canvas-local coords fixes the
    // warp; clicks are caught on the parent section so overlaying content
    // still triggers ripples (out-of-bounds clicks are ignored in onClick).
    const clickTarget = wrap.parentElement ?? wrap;
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener(
      "mouseleave",
      onPointerLeaveWindow,
    );
    clickTarget.addEventListener("click", onClick);

    if (reducedMotion) {
      // Single static frame: no warp, no loop.
      draw(performance.now());
    } else {
      rafRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      else window.removeEventListener("resize", setSize);
      if (io) io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener(
        "mouseleave",
        onPointerLeaveWindow,
      );
      clickTarget.removeEventListener("click", onClick);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [draw]);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative w-full min-h-screen overflow-hidden",
        globalColor === "monochrome"
          ? "bg-[#000000]"
          : globalColor === "light"
            ? "bg-transparent"
            : "bg-[#161618]",
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
