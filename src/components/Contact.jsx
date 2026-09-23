import { useState } from "react";
import { Check, Clock, Copy, Mail, MessageSquare, Phone, Send } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons";
import { portfolio } from "../data/portfolio";
import Reveal, { SectionHeading } from "./Reveal";

export default function Contact() {
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(portfolio.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();

    setStatus("sending");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${portfolio.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `Portfolio inquiry from ${name}`,
          _template: "table",
          _captcha: "false",
          _replyto: email,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to send");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-24 scroll-mt-20 relative">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeading
          kicker="Get In Touch"
          title="Let's Build Something Together"
          desc="I'm actively looking for internships, full-time opportunities, and collaborative software projects."
        />

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Channels & Status */}
          <div className="lg:col-span-5 space-y-4">
            <Reveal className="group premium-card rounded-2xl p-6 hover-smooth hover-lift hover-glow">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse group-hover:scale-125 transition-transform duration-300" />
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-700">
                  Open to Opportunities
                </span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Whether you have an internship opening, a project idea, or just want to connect, my inbox is always open.
              </p>

              <div className="flex items-center gap-2 mt-4 text-xs font-mono text-slate-500 pt-3 border-t border-slate-200">
                <Clock size={13} className="text-[#B81104] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <span>Response time: Usually within 24 hours</span>
              </div>
            </Reveal>

            {/* Quick Contact Links */}
            {[
              {
                icon: Mail,
                label: "Email",
                value: portfolio.email,
                href: `mailto:${portfolio.email}`,
                action: "Send Email",
                isCopyable: true,
              },
              {
                icon: Phone,
                label: "Phone",
                value: portfolio.phone,
                href: `tel:${portfolio.phone.replace(/\s/g, "")}`,
                action: "Call",
              },
              {
                icon: LinkedinIcon,
                label: "LinkedIn",
                value: "daraniedaran-k",
                href: portfolio.socials.linkedin,
                action: "Connect",
              },
              {
                icon: GithubIcon,
                label: "GitHub",
                value: "Daraniedaran",
                href: portfolio.socials.github,
                action: "Follow",
              },
            ].map((c, i) => (
              <Reveal key={c.label} delay={i % 3}>
                <div className="group premium-card rounded-2xl p-4 hover-smooth hover-lift hover-glow hover:translate-x-1 flex items-center justify-between gap-4">
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-3.5 flex-1 min-w-0"
                  >
                    <span className="w-10 h-10 rounded-xl bg-[#FFFACD]/50 border border-[#B81104]/15 grid place-items-center text-[#B81104] group-hover:border-[#B81104]/40 group-hover:bg-gradient-to-r group-hover:from-[#FFFACD] group-hover:to-[#B81104] group-hover:text-white group-hover:scale-110 group-hover:rotate-[-8deg] group-hover:shadow-[0_10px_24px_-8px_rgba(184,17,4,0.6)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0">
                      <c.icon size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="block text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                        {c.label}
                      </span>
                      <span className="block text-sm font-medium text-slate-900 truncate group-hover:text-[#B81104] transition-colors duration-300">
                        {c.value}
                      </span>
                    </div>
                  </a>

                  {c.isCopyable && (
                    <button
                      onClick={handleCopyEmail}
                      className="pressable hover-smooth hover:scale-105 hover:shadow-md text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-gradient-to-r hover:from-[#FFFACD] hover:to-[#B81104] hover:text-white hover:border-[#B81104] text-slate-600 border border-slate-200 transition-all duration-300 cursor-pointer flex items-center gap-1.5 shrink-0"
                      title="Copy Email"
                    >
                      {copied ? (
                        <>
                          <Check size={13} className="text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} className="transition-transform duration-300 group-hover:scale-110" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          {/* Right Column: Direct Message Form */}
          <Reveal className="group/form lg:col-span-7 premium-card rounded-2xl p-7 md:p-8 relative hover-smooth hover:shadow-[0_28px_70px_-20px_rgba(184,17,4,0.35)]">
            <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <MessageSquare size={19} className="text-[#B81104] transition-transform duration-300 group-hover/form:scale-110 group-hover/form:-rotate-6" /> Send a Message
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Fill out the form below — your message goes directly to my inbox. I usually reply within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="group/field">
                  <label className="block text-xs font-mono text-slate-500 mb-1.5 group-hover/field:text-[#B81104] transition-colors duration-300">Your Name *</label>
                  <input
                    name="name"
                    required
                    placeholder="e.g. Alex Johnson"
                    className="hover-smooth hover:border-[#B81104]/40 hover:shadow-md hover:-translate-y-px w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#B81104] focus:ring-2 focus:ring-[#B81104]/15 focus:shadow-lg focus:-translate-y-px transition-all shadow-sm"
                  />
                </div>
                <div className="group/field">
                  <label className="block text-xs font-mono text-slate-500 mb-1.5 group-hover/field:text-[#B81104] transition-colors duration-300">Your Email *</label>
                  <input
                    name="email"
                    required
                    type="email"
                    placeholder="alex@company.com"
                    className="hover-smooth hover:border-[#B81104]/40 hover:shadow-md hover:-translate-y-px w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#B81104] focus:ring-2 focus:ring-[#B81104]/15 focus:shadow-lg focus:-translate-y-px transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="group/field">
                <label className="block text-xs font-mono text-slate-500 mb-1.5 group-hover/field:text-[#B81104] transition-colors duration-300">Message *</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Hi Daraniedaran, I checked out your projects (HotFiNet, AI Assistant) and would love to discuss an opportunity..."
                  className="hover-smooth hover:border-[#B81104]/40 hover:shadow-md w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#B81104] focus:ring-2 focus:ring-[#B81104]/15 focus:shadow-lg transition-all resize-none leading-relaxed shadow-sm"
                />
              </div>

              {/* Anti-spam */}
              <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

              <button
                type="submit"
                disabled={status === "sending"}
                className="shine pressable hover-smooth hover-lift hover:shadow-[0_20px_45px_-10px_rgba(184,17,4,0.7)] hover:scale-[1.01] group/send w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#FFFACD] to-[#B81104] hover:from-[#FFEFA8] hover:to-[#8f0d03] text-white font-bold rounded-xl py-3.5 transition-all shadow-[0_12px_30px_-8px_rgba(184,17,4,0.55)] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Send size={16} className={`transition-transform duration-300 group-hover/send:translate-x-1 group-hover/send:-translate-y-0.5 group-hover/send:scale-110 ${status === "sending" ? "animate-pulse" : ""}`} />
                {status === "sending" ? "Sending..." : "Send Direct Message"}
              </button>

              {status === "success" && (
                <div className="hover-smooth hover:scale-[1.01] hover:shadow-md p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 hover:border-emerald-300 text-emerald-700 text-xs font-mono flex items-center gap-2">
                  <Check size={16} className="text-emerald-600 shrink-0" />
                  <span>Message sent successfully! Thanks for reaching out — I&apos;ll get back to you soon.</span>
                </div>
              )}

              {status === "error" && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono flex items-center gap-2">
                  <Send size={16} className="shrink-0" />
                  <span>
                    Something went wrong. Please try again or email me directly at {portfolio.email}
                  </span>
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
