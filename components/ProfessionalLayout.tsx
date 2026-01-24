import React from 'react';
import { Project, Skill, BlogPost } from '../types';
import { Github, Linkedin, ExternalLink, Code2, Terminal, ArrowRight } from 'lucide-react';

interface ProfessionalLayoutProps {
  projects: Project[];
  skills: Skill[];
  blogs: BlogPost[];
  onBlogClick: (blog: BlogPost) => void;
  onViewAllBlogs: () => void;
}

export const ProfessionalLayout: React.FC<ProfessionalLayoutProps> = ({ 
  projects, 
  skills, 
  blogs, 
  onBlogClick,
  onViewAllBlogs 
}) => {

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans selection:bg-prof-blue selection:text-white pb-20">
      
      {/* Header / Hero */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 bg-prof-blue rounded-lg flex items-center justify-center text-white font-bold">JD</div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900 dark:text-white">John Doe</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            <button onClick={() => scrollToSection('about')} className="hover:text-prof-blue dark:hover:text-white transition-colors">About</button>
            <button onClick={() => scrollToSection('projects')} className="hover:text-prof-blue dark:hover:text-white transition-colors">Projects</button>
            <button onClick={() => scrollToSection('skills')} className="hover:text-prof-blue dark:hover:text-white transition-colors">Skills</button>
            <button onClick={onViewAllBlogs} className="hover:text-prof-blue dark:hover:text-white transition-colors">Blog</button>
          </nav>
          <a href="#" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800 dark:hover:bg-gray-200 transition-colors">
            Download CV
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-24">
        
        {/* Hero Section */}
        <section id="about" className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              Available for hire
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
              Building digital <br/>
              <span className="text-prof-blue">experiences</span> that matter.
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md">
              I'm a Full Stack Engineer specializing in scalable web applications and intuitive user interfaces. I turn complex problems into elegant solutions.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <Github className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-700 transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-transparent dark:from-blue-900/20 rounded-2xl transform rotate-3"></div>
            <img 
              src="https://picsum.photos/id/101/600/600" 
              alt="Workspace" 
              className="relative rounded-2xl shadow-2xl object-cover grayscale hover:grayscale-0 transition-all duration-500 border border-slate-200 dark:border-slate-800"
            />
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Technical Skills</h2>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
               <p className="text-slate-600 dark:text-slate-400">
                 My tech stack is focused on the JavaScript ecosystem, utilizing the latest frameworks for performance and SEO.
               </p>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all">
                    <Code2 className="w-6 h-6 text-blue-500 mb-2" />
                    <h3 className="font-bold text-slate-800 dark:text-white">Frontend</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">React, Next.js, Tailwind</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all">
                    <Terminal className="w-6 h-6 text-emerald-500 mb-2" />
                    <h3 className="font-bold text-slate-800 dark:text-white">Backend</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Node, Postgres, Redis</p>
                  </div>
               </div>
            </div>
            
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{skill.name}</span>
                    <span className="text-sm text-slate-400">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                    <div 
                      className="bg-prof-blue h-2 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Featured Projects</h2>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/60 transition-colors z-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
                     <a href={project.repoUrl} className="bg-white text-slate-900 p-2 rounded-full mx-1 hover:scale-110 transition-transform">
                       <Github className="w-5 h-5"/>
                     </a>
                     <a href={project.liveUrl} className="bg-white text-slate-900 p-2 rounded-full mx-1 hover:scale-110 transition-transform">
                       <ExternalLink className="w-5 h-5"/>
                     </a>
                  </div>
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{project.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 flex-1 line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.techStack.map(tech => (
                      <span key={tech} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded-md font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Engineering Blog</h2>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
            <button 
              onClick={onViewAllBlogs}
              className="text-sm text-prof-blue font-medium hover:underline flex items-center"
            >
              View All <ArrowRight className="w-4 h-4 ml-1"/>
            </button>
          </div>

          <div className="space-y-6">
            {blogs.slice(0, 2).map((blog) => (
              <article 
                key={blog.id} 
                onClick={() => onBlogClick(blog)}
                className="group flex flex-col md:flex-row gap-6 items-start p-4 hover:bg-white dark:hover:bg-slate-900 rounded-2xl hover:shadow-lg border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all cursor-pointer"
              >
                <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <span className="font-semibold text-prof-blue bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded uppercase tracking-wider">{blog.category}</span>
                    <span>{blog.date}</span>
                    <span>•</span>
                    <span>{blog.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-prof-blue transition-colors mb-2">
                    {blog.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 line-clamp-2">
                    {blog.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-12 border-t border-slate-200 dark:border-slate-800 text-center pb-8">
          <p className="text-slate-500 dark:text-slate-400 text-sm">© {new Date().getFullYear()} John Doe. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};