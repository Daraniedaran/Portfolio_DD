import { useEffect, useState } from "react";
import { Menu, X, FileText, Home, User, Cpu, GraduationCap, FolderKanban, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { portfolio } from "../data/portfolio";

const SPRING = { type: "spring", stiffness: 420, damping: 30, mass: 0.7 };

const NAV_ICONS = {
  home: Home,
  about: User,
  skills: Cpu,
  education: GraduationCap,
  projects: FolderKanban,
  contact: Mail,
};

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

const drawerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

const drawerItem = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -8, transition: { duration: 0.15 } },
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
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

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open ]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 pt-3">
      <nav
        id="topnav"
        aria-label="Primary"
        className={`max-w-5xl mx-auto flex items-center justify-between rounded-2xl border transition-all duration-300 ${
          scrolled
            ? "bg-white/85 backdrop-blur-xl border-slate-200/80 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.18)] px-4 py-2.5"
            : "border-transparent bg-transparent px-2 py-3"
        }`}
      >
        {/* Brand */}
        <a
          href="#home"
          aria-label={`${portfolio.name} — home`}
          className="group flex items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#B81104] focus-visible:ring-offset-1 focus-visible:ring-offset-white"
        >
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-[#FFFACD] via-[#B81104] to-[#7a0c02] text-xs font-extrabold text-white shadow-[0_8px_20px_-6px_rgba(184,17,4,0.6)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-[0_10px_28px_-6px_rgba(184,17,4,0.7)]">
            {portfolio.initials}
          </span>
          <span className="hidden sm:block text-sm font-bold text-slate-900 transition-colors duration-300 group-hover:text-[#B81104]">
            {portfolio.name}
          </span>
        </a>

        {/* Desktop glass pill — always-visible labels */}
        <div className="hidden md:flex items-center rounded-full border border-slate-200/80 bg-white/75 px-2 py-1.5 backdrop-blur-xl shadow-sm">
          <ul className="flex items-center gap-1" aria-label="Portfolio sections">
            {LINKS.map((l) => {
              const Icon = NAV_ICONS[l.href.slice(1)];
              const isActive = active === l.href.slice(1);
              return (
                <li key={l.href} className="shrink-0">
                  <motion.a
                    href={l.href}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    transition={SPRING}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative flex h-8 items-center rounded-full px-3 outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#B81104] focus-visible:ring-offset-1 focus-visible:ring-offset-white ${
                      isActive ? "text-[#B81104]" : "text-slate-600 hover:text-[#B81104]"
                    }`}
                  >
                    {/* Sliding active pill */}
                    {isActive && (
                      <motion.span
                        layoutId="navbar-active"
                        transition={SPRING}
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full bg-[#FFFACD]/90 border border-[#B81104]/25 shadow-sm"
                      />
                    )}
                    {/* Aurora sweep on hover */}
                    <span
                      aria-hidden="true"
                      className={`nav-aurora absolute inset-0 rounded-full transition-opacity duration-300 ${
                        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                    />
                    {/* Icon + always-visible label */}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Icon
                        size={14}
                        strokeWidth={2.2}
                        aria-hidden="true"
                        className={`transition-all duration-300 group-hover:scale-125 group-hover:-rotate-12 ${
                          isActive ? "text-[#B81104]" : "group-hover:text-[#B81104]"
                        }`}
                      />
                      <span className="whitespace-nowrap text-[12px] font-medium leading-none">
                        {l.label}
                      </span>
                    </span>
                  </motion.a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href={portfolio.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shine hover-lift-sm inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FFFACD] to-[#B81104] px-3.5 py-2 text-xs font-semibold text-white shadow-[0_8px_20px_-6px_rgba(184,17,4,0.55)] transition-all duration-300 hover:from-[#FFEFA8] hover:to-[#8f0d03] hover:shadow-[0_14px_32px_-8px_rgba(184,17,4,0.65)] outline-none focus-visible:ring-2 focus-visible:ring-[#B81104] focus-visible:ring-offset-2 group/resume"
          >
            <FileText
              size={14}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover/resume:scale-110 group-hover/resume:-rotate-6"
            />
            Resume
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close navigation" : "Open navigation"}
            className="md:hidden p-2 text-slate-600 hover:text-[#B81104] bg-white/80 border border-slate-200 hover:border-[#B81104]/40 rounded-xl shadow-sm transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#B81104] focus-visible:ring-offset-1"
          >
            <span
              className={`block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open ? "rotate-90" : ""
              }`}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden mt-2 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-2xl backdrop-blur-2xl origin-top"
          >
            <motion.ul
              variants={drawerContainer}
              initial="hidden"
              animate="show"
              exit="exit"
              aria-label="Portfolio sections"
              className="flex flex-col gap-1"
            >
              {LINKS.map((l) => {
                const Icon = NAV_ICONS[l.href.slice(1)];
                const isActive = active === l.href.slice(1);
                return (
                  <motion.li key={l.href} variants={drawerItem}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#B81104] focus-visible:ring-offset-1 ${
                        isActive
                          ? "bg-[#FFFACD]/60 text-[#B81104] border border-[#B81104]/20"
                          : "text-slate-700 hover:text-[#B81104] hover:bg-[#FFFACD]/50 hover:translate-x-1 border border-transparent"
                      }`}
                    >
                      <Icon
                        size={16}
                        strokeWidth={2.2}
                        aria-hidden="true"
                        className={isActive ? "text-[#B81104]" : "text-slate-500"}
                      />
                      {l.label}
                    </a>
                  </motion.li>
                );
              })}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
