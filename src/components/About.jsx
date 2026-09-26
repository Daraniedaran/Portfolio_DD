import { Brain, Code2, Database, GraduationCap, Laptop, Sparkles } from "lucide-react";
import { portfolio } from "../data/portfolio";
import Reveal, { SectionHeading } from "./Reveal";

export default function About() {
  const pillars = [
    {
      title: "Frontend Engineering",
      desc: "Creating responsive, interactive user experiences with React.js, React Native, and Tailwind CSS.",
      icon: Laptop,
      accent: "from-[#B81104] to-[#E2571D] text-white",
    },
    {
      title: "Backend & Systems",
      desc: "Designing fast, reliable REST APIs using FastAPI, Python, Firebase, and relational MySQL databases.",
      icon: Database,
      accent: "from-[#FFFACD] to-[#B81104] text-white",
    },
    {
      title: "AI-Powered Applications",
      desc: "Integrating intelligent LLM capabilities, chatbots, and automated evaluation workflows.",
      icon: Brain,
      accent: "from-emerald-500 to-teal-500 text-white",
    },
  ];

  return (
    <section id="about" className="py-24 scroll-mt-20 relative">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeading
          kicker="About Me"
          title="Background & Engineering Focus"
          desc="Final-year B.Tech IT student combining foundational computer science with modern full-stack development."
        />

        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Story Bento Card */}
          <Reveal className="group lg:col-span-7 premium-card rounded-2xl p-7 md:p-8 flex flex-col justify-between hover-smooth hover-lift hover-glow">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FFFACD] to-[#B81104] text-white grid place-items-center shadow-[0_8px_20px_-6px_rgba(184,17,4,0.6)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:rotate-[-8deg] group-hover:shadow-[0_12px_28px_-6px_rgba(184,17,4,0.7)]">
                  <GraduationCap size={17} />
                </span>
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#B81104]">
                  Education & Journey
                </span>
              </div>

              <p className="text-slate-800 text-base leading-relaxed">
                {portfolio.about}
              </p>

              <p className="text-slate-600 text-sm mt-4 leading-relaxed">
                I thrive at the intersection of clean user interfaces and resilient backend systems. Whether designing peer-to-peer data solutions like <strong className="text-slate-900 hover:text-[#B81104] transition-colors duration-300">HotFiNet</strong> or engineering AI-driven student assistants, my goal is to build software that is both technically sound and impactful.
              </p>
            </div>

            {/* Quick Highlights Footer */}
            <div className="pt-6 mt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="hover-smooth hover-lift-sm hover:border-[#B81104]/30 hover:shadow-md hover:bg-white bg-slate-50 border border-slate-200 rounded-xl p-3 cursor-default">
                <span className="block text-[11px] font-mono text-slate-500">Current CGPA</span>
                <span className="text-lg font-bold text-slate-900">8.43 / 10</span>
              </div>
              <div className="hover-smooth hover-lift-sm hover:border-[#B81104]/30 hover:shadow-md hover:bg-white bg-slate-50 border border-slate-200 rounded-xl p-3 cursor-default">
                <span className="block text-[11px] font-mono text-slate-500">College</span>
                <span className="text-xs font-bold text-slate-900 truncate block">Mailam Eng. College</span>
              </div>
              <div className="hover-smooth hover-lift-sm hover:shadow-md hover:scale-[1.02] bg-[#FFFACD]/40 border border-[#B81104]/15 hover:border-[#B81104]/40 rounded-xl p-3 col-span-2 sm:col-span-1 cursor-default">
                <span className="block text-[11px] font-mono text-slate-500">Graduation</span>
                <span className="text-lg font-bold text-[#B81104]">Class of 2027</span>
              </div>
            </div>
          </Reveal>

          {/* Pillars Column */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <Reveal
                  key={p.title}
                  delay={idx}
                  className="group premium-card rounded-2xl p-5 hover-smooth hover-lift hover-glow flex items-start gap-4 flex-1 cursor-default"
                >
                  <span
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${p.accent} grid place-items-center shrink-0 mt-0.5 shadow-lg transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:rotate-[-8deg] group-hover:shadow-xl`}
                  >
                    <Icon size={20} />
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-base group-hover:text-[#B81104] transition-colors duration-300">{p.title}</h3>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{p.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
