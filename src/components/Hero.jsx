import { useState } from "react";
import { ArrowDown, Check, Copy, FileText, Mail, MapPin, Sparkles } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons";
import { portfolio } from "../data/portfolio";
import Reveal from "./Reveal";

function ProfilePhotoCard() {
  return (
    <div className="group relative mx-auto w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[380px] hover-smooth hover-lift">
      {/* Ambient background glow halo — light premium */}
      <div
        className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-tr from-[#FFFACD]/80 via-[#B81104]/20 to-[#FFFACD]/60 blur-2xl opacity-80 animate-pulse-soft transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />

      {/* Outer frame container */}
      <div className="relative premium-card rounded-[2.2rem] p-3 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:shadow-[0_28px_70px_-20px_rgba(184,17,4,0.45)] group-hover:border-[#B81104]/30">
        {/* Image wrapper */}
        <div className="zoom-img relative rounded-[1.75rem] overflow-hidden aspect-[4/5] bg-gradient-to-b from-[#FFFACD]/60 to-white shadow-inner">
          <img
            src={`${import.meta.env.BASE_URL}profile.jpg`}
            alt={`${portfolio.name} - Full Stack Developer`}
            className="w-full h-full object-cover object-top"
            loading="eager"
          />

          {/* Vignette & bottom gradient — light */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/85 via-white/10 to-transparent pointer-events-none" />

          {/* Top subtle badge */}
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-mono font-semibold text-[#7a0c02] border border-white/80 bg-white/85 backdrop-blur-md flex items-center gap-1.5 shadow-lg hover-smooth hover-scale-sm hover:shadow-xl hover:border-[#B81104]/30 cursor-default">
            <Sparkles size={12} className="text-[#B81104] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            <span>Class of &apos;27</span>
          </div>

          {/* Bottom name and role overlay on image */}
          <div className="absolute bottom-3 inset-x-3 p-3.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-white shadow-xl flex items-center justify-between gap-3 hover-smooth hover:border-[#B81104]/20 hover:shadow-2xl hover:-translate-y-0.5">
            <div>
              <p className="text-slate-900 font-bold text-sm tracking-wide">{portfolio.name}</p>
              <p className="text-xs text-[#B81104] font-mono">Full Stack Developer</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-mono font-medium shrink-0 transition-all duration-300 hover:bg-emerald-100 hover:shadow-md hover:scale-105">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(portfolio.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <header id="home" className="min-h-svh flex items-center pt-28 pb-16 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 w-full grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-14 items-center relative z-10">
        {/* Left Column: Intro */}
        <div>
          <Reveal>
            <div className="hover-smooth hover-lift-sm hover:shadow-[0_12px_32px_-10px_rgba(184,17,4,0.45)] hover:border-[#B81104]/30 inline-flex items-center gap-2.5 text-xs font-semibold tracking-wide text-[#7a0c02] bg-white/80 border border-[#B81104]/15 rounded-full px-4 py-1.5 shadow-[0_8px_24px_-8px_rgba(184,17,4,0.35)] backdrop-blur-md cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Available for Internships & Projects</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">{portfolio.location}</span>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mt-6 text-slate-900">
              Hi, I&apos;m{" "}
              <span className="premium-text-gradient">
                {portfolio.name}
              </span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-semibold mt-3 text-slate-800 flex items-center gap-2 flex-wrap">
              <span>{portfolio.title}</span>
              <span className="text-[#7a0c02] text-sm bg-[#FFFACD]/70 border border-[#B81104]/20 rounded-md px-2.5 py-0.5 font-mono font-medium">
                B.Tech IT &apos;27
              </span>
            </p>
          </Reveal>

          <Reveal delay={2}>
            <p className="text-base sm:text-lg text-slate-600 mt-6 max-w-xl leading-relaxed">
              {portfolio.tagline}
            </p>
          </Reveal>

          {/* Quick Tech Badges */}
          <Reveal delay={2} className="flex flex-wrap gap-2 mt-6">
            {["React.js", "FastAPI", "Python", "Firebase", "MySQL", "Tailwind CSS"].map((tech) => (
              <span
                key={tech}
                className="hover-smooth hover-lift-sm hover:shadow-[0_10px_24px_-8px_rgba(184,17,4,0.4)] hover:scale-[1.04] active:scale-95 text-xs font-mono font-medium text-slate-700 bg-white/80 border border-slate-200 rounded-lg px-2.5 py-1 shadow-sm hover:border-[#B81104]/40 hover:text-[#B81104] hover:bg-gradient-to-r hover:from-[#FFFACD] hover:to-[#B81104]/15 transition-colors backdrop-blur-sm cursor-default"
              >
                {tech}
              </span>
            ))}
          </Reveal>

          {/* Actions */}
          <Reveal delay={3} className="flex flex-wrap items-center gap-3 mt-8">
            <a
              href="#projects"
              className="shine pressable hover-smooth hover-lift group/cta inline-flex items-center gap-2 bg-gradient-to-r from-[#FFFACD] to-[#B81104] hover:from-[#FFEFA8] hover:to-[#8f0d03] text-white font-semibold px-6 py-3 rounded-xl shadow-[0_12px_30px_-8px_rgba(184,17,4,0.55)] hover:shadow-[0_20px_45px_-10px_rgba(184,17,4,0.7)] transition-all"
            >
              Explore Projects <ArrowDown size={17} className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cta:translate-y-1 group-hover/cta:scale-110" />
            </a>

            <button
              onClick={handleCopyEmail}
              className="pressable hover-smooth hover-lift-sm hover:shadow-xl hover:border-[#B81104]/40 hover:bg-white hover:-translate-y-0.5 inline-flex items-center gap-2 bg-white/85 backdrop-blur-md border border-slate-200 px-5 py-3 rounded-xl text-slate-800 transition-all font-medium text-sm group cursor-pointer shadow-sm"
              title="Click to copy email address"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-emerald-600 scale-110" />
                  <span className="text-emerald-700 font-semibold">Copied Email!</span>
                </>
              ) : (
                <>
                  <Copy size={16} className="text-slate-500 group-hover:text-[#B81104] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300" />
                  <span>Copy Email</span>
                </>
              )}
            </button>

            <a
              href={portfolio.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pressable hover-smooth hover-lift-sm hover:shadow-xl hover:border-[#B81104]/40 hover:-translate-y-0.5 group/resume inline-flex items-center gap-2 bg-white/85 backdrop-blur-md border border-slate-200 px-4 py-3 rounded-xl text-slate-700 hover:text-[#B81104] hover:bg-white transition-colors text-sm font-medium shadow-sm"
              title="View Resume"
            >
              <FileText size={16} className="text-[#B81104] transition-transform duration-300 group-hover/resume:scale-110 group-hover/resume:-rotate-6" />
              <span>Resume</span>
            </a>
          </Reveal>

          {/* Socials & Location */}
          <Reveal delay={3} className="flex items-center gap-3 mt-8">
            <a
              href={portfolio.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="pressable hover-smooth hover-lift hover:scale-110 hover:shadow-xl hover:border-[#B81104]/40 hover:-translate-y-1 w-10 h-10 bg-white/85 backdrop-blur-md border border-slate-200 rounded-xl grid place-items-center text-slate-600 hover:text-white hover:bg-gradient-to-r hover:from-[#FFFACD] hover:to-[#B81104] transition-all shadow-sm"
            >
              <GithubIcon size={18} />
            </a>
            <a
              href={portfolio.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="pressable hover-smooth hover-lift hover:scale-110 hover:shadow-xl hover:border-[#B81104]/40 hover:-translate-y-1 w-10 h-10 bg-white/85 backdrop-blur-md border border-slate-200 rounded-xl grid place-items-center text-slate-600 hover:text-white hover:bg-gradient-to-r hover:from-[#FFFACD] hover:to-[#B81104] transition-all shadow-sm"
            >
              <LinkedinIcon size={18} />
            </a>
            <a
              href={`mailto:${portfolio.email}`}
              aria-label="Send Direct Email"
              className="pressable hover-smooth hover-lift hover:scale-110 hover:shadow-xl hover:border-[#B81104]/40 hover:-translate-y-1 w-10 h-10 bg-white/85 backdrop-blur-md border border-slate-200 rounded-xl grid place-items-center text-slate-600 hover:text-white hover:bg-gradient-to-r hover:from-[#FFFACD] hover:to-[#B81104] transition-all shadow-sm"
            >
              <Mail size={18} />
            </a>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500 ml-2 font-mono hover-smooth hover:text-[#B81104] cursor-default">
              <MapPin size={13} className="text-[#B81104]" /> {portfolio.location}
            </span>
          </Reveal>

          {/* Key Stats Bar */}
          <div className="grid grid-cols-3 gap-3 mt-10 max-w-lg">
            {portfolio.stats.map((s, idx) => (
              <Reveal key={s.label} delay={idx} className="group/stats hover-smooth hover-lift hover-glow hover:scale-[1.03] bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl p-3.5 text-center shadow-[0_8px_24px_-12px_rgba(15,23,42,0.15)] transition-all cursor-default">
                <p className="text-2xl font-extrabold text-slate-900 tracking-tight transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/stats:scale-110 group-hover/stats:text-[#B81104]">{s.value}</p>
                <p className="text-[11px] font-semibold text-slate-500 mt-0.5 uppercase tracking-wider">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Right Column: Profile Photo Card */}
        <Reveal delay={2} className="w-full flex justify-center">
          <ProfilePhotoCard />
        </Reveal>
      </div>
    </header>
  );
}
