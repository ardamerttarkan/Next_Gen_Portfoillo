import React from "react";
import { Project, Skill, BlogPost, CareerItem } from "../types";
import {
  Github,
  Linkedin,
  ExternalLink,
  Code2,
  Terminal,
  ArrowRight,
  Download,
  Sparkles,
  Layers,
  FileText,
  Cpu,
  Database,
  Globe,
  Briefcase,
  GraduationCap,
  Laptop,
  MapPin,
  Calendar,
} from "lucide-react";

interface ProfessionalLayoutProps {
  projects: Project[];
  skills: Skill[];
  blogs: BlogPost[];
  career: CareerItem[];
  onBlogClick: (blog: BlogPost) => void;
  onViewAllBlogs: () => void;
}

export const ProfessionalLayout: React.FC<ProfessionalLayoutProps> = ({
  projects,
  skills,
  blogs,
  career,
  onBlogClick,
  onViewAllBlogs,
}) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#06060e] text-gray-800 dark:text-gray-200 font-sans selection:bg-cyan-500 selection:text-white pb-20">
      {/* ===== Animated Background Orbs ===== */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 right-0 w-[500px] h-[500px] rounded-full opacity-[0.06] dark:opacity-[0.12] blur-[130px]"
          style={{
            background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
            animation: "profFloat1 16s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-1/2 -left-40 w-[550px] h-[550px] rounded-full opacity-[0.05] dark:opacity-[0.10] blur-[120px]"
          style={{
            background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
            animation: "profFloat2 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-32 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.04] dark:opacity-[0.08] blur-[100px]"
          style={{
            background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
            animation: "profFloat3 14s ease-in-out infinite",
          }}
        />
      </div>

      {/* ===== Subtle Grid ===== */}
      <div className="fixed inset-0 opacity-[0.04] dark:opacity-[0.02] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* ===== Sticky Navbar ===== */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#06060e]/70 backdrop-blur-xl border-b border-gray-200/60 dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-cyan-500/20">
              AMT
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-gray-900 dark:text-white">
              Arda Mert Tarkan
            </span>
          </div>
          <nav className="hidden md:flex gap-1 text-sm font-medium text-gray-500">
            {[
              { label: "Hakkımda", id: "about" },
              { label: "Yetenekler", id: "skills" },
              { label: "Kariyer", id: "career" },
              { label: "Projeler", id: "projects" },
              { label: "Blog", id: null, action: onViewAllBlogs },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() =>
                  item.id ? scrollToSection(item.id) : item.action?.()
                }
                className="px-3.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.05] hover:text-gray-900 dark:hover:text-white transition-all duration-200"
              >
                {item.label}
              </button>
            ))}
          </nav>
          <a
            href="#"
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:-translate-y-0.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CV İndir</span>
          </a>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-16 space-y-28">
        {/* ===== Hero Section ===== */}
        <section id="about" className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-white/[0.04] border border-gray-200/60 dark:border-white/[0.08] text-[13px] text-gray-500 dark:text-gray-400 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>İşe alıma açık</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-[1.1] tracking-[-0.03em]">
              Yazılım{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400">
                Geliştiricisi
              </span>{" "}
              Arda Mert Tarkan.
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
              Yalova Üniversitesi Bilgisayar Mühendisliği mezunu, çeştli
              projelerde deneyim kazanmış bir yazılım mühendisi. Amacım
              kullanıcı odaklı, performanslı ve ölçeklenebilir çözümler
              geliştirmek.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/ardamerttarkan"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/[0.04] border border-gray-200/60 dark:border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-200 dark:hover:bg-white/[0.08] transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/ardamert60/"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/[0.04] border border-gray-200/60 dark:border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/10 via-blue-500/5 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />
            <div className="relative rounded-2xl overflow-hidden border border-gray-200/60 dark:border-white/[0.08] shadow-lg dark:shadow-none">
              <img
                src="../img/me.jpg"
                alt="Workspace"
                className="w-full aspect-square object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] dark:from-[#06060e] via-transparent to-transparent opacity-60" />
            </div>
          </div>
        </section>

        {/* ===== Skills Section ===== */}
        <section id="skills">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 flex items-center justify-center">
              <Layers className="text-blue-500 dark:text-blue-400 w-5 h-5" />
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Teknik Yetenekler
            </h2>
            <div className="h-px flex-1 bg-gray-200 dark:bg-white/[0.06]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Oyun motorlarından, web frameworklerine, veritabanlarından bulut
                servislerine kadar geniş bir yelpazede deneyim sahibiyim. İşte
                bazı favori araçlarım ve teknolojilerim:
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    icon: (
                      <Code2 className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                    ),
                    title: "Frontend & Mobil",
                    desc: "Vue, React, HTML/CSS, Flutter",
                    color: "cyan",
                  },
                  {
                    icon: (
                      <Terminal className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                    ),
                    title: "Backend",
                    desc: "PHP, Node.js, MySQL, MongoDB",
                    color: "emerald",
                  },
                  {
                    icon: (
                      <Database className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                    ),
                    title: "Sistem ve Yazılım Geliştirme",
                    desc: "C#, C++, Python, Unreal Engine, Unity",
                    color: "purple",
                  },
                  {
                    icon: (
                      <Globe className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                    ),
                    title: "DevOps",
                    desc: "Docker, Linux (Debian), Azure, CI/CD",
                    color: "amber",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="group p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-gray-200/60 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/[0.12] hover:bg-gray-50 dark:hover:bg-white/[0.05] shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-none transition-[background-color,border-color,box-shadow] duration-300"
                  >
                    <div className="mb-3">{item.icon}</div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name} className="group">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {skill.name}
                    </span>
                    <span className="text-sm text-gray-400 dark:text-gray-600 font-mono">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-white/[0.04] rounded-full h-2 overflow-hidden border border-gray-200/40 dark:border-white/[0.04]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Career Section ===== */}
        <section id="career">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 flex items-center justify-center">
              <Briefcase className="text-amber-500 dark:text-amber-400 w-5 h-5" />
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Kariyer
            </h2>
            <div className="h-px flex-1 bg-gray-200 dark:bg-white/[0.06]" />
          </div>

          {/* Career Type Tabs */}
          {(() => {
            const typeConfig = [
              {
                key: "work" as const,
                label: "Çalışma",
                icon: Briefcase,
                color: "cyan",
              },
              {
                key: "internship" as const,
                label: "Staj",
                icon: GraduationCap,
                color: "emerald",
              },
              {
                key: "freelance" as const,
                label: "Freelance",
                icon: Laptop,
                color: "purple",
              },
            ];

            const groupedCareer = {
              work: career.filter((c) => c.type === "work"),
              internship: career.filter((c) => c.type === "internship"),
              freelance: career.filter((c) => c.type === "freelance"),
            };

            const colorMap: Record<
              string,
              {
                bg: string;
                border: string;
                text: string;
                dot: string;
                line: string;
                badge: string;
              }
            > = {
              cyan: {
                bg: "bg-cyan-50 dark:bg-cyan-500/10",
                border: "border-cyan-200/60 dark:border-cyan-500/20",
                text: "text-cyan-600 dark:text-cyan-400",
                dot: "bg-cyan-500",
                line: "from-cyan-500/40 to-cyan-500/0",
                badge:
                  "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20",
              },
              emerald: {
                bg: "bg-emerald-50 dark:bg-emerald-500/10",
                border: "border-emerald-200/60 dark:border-emerald-500/20",
                text: "text-emerald-600 dark:text-emerald-400",
                dot: "bg-emerald-500",
                line: "from-emerald-500/40 to-emerald-500/0",
                badge:
                  "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
              },
              purple: {
                bg: "bg-purple-50 dark:bg-purple-500/10",
                border: "border-purple-200/60 dark:border-purple-500/20",
                text: "text-purple-600 dark:text-purple-400",
                dot: "bg-purple-500",
                line: "from-purple-500/40 to-purple-500/0",
                badge:
                  "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20",
              },
            };

            return (
              <div className="space-y-12">
                {typeConfig.map(({ key, label, icon: TypeIcon, color }) => {
                  const items = groupedCareer[key];
                  if (items.length === 0) return null;
                  const colors = colorMap[color];

                  return (
                    <div key={key}>
                      {/* Type Header */}
                      <div className="flex items-center gap-3 mb-6">
                        <div
                          className={`w-8 h-8 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center`}
                        >
                          <TypeIcon className={`w-4 h-4 ${colors.text}`} />
                        </div>
                        <h3 className="font-display text-lg font-bold text-gray-800 dark:text-gray-200">
                          {label}
                        </h3>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${colors.badge}`}
                        >
                          {items.length}
                        </span>
                      </div>

                      {/* Timeline */}
                      <div className="relative ml-4">
                        {/* Timeline Line */}
                        <div
                          className={`absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b ${colors.line}`}
                        />

                        <div className="space-y-6">
                          {items.map((item, idx) => {
                            const formatDate = (d: string) => {
                              if (!d) return "Devam Ediyor";
                              const [y, m] = d.split("-");
                              const months = [
                                "Oca",
                                "Şub",
                                "Mar",
                                "Nis",
                                "May",
                                "Haz",
                                "Tem",
                                "Ağu",
                                "Eyl",
                                "Eki",
                                "Kas",
                                "Ara",
                              ];
                              return `${months[parseInt(m) - 1]} ${y}`;
                            };

                            return (
                              <div
                                key={item.id}
                                className="relative pl-8 group"
                              >
                                {/* Timeline Dot */}
                                <div
                                  className={`absolute left-0 top-3 w-2.5 h-2.5 rounded-full ${colors.dot} ring-4 ring-white dark:ring-[#06060e] z-10 group-hover:scale-125 transition-transform`}
                                />

                                {/* Card */}
                                <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/60 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/[0.12] hover:bg-gray-50/50 dark:hover:bg-white/[0.05] shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-none transition-all duration-300">
                                  {/* Header Row */}
                                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                                    <div>
                                      <h4 className="font-bold text-gray-900 dark:text-white text-[15px] group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                        {item.title}
                                      </h4>
                                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                                        {item.company}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 shrink-0">
                                      {item.location && (
                                        <span className="flex items-center gap-1">
                                          <MapPin className="w-3 h-3" />
                                          {item.location}
                                        </span>
                                      )}
                                      <span className="flex items-center gap-1 bg-gray-100 dark:bg-white/[0.04] border border-gray-200/60 dark:border-white/[0.06] px-2.5 py-1 rounded-full font-medium">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(item.startDate)} —{" "}
                                        {formatDate(item.endDate || "")}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Description */}
                                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                                    {item.description}
                                  </p>

                                  {/* Tech Stack Tags */}
                                  {item.techStack &&
                                    item.techStack.length > 0 && (
                                      <div className="flex flex-wrap gap-1.5">
                                        {item.techStack.map((tech) => (
                                          <span
                                            key={tech}
                                            className="px-2.5 py-0.5 bg-gray-50 dark:bg-white/[0.04] border border-gray-200/60 dark:border-white/[0.06] text-gray-500 dark:text-gray-400 text-[11px] rounded-full font-medium"
                                          >
                                            {tech}
                                          </span>
                                        ))}
                                      </div>
                                    )}

                                  {/* Active indicator for current positions */}
                                  {!item.endDate && (
                                    <div className="mt-3 flex items-center gap-1.5">
                                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                      <span className="text-[11px] font-semibold text-emerald-500 dark:text-emerald-400 uppercase tracking-wider">
                                        Aktif
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {career.length === 0 && (
                  <div className="text-center py-12 text-gray-400 dark:text-gray-600">
                    <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">Henüz kariyer bilgisi eklenmemiş.</p>
                  </div>
                )}
              </div>
            );
          })()}
        </section>

        {/* ===== Projects Section ===== */}
        <section id="projects">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200/60 dark:border-indigo-500/20 flex items-center justify-center">
              <Cpu className="text-indigo-500 dark:text-indigo-400 w-5 h-5" />
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Öne Çıkan Projeler
            </h2>
            <div className="h-px flex-1 bg-gray-200 dark:bg-white/[0.06]" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group relative rounded-2xl overflow-hidden"
              >
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]" />
                <div className="relative rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/60 dark:border-white/[0.06] overflow-hidden group-hover:border-cyan-300 dark:group-hover:border-cyan-500/20 shadow-sm dark:shadow-none group-hover:shadow-lg dark:group-hover:shadow-none transition-[background-color,border-color,box-shadow] duration-300 flex flex-col h-full">
                  <div className="h-48 overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors z-10 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                      <a
                        href={project.repoUrl}
                        className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110"
                      >
                        <Github className="w-4.5 h-4.5" />
                      </a>
                      <a
                        href={project.liveUrl}
                        className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110"
                      >
                        <ExternalLink className="w-4.5 h-4.5" />
                      </a>
                    </div>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#06060e] via-transparent to-transparent opacity-80 pointer-events-none" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-bold text-[15px] text-gray-900 dark:text-white mb-2 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 flex-1 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-0.5 bg-gray-50 dark:bg-white/[0.04] border border-gray-200/60 dark:border-white/[0.06] text-gray-500 dark:text-gray-400 text-[11px] rounded-full font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Blog Section ===== */}
        <section id="blog">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 flex items-center justify-center">
              <FileText className="text-emerald-500 dark:text-emerald-400 w-5 h-5" />
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Blog
            </h2>
            <div className="h-px flex-1 bg-gray-200 dark:bg-white/[0.06]" />
            <button
              onClick={onViewAllBlogs}
              className="flex items-center gap-1.5 text-sm text-cyan-500 dark:text-cyan-400 font-medium hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
            >
              Tümünü Gör <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {blogs.slice(0, 2).map((blog) => (
              <article
                key={blog.id}
                onClick={() => onBlogClick(blog)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer"
              >
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-cyan-500/15 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]" />
                <div className="relative flex flex-col md:flex-row gap-6 items-start p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-200/60 dark:border-white/[0.06] group-hover:border-cyan-300 dark:group-hover:border-cyan-500/20 group-hover:bg-cyan-50/30 dark:group-hover:bg-white/[0.04] shadow-sm dark:shadow-none group-hover:shadow-md dark:group-hover:shadow-none transition-[background-color,border-color,box-shadow] duration-300">
                  <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0 border border-gray-200/60 dark:border-white/[0.06]">
                    {blog.image ? (
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-200 dark:from-slate-800 to-slate-300 dark:to-slate-900 flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-slate-400 dark:text-slate-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-600 mb-3">
                      <span className="font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/15 px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[10px]">
                        {blog.category}
                      </span>
                      <span>{blog.date}</span>
                      <span className="text-gray-300 dark:text-gray-700">
                        •
                      </span>
                      <span>{blog.readTime}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors mb-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ===== Footer ===== */}
        <footer className="pt-12 border-t border-gray-200 dark:border-white/[0.06] text-center pb-8">
          <p className="text-gray-400 dark:text-gray-600 text-sm">
            © {new Date().getFullYear()} Arda Mert Tarkan. Tüm hakları saklıdır.
          </p>
        </footer>
      </main>

      {/* ===== Keyframe Animations ===== */}
      <style>{`
        @keyframes profFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-70px, 40px) scale(1.1); }
          66% { transform: translate(40px, -30px) scale(0.95); }
        }
        @keyframes profFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(60px, -50px) scale(1.05); }
          66% { transform: translate(-50px, 50px) scale(0.9); }
        }
        @keyframes profFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, -40px) scale(1.15); }
        }
      `}</style>
    </div>
  );
};
