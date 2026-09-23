import { useEffect, useRef } from "react";

// Battery-friendly reveal: one-shot IntersectionObserver, then CSS transition. No per-frame JS.
export default function Reveal({ children, delay = 0, from = "up", style, className = "", as: Tag = "div" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target); // observe once = no ongoing cost
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const delayCls = delay === 1 ? "reveal-delay-1" : delay === 2 ? "reveal-delay-2" : delay === 3 ? "reveal-delay-3" : "";
  const fromCls = from === "left" ? "reveal-from-left" : from === "right" ? "reveal-from-right" : from === "scale" ? "reveal-from-scale" : "";
  return (
    <Tag ref={ref} style={style} className={`reveal ${fromCls} ${delayCls} ${className}`}>
      {children}
    </Tag>
  );
}

export function SectionHeading({ kicker, title, desc }) {
  return (
    <Reveal className="group mb-10">
      <p className="hover-smooth inline-flex items-center gap-2 text-[#B81104] text-sm font-semibold tracking-[0.2em] uppercase hover:text-[#7a0c02] hover:tracking-[0.24em] transition-all duration-300 cursor-default">
        <span className="inline-block w-6 h-px bg-[#B81104]/60 transition-all duration-300 group-hover:w-10 group-hover:bg-gradient-to-r group-hover:from-[#FFFACD] group-hover:to-[#B81104]" aria-hidden="true" />
        {kicker}
      </p>
      <h2 className="text-3xl md:text-4xl font-bold mt-2 text-slate-900 tracking-tight hover-smooth hover:translate-x-1 cursor-default">
        {title}
      </h2>
      {desc ? <p className="text-slate-600 mt-3 max-w-2xl leading-relaxed">{desc}</p> : null}
    </Reveal>
  );
}
