import { useEffect, useState } from "react";
import { Award, ArrowRight, BadgeCheck, GraduationCap, HeartHandshake, Star, Trophy, X } from "lucide-react";
import { portfolio } from "../data/portfolio";
import Reveal, { SectionHeading } from "./Reveal";

const TYPE_ICONS = {
  certification: BadgeCheck,
  hackathon: Trophy,
  volunteer: HeartHandshake,
};

const CERTIFICATE_THEMES = {
  "IT Specialist – Python": {
    label: "Certification",
    chip: "bg-sky-50 text-sky-700 border-sky-200/90",
    dateHover: "group-hover:bg-sky-100 group-hover:text-sky-800",
    titleHover: "group-hover:text-sky-600",
    cardHover: "hover:border-sky-300 hover:shadow-[0_20px_50px_-16px_rgba(2,132,199,0.3)]",
    glow: "from-sky-400/25 to-blue-500/15",
    btn: "text-sky-700 bg-sky-50/80 border-sky-200/90 hover:text-white hover:bg-gradient-to-r hover:from-sky-500 hover:to-blue-600 hover:border-sky-500 hover:shadow-[0_12px_28px_-10px_rgba(2,132,199,0.6)]",
  },
  "Full Stack Development": {
    label: "Certification",
    chip: "bg-indigo-50 text-indigo-700 border-indigo-200/90",
    dateHover: "group-hover:bg-indigo-100 group-hover:text-indigo-800",
    titleHover: "group-hover:text-indigo-600",
    cardHover: "hover:border-indigo-300 hover:shadow-[0_20px_50px_-16px_rgba(79,70,229,0.3)]",
    glow: "from-indigo-400/25 to-purple-500/15",
    btn: "text-indigo-700 bg-indigo-50/80 border-indigo-200/90 hover:text-white hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:border-indigo-600 hover:shadow-[0_12px_28px_-10px_rgba(79,70,229,0.6)]",
  },
  "The Joy of Computing using Python — Elite (67%)": {
    label: "Elite NPTEL",
    chip: "bg-amber-50 text-amber-800 border-amber-300/90",
    dateHover: "group-hover:bg-amber-100 group-hover:text-amber-900",
    titleHover: "group-hover:text-amber-600",
    cardHover: "hover:border-amber-400 hover:shadow-[0_20px_50px_-16px_rgba(245,158,11,0.4)]",
    glow: "from-amber-400/30 to-orange-500/20",
    btn: "text-amber-800 bg-amber-50/80 border-amber-300/90 hover:text-white hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 hover:border-amber-500 hover:shadow-[0_12px_28px_-10px_rgba(245,158,11,0.6)]",
  },
  "Code 4 Change 2026 – Hackathon": {
    label: "Hackathon",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200/90",
    dateHover: "group-hover:bg-emerald-100 group-hover:text-emerald-800",
    titleHover: "group-hover:text-emerald-600",
    cardHover: "hover:border-emerald-300 hover:shadow-[0_20px_50px_-16px_rgba(5,150,105,0.3)]",
    glow: "from-emerald-400/25 to-teal-500/15",
    btn: "text-emerald-700 bg-emerald-50/80 border-emerald-200/90 hover:text-white hover:bg-gradient-to-r hover:from-emerald-600 hover:to-teal-600 hover:border-emerald-600 hover:shadow-[0_12px_28px_-10px_rgba(5,150,105,0.6)]",
  },
  "Volunteer – Photo Exhibition Contest 2K25": {
    label: "Volunteer",
    chip: "bg-rose-50 text-rose-700 border-rose-200/90",
    dateHover: "group-hover:bg-rose-100 group-hover:text-rose-800",
    titleHover: "group-hover:text-rose-600",
    cardHover: "hover:border-rose-300 hover:shadow-[0_20px_50px_-16px_rgba(244,63,94,0.3)]",
    glow: "from-rose-400/25 to-pink-500/15",
    btn: "text-rose-700 bg-rose-50/80 border-rose-200/90 hover:text-white hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-600 hover:border-rose-500 hover:shadow-[0_12px_28px_-10px_rgba(244,63,94,0.6)]",
  },
  "Volunteer – HackIndia 2026 Spark-3": {
    label: "Volunteer",
    chip: "bg-orange-50 text-orange-700 border-orange-200/90",
    dateHover: "group-hover:bg-orange-100 group-hover:text-orange-800",
    titleHover: "group-hover:text-orange-600",
    cardHover: "hover:border-orange-300 hover:shadow-[0_20px_50px_-16px_rgba(249,115,22,0.3)]",
    glow: "from-orange-400/25 to-red-500/15",
    btn: "text-orange-700 bg-orange-50/80 border-orange-200/90 hover:text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 hover:border-orange-500 hover:shadow-[0_12px_28px_-10px_rgba(249,115,22,0.6)]",
  },
};

const FALLBACK_PALETTES = Object.values(CERTIFICATE_THEMES);

