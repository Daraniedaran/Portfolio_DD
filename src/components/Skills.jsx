import {
  Atom,
  Braces,
  Code2,
  Database,
  FileCode2,
  Flame,
  GitBranch,
  Layers,
  LayoutGrid,
  Network,
  Palette,
  PenTool,
  Server,
  Smartphone,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";
import { GithubIcon } from "./icons";
import { portfolio } from "../data/portfolio";
import Reveal, { SectionHeading } from "./Reveal";

const SKILL_ICONS = {
  Python: FileCode2,
  HTML: Code2,
  CSS: Palette,
  JavaScript: Braces,
  "React.js": Atom,
  "React Native": Smartphone,
  "Tailwind CSS": Wind,
  Figma: PenTool,
  FastAPI: Zap,
  Firebase: Flame,
  MySQL: Database,
  "REST APIs": Network,
  Git: GitBranch,
  GitHub: GithubIcon,
  "Microsoft 365": LayoutGrid,
};

const GROUP_ICONS = {
  Languages: Braces,
  Frontend: Layers,
  "Backend / Data": Server,
  Tools: Wrench,
};

const GROUP_ACCENTS = {
  Languages: "from-amber-500 to-orange-500 text-white",
  Frontend: "from-[#B81104] to-[#E2571D] text-white",
  "Backend / Data": "from-emerald-500 to-teal-500 text-white",
  Tools: "from-[#FFFACD] to-[#B81104] text-white",
};

const GROUP_TAGLINES = {
  Languages: "Core programming foundations",
  Frontend: "Interfaces & experiences",
  "Backend / Data": "APIs, logic & storage",
  Tools: "Workflow, design & delivery",
};

const GROUP_BARS = {
  Languages: "bg-gradient-to-b from-amber-300 to-orange-500",
  Frontend: "bg-gradient-to-b from-cyan-300 to-sky-500",
  "Backend / Data": "bg-gradient-to-b from-emerald-300 to-teal-500",
  Tools: "bg-gradient-to-b from-[#FFFACD] to-[#B81104]",
};

export default function Skills() {
  return (
    <section id="skills" className="py-20 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeading kicker="Skills" title="What I work with" />
        <Reveal className="premium-card rounded-2xl divide-y divide-slate-200/80 overflow-hidden hover-smooth hover:shadow-[0_24px_60px_-20px_rgba(184,17,4,0.3)]">
          {portfolio.skills.map((g) => {
            const GroupIcon = GROUP_ICONS[g.group] || Layers;
            const accent = GROUP_ACCENTS[g.group] || "from-[#FFFACD] to-[#B81104] text-white";
            return (
              <div key={g.group} className="group/row relative grid sm:grid-cols-[220px_1fr] gap-4 p-5 sm:p-6 items-center overflow-hidden hover:bg-[#FFFACD]/40 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
                <span className={`absolute left-0 top-5 bottom-5 w-1 rounded-full transition-all duration-300 group-hover/row:scale-y-110 group-hover/row:w-1.5 ${GROUP_BARS[g.group] || "bg-[#B81104]"}`} aria-hidden="true" />
                <div className="flex items-center gap-3 pl-2">
                  <span className={`w-11 h-11 rounded-xl bg-gradient-to-br ${accent} grid place-items-center shrink-0 shadow-lg transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/row:scale-110 group-hover/row:rotate-[-8deg] group-hover/row:shadow-xl`}>
                    <GroupIcon size={20} />
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 leading-tight group-hover/row:text-[#B81104] transition-colors duration-300">{g.group}</h3>
                    <p className="text-xs text-slate-500">{GROUP_TAGLINES[g.group] || ""}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((s) => {
                    const Icon = SKILL_ICONS[s] || Code2;
                    return (
                      <span
                        key={s}
                        className="pressable hover-smooth hover-lift-sm hover:scale-[1.05] group inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 shadow-sm hover:border-[#B81104]/40 hover:bg-gradient-to-r hover:from-[#FFFACD] hover:to-[#B81104]/15 hover:text-[#7a0c02] hover:shadow-[0_12px_28px_-10px_rgba(184,17,4,0.5)] transition-all duration-300 cursor-default"
                      >
                        <Icon size={16} className="text-slate-500 group-hover:text-[#B81104] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300" />
                        {s}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
