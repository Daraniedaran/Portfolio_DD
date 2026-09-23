import { portfolio } from "../data/portfolio";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/60 backdrop-blur-md py-8 mt-4 hover:bg-white/80 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-slate-500 hover:text-slate-700 transition-colors duration-300 cursor-default">
          © {new Date().getFullYear()} {portfolio.name} • B.Tech IT &apos;27 • Built with React & Tailwind CSS
        </p>
        <div className="flex items-center gap-5 text-sm">
          <a href="#home" className="link-underline hover-smooth hover:-translate-y-0.5 text-slate-500 hover:text-[#B81104] transition-colors duration-300 font-medium">Back to Top</a>
          <a href={portfolio.socials.github} target="_blank" rel="noopener noreferrer" className="link-underline hover-smooth hover:-translate-y-0.5 text-slate-500 hover:text-[#B81104] transition-colors duration-300 font-medium">GitHub</a>
          <a href={portfolio.socials.linkedin} target="_blank" rel="noopener noreferrer" className="link-underline hover-smooth hover:-translate-y-0.5 text-slate-500 hover:text-[#B81104] transition-colors duration-300 font-medium">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