export default function Education() {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <section id="education" className="py-20 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeading kicker="Education" title="Qualifications" desc="B.Tech IT at Mailam Engineering College, plus HSC and SSLC schooling." />
        <div className="relative pl-6 md:pl-8">
          <div className="absolute left-2 md:left-3 top-2 bottom-2 w-px bg-gradient-to-b from-[#FFFACD] via-[#B81104] to-[#7a0c02]" aria-hidden="true" />
          <div className="space-y-5">
            {portfolio.education.map((e, i) => (
              <Reveal key={e.degree} delay={i % 3} className="group relative premium-card rounded-2xl p-6 ml-2 hover-smooth hover-lift hover-glow hover:translate-x-1">
                <span className="absolute -left-[22px] md:-left-[26px] top-6 w-3 h-3 rounded-full bg-[#B81104] shadow-[0_0_12px_rgba(184,17,4,0.7)] ring-4 ring-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-125 group-hover:bg-gradient-to-r group-hover:from-[#FFFACD] group-hover:to-[#B81104] group-hover:shadow-[0_0_20px_rgba(184,17,4,0.8)]" aria-hidden="true" />
                <p className="text-xs font-semibold tracking-widest uppercase text-[#B81104]">{e.period}</p>
                <h3 className="text-lg font-semibold text-slate-900 mt-1 flex items-center gap-2 group-hover:text-[#B81104] transition-colors duration-300">
                  <GraduationCap size={18} className="text-[#B81104] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" /> {e.degree}
                </h3>
                <p className="text-sm text-slate-600 mt-1">{e.school} • <span className="text-slate-900 font-medium">{e.score}</span></p>
                <p className="text-sm text-slate-500 mt-2">{e.detail}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <div id="certificates" className="scroll-mt-24 pt-10">
          <Reveal className="group w-fit">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-lg group-hover:text-[#B81104] transition-colors duration-300">
              <Award size={19} className="text-amber-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" /> Certifications & Achievements
            </h3>
            <p className="text-sm text-slate-500 mt-1">Verified credentials, hackathons and community work.</p>
          </Reveal>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {portfolio.certifications.map((c, i) => {
            const item = typeof c === "string" ? { title: c, issuer: "", date: "", type: "certification" } : c;
            const theme = CERTIFICATE_THEMES[item.title] || FALLBACK_PALETTES[i % FALLBACK_PALETTES.length];
            const TypeIcon = TYPE_ICONS[item.type] || BadgeCheck;
            return (
              <Reveal
                key={item.title}
                delay={i % 3}
                className={`group relative overflow-hidden premium-card rounded-2xl p-5 hover-smooth hover-lift hover-glow hover:-translate-y-1.5 ${theme.cardHover} ${
                  item.highlight ? "ring-2 ring-amber-300 hover:ring-amber-400" : ""
                }`}
              >
                {/* Ambient corner glow */}
                <div className={`absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br ${theme.glow} blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none`} aria-hidden="true" />

                <div className="relative flex items-center justify-between gap-2">
                  <span className={`hover-smooth hover:scale-105 inline-flex items-center gap-1.5 text-[11px] font-semibold border rounded-full px-2.5 py-1 ${theme.chip}`}>
                    <TypeIcon size={13} className="transition-transform duration-300 group-hover:scale-110" /> {theme.label}
                  </span>
                  {item.date ? (
                    <span className={`text-[11px] font-medium text-slate-500 bg-slate-100 rounded-full px-2.5 py-1 whitespace-nowrap transition-colors duration-300 ${theme.dateHover}`}>{item.date}</span>
                  ) : null}
                </div>
                <p className={`font-semibold text-slate-900 mt-3 leading-snug flex items-start gap-1.5 transition-colors duration-300 ${theme.titleHover}`}>
                  <span>{item.title}</span>
                  {item.highlight ? <Star size={15} className="text-amber-500 shrink-0 mt-0.5 transition-transform duration-500 group-hover:rotate-[144deg] group-hover:scale-125" /> : null}
                </p>
                {item.issuer ? <p className="text-xs text-slate-500 mt-1.5">{item.issuer}</p> : null}
                {item.image ? (
                  <button
                    type="button"
                    onClick={() => setSelected(item)}
                    className={`pressable hover-smooth group/view mt-4 inline-flex items-center gap-1.5 text-xs font-semibold rounded-xl px-3.5 py-2 border transition-all duration-300 ${theme.btn}`}
                    aria-label={`View ${item.title} certificate`}
                  >
                    View Certificate
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover/view:translate-x-1" />
                  </button>
                ) : null}
              </Reveal>
            );
          })}
        </div>
        {selected ? (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            onClick={() => setSelected(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${selected.title} certificate preview`}
          >
            <div
              className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-200 bg-gradient-to-r from-[#FFFACD]/60 to-white">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{selected.title}</p>
                  {selected.issuer ? <p className="text-xs text-slate-500 truncate">{selected.issuer}{selected.date ? ` • ${selected.date}` : ""}</p> : null}
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="pressable hover-smooth shrink-0 w-9 h-9 grid place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-white hover:bg-gradient-to-r hover:from-[#FFFACD] hover:to-[#B81104] hover:border-[#B81104] hover:shadow-lg"
                  aria-label="Close certificate preview"
                >
                  <X size={17} />
                </button>
              </div>
              <img
                src={selected.image}
                alt={`${selected.title} certificate full view`}
                className="max-h-[78vh] w-full object-contain bg-slate-100"
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
