// Single source of truth — real resume details.
export const portfolio = {
  name: "Daraniedaran K",
  initials: "DK",
  title: "Aspiring Full Stack Developer",
  tagline:
    "Final-year B.Tech IT student building responsive web apps with React, FastAPI and Firebase — with a growing interest in AI-powered applications and problem-solving.",
  location: "Tamil Nadu, India",
  email: "daraniedaran@gmail.com",
  phone: "+91 9043894153",
  resumeUrl: `${import.meta.env.BASE_URL}resume.pdf`,
  photo: `${import.meta.env.BASE_URL}profile.jpg`, // drop your photo at public/profile.jpg (or share the file path and I rewire this)
  socials: {
    github: "https://github.com/Daraniedaran",
    linkedin: "https://linkedin.com/in/daraniedaran-k",
  },
  stats: [
    { value: "8.47", label: "CGPA" },
    { value: "3", label: "Major Projects" },
    { value: "6+", label: "Certifications" },
  ],
  about:
    "Aspiring Full Stack Developer with hands-on experience in building responsive web applications using modern web technologies. Final-year B.Tech Information Technology student at Mailam Engineering College (2023–2027) with a strong interest in Full Stack Development, AI-powered applications and problem-solving.",
  roles: ["React Frontend", "FastAPI Backend", "AI-Powered Apps"],
  skills: [
    { group: "Languages", items: ["Python", "Java"] },
    { group: "Frontend", items: ["HTML", "CSS", "JavaScript", "React.js", "React Native"] },
    { group: "Backend / Data", items: ["FastAPI", "Firebase", "MySQL", "REST APIs"] },
    { group: "Tools", items: ["Git", "GitHub", "Microsoft 365", "Figma"] },
  ],
  education: [
    {
      period: "2023 — 2027",
      degree: "B.Tech Information Technology",
      school: "Mailam Engineering College",
      score: "CGPA 8.47",
      detail: "Final-year student. Interests: Full Stack Development, AI-powered applications, problem-solving.",
    },
    {
      period: "2022 — 2023",
      degree: "Higher Secondary Certificate (HSC)",
      school: "St. Joseph's Higher Secondary School",
      score: "82%",
      detail: "Higher secondary schooling.",
    },
    {
      period: "2020 — 2021",
      degree: "Secondary School Leaving Certificate (SSLC)",
      school: "St. Joseph's Higher Secondary School",
      score: "Pass",
      detail: "Secondary schooling.",
    },
  ],
  certifications: [
    { title: "IT Specialist – Python", issuer: "Certiport / Pearson VUE", date: "Oct 2024", type: "certification", image: `${import.meta.env.BASE_URL}certificates/it-specialist-python.jpg` },
    { title: "Full Stack Development", issuer: "NoviTech R&D Pvt. Ltd.", date: "Aug 2025", type: "certification", image: `${import.meta.env.BASE_URL}certificates/full-stack-novitech.jpg` },
    { title: "The Joy of Computing using Python — Elite (67%)", issuer: "NPTEL", date: "Apr 2026", type: "certification", highlight: true, image: `${import.meta.env.BASE_URL}certificates/nptel-joy-python.jpg` },
    { title: "Code 4 Change 2026 – Hackathon", issuer: "Karpaga Vinayaga College of Eng. & Tech.", date: "Feb 2026", type: "hackathon", image: `${import.meta.env.BASE_URL}certificates/code4change-hackathon.jpg` },
    { title: "Volunteer – Photo Exhibition Contest 2K25", issuer: "Dept. of IT, Mailam Engineering College", date: "2025", type: "volunteer" },
    { title: "Volunteer – HackIndia 2026 Spark-3", issuer: "Dept. of IT, Mailam Engineering College", date: "2026", type: "volunteer" },
  ],
  projects: [
    {
      title: "HotFiNet",
      desc: "Peer-to-peer internet sharing platform. Mobile app with secure real-time sharing of mobile internet between nearby users via QR-based connection and a digital coin economy.",
      stack: ["React Native", "Firebase", "QR System"],
      github: "https://github.com/Daraniedaran/hotfinet",
      live: "#",
    },
    {
      title: "Smart Academic Companion",
      desc: "AI-powered assistant for students: personalized study helper chatbot, academic guidance and performance tracking.",
      stack: ["React", "FastAPI", "AI Integration"],
      github: "https://github.com/Daraniedaran/Smart-Academic-Companion",
      live: "https://smart-academic-companion-ten.vercel.app/",
    },
    {
      title: "AI Interview Preparation",
      desc: "AI-powered mock interview platform that generates role-based questions, evaluates answers and gives personalized feedback with progress tracking.",
      stack: ["React", "FastAPI", "AI Integration"],
      github: "https://github.com/Daraniedaran/ai-interview-preparation",
      live: "https://ai-interview-portal-9gez.onrender.com/",
    },
  ],
};
