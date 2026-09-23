import { useState } from "react";
import { ArrowUpRight, Bot, Cpu, ExternalLink, Network, Sparkles, Wifi } from "lucide-react";
import { GithubIcon } from "./icons";
import { portfolio } from "../data/portfolio";
import Reveal, { SectionHeading } from "./Reveal";

const PROJECT_META = {
  HotFiNet: {
    tag: "Mobile P2P System",
    accent: "from-[#FFFACD]/70 via-[#FDEEDA] to-white",
    border: "group-hover:border-[#B81104]/40",
    badge: "bg-[#B81104] text-white border-[#B81104]",
    icon: Wifi,
    highlights: ["Secure QR Handshake", "Coin Economy", "Offline-Ready"],
  },
  "Smart Academic Companion": {
    tag: "AI Education Assistant",
    accent: "from-[#FFFACD] via-[#FDEEDA] to-white",
    border: "group-hover:border-[#B81104]/40",
    badge: "bg-gradient-to-r from-[#FFFACD] to-[#B81104] text-white border-[#B81104]/30",
    icon: Bot,
    highlights: ["Interactive Study Bot", "Performance Analytics", "Curriculum Tracking"],
  },
  "AI Interview Preparation": {
    tag: "AI Evaluation Platform",
    accent: "from-emerald-100 via-teal-50 to-white",
    border: "group-hover:border-[#B81104]/40",
    badge: "bg-emerald-600 text-white border-emerald-600",
    icon: Cpu,
    highlights: ["Role-Based Questioning", "Scoring & Feedback", "Progress Insights"],
  },
};

export default function Projects() {
  return (
    <section id="projects" className="py-24 scroll-mt-20 relative">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeading
          kicker="Portfolio"
          title="Featured Projects"
          desc="Real-world engineering applications built with modern frontend and backend architectures."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.projects.map((p, i) => {
            const meta = PROJECT_META[p.title] || {
              tag: "Web Application",
              accent: "from-[#FFFACD] via-transparent to-white",
              border: "group-hover:border-[#B81104]/40",
              badge: "bg-[#B81104] text-white border-[#B81104]",
              icon: Sparkles,
              highlights: ["Full Stack", "Responsive UI"],
            };
            const Icon = meta.icon;

            return (
              <Reveal
                key={p.title}
                from={i % 2 === 0 ? "left" : "right"}
                style={{ transitionDelay: `${i * 0.15}s` }}
                className={`shine premium-card rounded-2xl overflow-hidden flex flex-col group hover-smooth hover-lift hover:shadow-[0_28px_70px_-18px_rgba(184,17,4,0.45)] hover:-translate-y-2 hover:scale-[1.01] ${meta.border} transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]`}
              >
                {/* Project Header Banner */}
                <div
                  className={`relative p-6 bg-gradient-to-br ${meta.accent} border-b border-slate-200/70 overflow-hidden`}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" aria-hidden="true" />
                  <div className="relative flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`hover-smooth hover:scale-105 inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-sm ${meta.badge}`}
                    >
                      <Icon size={12} className="transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" /> {meta.tag}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-medium group-hover:text-[#B81104] transition-colors duration-300">
                      0{i + 1}
                    </span>
                  </div>

                  <h3 className="relative text-xl font-bold text-slate-900 group-hover:text-[#B81104] transition-colors duration-300">
                    {p.title}
                  </h3>
                </div>

                {/* Project Body */}
                <div className="p-6 flex flex-col flex-1 bg-white/60 group-hover:bg-white/80 transition-colors duration-500">
                  <p className="text-sm text-slate-600 leading-relaxed flex-1">
                    {p.desc}
                  </p>

                  {/* Highlights */}
                  <div className="mt-4 pt-4 border-t border-slate-200 space-y-1.5">
                    {meta.highlights.map((h) => (
                      <div key={h} className="group/h flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 hover:translate-x-1 transition-all duration-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B81104] group-hover/h:scale-125 group-hover/h:bg-gradient-to-r group-hover/h:from-[#FFFACD] group-hover/h:to-[#B81104] transition-all duration-300" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {p.stack.map((s) => (
                      <span
                        key={s}
                        className="hover-smooth hover:scale-105 hover:-translate-y-0.5 hover:border-[#B81104]/40 hover:bg-gradient-to-r hover:from-[#FFFACD] hover:to-[#B81104]/15 hover:text-[#7a0c02] hover:shadow-md text-[11px] font-mono font-medium bg-slate-50 text-slate-700 border border-slate-200 rounded-md px-2.5 py-1 cursor-default"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Action Links */}
                  <div className="flex items-center gap-2.5 mt-6 pt-2">
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pressable hover-smooth hover-lift-sm hover:shadow-lg hover:scale-[1.02] group/btn flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-slate-900 hover:bg-gradient-to-r hover:from-[#FFFACD] hover:to-[#B81104] hover:text-white text-white rounded-xl py-2.5 transition-all duration-300"
                    >
                      <GithubIcon size={14} className="transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:-rotate-6" /> Source Code
                    </a>
                    <a
                      href={p.live && p.live !== "#" ? p.live : p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shine pressable hover-smooth hover-lift-sm hover:shadow-[0_14px_32px_-8px_rgba(184,17,4,0.65)] hover:scale-[1.03] group/view inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-[#FFFACD] to-[#B81104] hover:from-[#FFEFA8] hover:to-[#8f0d03] text-white rounded-xl px-4 py-2.5 transition-all"
                    >
                      View <ArrowUpRight size={14} className="transition-transform duration-300 group-hover/view:translate-x-0.5 group-hover/view:-translate-y-0.5 group-hover/view:scale-110" />
                    </a>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
