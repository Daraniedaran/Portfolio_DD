import { useEffect, useState } from "react";
import { Menu, X, FileText, Sparkles } from "lucide-react";
import { portfolio } from "../data/portfolio";

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const ids = LINKS.map((l) => l.href.slice(1));
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      obs.disconnect();
    };
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 pt-3 pointer-events-none transition-all duration-300">
      <nav
        id="topnav"
        className={`max-w-5xl mx-auto rounded-2xl transition-all duration-300 pointer-events-auto border ${
          scrolled
            ? "bg-white/85 backdrop-blur-xl border-slate-200/80 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.18)] px-4 py-2.5"
            : "border-transparent bg-transparent px-2 py-3"
        } flex items-center justify-between`}
      >
        {/* Brand */}
        <a href="#home" className="flex items-center gap-2.5 group hover-smooth">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FFFACD] via-[#B81104] to-[#7a0c02] grid place-items-center font-extrabold text-xs text-white shadow-[0_8px_20px_-6px_rgba(184,17,4,0.6)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:rotate-[-8deg] group-hover:shadow-[0_10px_28px_-6px_rgba(184,17,4,0.7)]">
            {portfolio.initials}
          </span>
          <div className="hidden sm:block">
            <span className="font-bold text-sm text-slate-900 group-hover:text-[#B81104] transition-colors duration-300">
              {portfolio.name}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-white/70 border border-slate-200/70 rounded-xl p-1 backdrop-blur-md shadow-sm hover-smooth hover:shadow-[0_10px_28px_-12px_rgba(184,17,4,0.3)] hover:border-[#B81104]/30">
          {LINKS.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:scale-[1.03] active:scale-95 ${
                  isActive
                    ? "text-[#B81104] bg-[#FFFACD]/60 shadow-sm border border-[#B81104]/20"
                    : "text-slate-600 hover:text-[#B81104] hover:bg-[#FFFACD]/50 hover:shadow-sm"
                }`}
              >
                {l.label}
              </a>
            );
          })}
        </div>

        {/* Action Button: Resume */}
        <div className="flex items-center gap-2">
          <a
            href={portfolio.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shine pressable hover-smooth hover-lift-sm inline-flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-[#FFFACD] to-[#B81104] hover:from-[#FFEFA8] hover:to-[#8f0d03] text-white px-3.5 py-2 rounded-xl transition-all shadow-[0_8px_20px_-6px_rgba(184,17,4,0.55)] hover:shadow-[0_14px_32px_-8px_rgba(184,17,4,0.65)] group/resume"
          >
            <FileText size={14} className="transition-transform duration-300 group-hover/resume:scale-110 group-hover/resume:-rotate-6" /> Resume
          </a>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-[#B81104] bg-white/80 border border-slate-200 hover:border-[#B81104]/40 rounded-xl shadow-sm hover-smooth hover-scale hover:shadow-md pressable"
            onClick={() => setOpen(!open)}
            aria-label="Toggle Navigation"
          >
            <span className={`block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "rotate-90" : ""}`}>
              {open ? <X size={20} /> : <Menu size={20} />}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden mt-2 bg-white/95 rounded-2xl p-3 border border-slate-200 shadow-2xl backdrop-blur-2xl pointer-events-auto">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-[#B81104] hover:bg-[#FFFACD]/50 hover:translate-x-1 hover:shadow-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
