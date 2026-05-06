"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Terminal, Mail, FileDown, Layout, Code2, ArrowUpRight } from "lucide-react";
import { SiJavascript, SiPython, SiR, SiHtml5, SiCss, SiDotnet, SiReact, SiTailwindcss, SiMysql, SiFirebase, SiAndroidstudio, SiGit } from "react-icons/si";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

const GithubIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
import { GitHubCalendar } from "react-github-calendar";

const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const Typewriter = ({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) => {
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        visible: { transition: { staggerChildren: 0.015, delayChildren: delay } },
        hidden: {}
      }}
      className={className}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

const tools = [
  { name: "JavaScript", icon: <SiJavascript size={32} /> }, 
  { name: "Python", icon: <SiPython size={32} /> }, 
  { name: "C#", icon: <Code2 size={32} /> }, 
  { name: "R", icon: <SiR size={32} /> }, 
  { name: "HTML", icon: <SiHtml5 size={32} /> }, 
  { name: "CSS", icon: <SiCss size={32} /> },
  { name: ".NET", icon: <SiDotnet size={32} /> }, 
  { name: "React.js", icon: <SiReact size={32} /> }, 
  { name: "Tailwind", icon: <SiTailwindcss size={32} /> }, 
  { name: "MySQL", icon: <SiMysql size={32} /> }, 
  { name: "Firebase", icon: <SiFirebase size={32} /> },
  { name: "Android", icon: <SiAndroidstudio size={32} /> }, 
  { name: "Git", icon: <SiGit size={32} /> }
];

const bootLines = [
  "Initializing system...",
  "Loading modules...",
  "Connecting to database...",
  "Mounting portfolio...",
  "$ Ready."
];

const BootLoader = ({ onDone }: { onDone: () => void }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootLines.length) {
        setLines(prev => [...prev, bootLines[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setDone(true), 400);
        setTimeout(onDone, 900);
      }
    }, 280);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: done ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col justify-center px-10 md:px-24 pointer-events-none"
    >
      <div className="font-mono text-sm md:text-base space-y-2">
        {lines.filter(Boolean).map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className={`${
              line?.startsWith('$') ? 'text-white font-bold text-lg' : 'text-zinc-500'
            }`}
          >
            {line?.startsWith('$') ? line : `> ${line}`}
          </motion.p>
        ))}
        {!done && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-2.5 h-5 bg-white ml-1 align-middle"
          />
        )}
      </div>
    </motion.div>
  );
};

export default function Portfolio() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  useEffect(() => {
    setMounted(true);
    const fetchProjects = async () => {
      if (!supabase) return;
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: true });
      if (!error && data) {
        setProjects(data);
      }
    };
    fetchProjects();
  }, []);

  // Auto Slideshow Logic
  useEffect(() => {
    if (!selectedProject || !Array.isArray(selectedProject.images) || selectedProject.images.length <= 1) return;
    
    const interval = setInterval(() => {
      setSelectedProject((prev: any) => {
        if (!prev) return null;
        const nextIndex = ((prev.currentImageIndex || 0) + 1) % prev.images.length;
        return { ...prev, currentImageIndex: nextIndex };
      });
    }, 4000);
    
    return () => clearInterval(interval);
  }, [selectedProject?.title, selectedProject?.images?.length]);

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  if (!mounted) return null;

  return (
    <>
      <AnimatePresence>
        {loading && <BootLoader onDone={() => setLoading(false)} />}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="min-h-screen bg-cream text-black font-mono selection:bg-sage selection:text-white"
      >
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-cream/90 backdrop-blur-md z-50 border-b border-sand/30">
        <div className="px-6 md:px-12 lg:px-24 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <span className="font-bold text-lg text-black flex items-center gap-2">
            <Terminal size={18} />
            ~/luqman-azri
          </span>
          <div className="flex flex-wrap gap-4 sm:gap-6 text-sm text-black/60">
            <a href="#about" className="hover:text-black transition-colors">./about</a>
            <a href="#experience" className="hover:text-black transition-colors">./experience</a>
            <a href="#projects" className="hover:text-black transition-colors">./projects</a>
            <a href="#tools" className="hover:text-black transition-colors">./tools</a>
            <a href="#github" className="hover:text-black transition-colors">./github</a>
          </div>
        </div>
      </nav>

      {/* Full Screen Hero Section */}
      <motion.section 
        id="about"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="w-full min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-20 relative overflow-hidden"
      >
        {/* Subtle Glow Background */}
        <div className="absolute top-1/4 right-1/4 w-full max-w-2xl h-96 bg-sage/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Intro text */}
        <motion.div variants={fadeInUp} className="mb-6 z-10">
          <p className="text-black/70 text-lg md:text-xl leading-relaxed font-sans">
            I'm a <span className="font-bold text-black">Fresh Graduate</span> passionate <br className="hidden md:block"/>
            about crafting intelligent web solutions
          </p>
        </motion.div>

        {/* Huge Typography */}
        <motion.div variants={fadeInUp} className="flex flex-col gap-0 relative z-10">
          {/* Row 1 */}
          <div className="flex items-baseline overflow-hidden">
            <motion.span 
              whileHover={{ color: "#546B41" }}
              className="font-mono text-[22vw] leading-[0.8] text-black tracking-tight cursor-default"
            >
              LUQMAN
            </motion.span>
          </div>
          
          {/* Row 2 */}
          <div className="flex flex-col xl:flex-row xl:items-end gap-12 xl:gap-32 mt-2">
            <div className="flex overflow-hidden">
              <motion.span 
                whileHover={{ color: "#546B41" }}
                className="font-sans font-black text-[20vw] leading-[0.75] text-black tracking-tighter uppercase cursor-default"
              >
                AZRI.
              </motion.span>
            </div>

            {/* Bio & Links next to the name */}
            <motion.div variants={fadeInUp} className="max-w-lg space-y-8 pb-4 xl:pb-12">
              <p className="text-black/70 text-sm md:text-base leading-relaxed font-sans">
                Recent graduate specializing in Intelligence Computing with hands-on experience in full-stack development, machine learning, and system reliability. I specialize in creating <span className="font-bold text-deep-sage">dynamic experiences</span> that leave a lasting impact.
              </p>
              <div className="flex flex-wrap items-center gap-6">
                <a 
                  href="/Luqman.pdf" 
                  download
                  className="group flex items-center justify-center gap-3 px-8 py-4 bg-sage text-white font-sans text-xs font-bold tracking-widest uppercase hover:bg-deep-sage transition-colors"
                >
                  <FileDown size={18} />
                  DOWNLOAD RESUME
                </a>
                <div className="flex items-center gap-6">
                  <a href="https://github.com/luqss-s" target="_blank" rel="noreferrer" className="text-black/40 hover:text-deep-sage transition-colors">
                    <GithubIcon size={24} />
                  </a>
                  <a href="mailto:luqmanazri0305@gmail.com" className="text-black/40 hover:text-deep-sage transition-colors">
                    <Mail size={24} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* Experience & Education - Full Width Interactive Card */}
      <motion.section 
        id="experience" 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full bg-cream text-black py-24 px-6 md:px-12 lg:px-24 transition-colors duration-500 overflow-hidden font-mono"
      >
        <div className="w-full flex flex-col">
          
          {/* Header & Toggle */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black mb-4">
                <Typewriter text="BACKGROUND" />
              </h2>
              <p className="text-black/50 text-lg md:text-xl">
                <Typewriter text="My academic foundation and professional journey." delay={0.2} />
              </p>
            </div>
            
            <div className="flex bg-black/5 p-1.5 rounded-full relative w-max">
              <button 
                onClick={() => setActiveTab('experience')}
                className={`relative z-10 px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-colors ${activeTab === 'experience' ? 'text-white' : 'text-black/50 hover:text-black'}`}
              >
                Experience
              </button>
              <button 
                onClick={() => setActiveTab('education')}
                className={`relative z-10 px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-colors ${activeTab === 'education' ? 'text-white' : 'text-black/50 hover:text-black'}`}
              >
                Education
              </button>
              {/* Animated Pill Background */}
              <motion.div 
                className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-sage rounded-full"
                initial={false}
                animate={{ x: activeTab === 'experience' ? '6px' : 'calc(100% + 6px)' }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="w-full min-h-[400px] relative">
            <AnimatePresence mode="wait">
              {activeTab === 'experience' ? (
                <motion.div 
                  key="exp"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-12"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-sand pb-8">
                    <div>
                      <h4 className="text-2xl md:text-3xl font-black uppercase text-black">
                        <Typewriter text="Software Engineer Intern" />
                      </h4>
                      <div className="text-black/60 text-lg mt-2">
                        <Typewriter text="Venture GES Manufacturing Services" delay={0.4} />
                      </div>
                    </div>
                    <div className="text-xs text-black font-bold tracking-widest uppercase border border-black px-6 py-3 rounded-full whitespace-nowrap w-fit">
                      MAR 2024 — OCT 2024
                    </div>
                  </div>
                  <ul className="space-y-6 text-black/70 text-sm md:text-base leading-relaxed max-w-4xl">
                    {[
                      "Developed and debugged C#-based LogCraftParser application to process PCB data, improving error reporting with detailed logs including line number, model name, station name, and serial number.",
                      "Designed Test Equipment Qualification Web application using ASP.NET, C#, AJAX, Telerik, and MySQL; designed frontend & built backend modules for ICT, FCT, Equipment Validation, and Edit Profile.",
                      "Built WhatsApp Automation system using AutoIt to enable real-time production floor notifications."
                    ].map((text, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <span className="text-black font-bold">→</span>
                        <Typewriter text={text} delay={0.6 + (i * 0.2)} />
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ) : (
                <motion.div 
                  key="edu"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-12"
                >
                  <div className="space-y-16">
                    {/* Degree */}
                    <div>
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-sand pb-6 mb-6">
                        <div>
                          <h4 className="text-2xl md:text-3xl font-black text-black">
                            <Typewriter text="Bachelor of Computer Science (Intelligence Computing)" />
                          </h4>
                          <div className="text-black/60 text-lg mt-2">
                            <Typewriter text="Universiti Sains Malaysia, Pulau Pinang" delay={0.4} />
                          </div>
                        </div>
                        <div className="text-xs text-black font-bold tracking-widest uppercase border border-black px-6 py-3 rounded-full whitespace-nowrap w-fit">
                          2021 — 2025
                        </div>
                      </div>
                      <div className="space-y-4 text-black/70 text-sm md:text-base leading-relaxed max-w-4xl">
                        <li className="flex items-start gap-4">
                          <span className="text-black font-bold">→</span>
                          <Typewriter text="CGPA: 3.26" delay={0.6} />
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="text-black font-bold">→</span>
                          <Typewriter text="Dean's List: Semester 7 (GPA 3.61) & Semester 8 (GPA 3.90)" delay={0.8} />
                        </li>
                      </div>
                    </div>

                    {/* Matriculation */}
                    <div>
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-sand pb-6 mb-6">
                        <div>
                          <h4 className="text-2xl md:text-3xl font-black text-black">
                            <Typewriter text="Malaysian Matriculation Programme (Science)" />
                          </h4>
                          <div className="text-black/60 text-lg mt-2">
                            <Typewriter text="Johore Matriculation College, Tangkak" delay={0.4} />
                          </div>
                        </div>
                        <div className="text-xs text-black font-bold tracking-widest uppercase border border-black px-6 py-3 rounded-full whitespace-nowrap w-fit">
                          2020 — 2021
                        </div>
                      </div>
                      <div className="space-y-4 text-black/70 text-sm md:text-base leading-relaxed max-w-4xl">
                        <li className="flex items-start gap-4">
                          <span className="text-black font-bold">→</span>
                          <Typewriter text="CGPA: 3.83" delay={0.6} />
                        </li>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.section>

      {/* Tools & Languages - Full Width Marquee */}
      <motion.section 
        id="tools" 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full py-24 bg-cream border-y border-sand/30 overflow-hidden"
      >
        <div className="flex flex-col items-center mb-16 px-6">
          <h2 className="text-3xl md:text-5xl font-black font-sans uppercase tracking-tighter text-black mb-4">Tools &amp; Languages</h2>
          <p className="text-black/60 font-serif italic text-center max-w-xl">
            Showcasing my expertise in building scalable, secure, and high-performance applications.
          </p>
        </div>

        <div className="relative w-full flex overflow-hidden group [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
            {[...tools, ...tools].map((tool, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center gap-4 mx-6">
                <div className="w-24 h-24 bg-white border border-black/10 flex items-center justify-center text-black/40 hover:text-deep-sage hover:border-deep-sage hover:bg-sage/5 transition-all shadow-lg">
                  {tool.icon}
                </div>
                <span className="text-xs font-bold tracking-widest uppercase text-black/40">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section 
        id="projects" 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full bg-cream py-24 overflow-hidden"
      >
        <div className="px-6 md:px-12 lg:px-24 mb-16">
          <h2 className="text-4xl md:text-6xl font-black font-mono uppercase tracking-tighter text-black mb-4">Projects</h2>
          <p className="text-black/70 font-serif italic text-xl">
            A selection of my most impactful work.
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="px-6 md:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-sand">
          {projects.map((project, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedProject(project)}
              className="group border-b border-r border-sand p-8 cursor-pointer hover:bg-sand/20 transition-all duration-300 flex flex-col gap-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 border ${
                  project.status === 'live'
                    ? 'border-deep-sage text-deep-sage'
                    : 'border-black/20 text-black/20'
                }`}>
                  {project.status === 'live' ? '● LIVE' : '○ OFFLINE'}
                </span>
                <ArrowUpRight size={16} className="text-black/20 group-hover:text-deep-sage group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
              </div>

              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden bg-black/5">
                {project.images && (Array.isArray(project.images) ? project.images[0] : project.images) ? (
                  <img 
                    src={Array.isArray(project.images) ? project.images[0] : project.images} 
                    alt={project.title} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Terminal size={32} className="text-black/10" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col gap-3 flex-grow">
                <p className="text-[10px] text-black/40 font-mono tracking-widest uppercase">{project.role}</p>
                <h3 className="text-lg font-black font-mono uppercase text-black leading-tight">{project.title}</h3>
                <p className="text-black/60 text-sm leading-relaxed line-clamp-3">{project.description}</p>
              </div>

              {/* Tech pills */}
              <div className="flex flex-wrap gap-2">
                {(project.tech || []).slice(0, 4).map((t: string, i: number) => (
                  <span key={i} className="text-[9px] font-bold text-black/60 bg-black/5 border border-black/10 px-2 py-1 tracking-widest uppercase">
                    {t}
                  </span>
                ))}
                {project.tech && project.tech.length > 4 && (
                  <span className="text-[9px] font-bold text-black/40 bg-black/5 border border-black/10 px-2 py-1 tracking-widest uppercase">+{project.tech.length - 4}</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-black/20">
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedProject(project); }}
                  className="flex-1 py-2.5 text-[10px] font-bold tracking-widest uppercase border border-sage text-sage hover:bg-deep-sage hover:text-white transition-colors"
                >
                  View Details
                </button>
                {project.live ? (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 py-2.5 text-[10px] font-bold tracking-widest uppercase bg-sage text-white hover:bg-deep-sage transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={11} /> Visit
                  </a>
                ) : (
                  <span className="flex-1 py-2.5 text-[10px] font-bold tracking-widest uppercase border border-black/40 text-black/40 flex items-center justify-center">
                    OFFLINE
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[1920px] max-h-[95vh] overflow-y-auto bg-cream border border-black/20 flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-6 p-8 border-b border-black/20">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 border ${
                      selectedProject.status === 'live' ? 'border-deep-sage text-deep-sage' : 'border-black/20 text-black/20'
                    }`}>
                      {selectedProject.status === 'live' ? '● LIVE' : '○ OFFLINE'}
                    </span>
                    <span className="text-[10px] text-black/40 font-mono tracking-widest uppercase">{selectedProject.role}</span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black font-mono uppercase text-black">{selectedProject.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="flex-shrink-0 w-10 h-10 border border-black/30 flex items-center justify-center text-black hover:border-sage hover:text-sage transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 flex-1">
                {/* Image Gallery & Info */}
                <div className="lg:col-span-2 p-8 border-r border-black/20 space-y-8">
                  {/* Gallery Slider */}
                  {selectedProject.images && (
                    <div className="space-y-4">
                      <div className="relative w-full aspect-video overflow-hidden bg-black/10 border border-black/10 flex items-center justify-center">
                        {/* Blurred Background for Portrait Images */}
                        <div 
                          className="absolute inset-0 scale-110 blur-2xl opacity-30 pointer-events-none"
                          style={{
                            backgroundImage: `url(${Array.isArray(selectedProject.images) 
                              ? selectedProject.images[selectedProject.currentImageIndex || 0] 
                              : selectedProject.images})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        />
                        
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={selectedProject.currentImageIndex || 0}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                            src={Array.isArray(selectedProject.images) 
                              ? selectedProject.images[selectedProject.currentImageIndex || 0] 
                              : selectedProject.images}
                            alt={selectedProject.title}
                            className="relative z-10 w-full h-full object-contain"
                          />
                        </AnimatePresence>
                        
                      </div>
                      
                      {/* Thumbnails */}
                      {Array.isArray(selectedProject.images) && selectedProject.images.length > 1 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.images.map((img: string, i: number) => (
                            <button 
                              key={i}
                              onClick={() => setSelectedProject({...selectedProject, currentImageIndex: i})}
                              className={`w-16 h-16 border-2 transition-all ${
                                (selectedProject.currentImageIndex || 0) === i ? 'border-sage opacity-100' : 'border-transparent opacity-40 hover:opacity-70'
                              }`}
                            >
                              <img src={img} className="w-full h-full object-cover" alt="" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* YouTube */}
                  {selectedProject.youtube && (
                    <div className="w-full aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${getYoutubeId(selectedProject.youtube)}`}
                        title={selectedProject.title}
                        className="w-full h-full border border-black/20"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <h4 className="text-[10px] font-bold text-deep-sage font-mono tracking-widest uppercase mb-4">// About this project</h4>
                    <p className="text-black/70 text-sm md:text-base leading-relaxed">{selectedProject.description}</p>
                  </div>
                </div>

                {/* Right: Tech + Links */}
                <div className="p-8 space-y-8">
                  <div>
                    <h4 className="text-[10px] font-bold text-deep-sage font-mono tracking-widest uppercase mb-4">// Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {(selectedProject.tech || []).map((t: string, i: number) => (
                        <span key={i} className="text-[10px] font-bold text-black bg-black/5 border border-black/10 px-3 py-1.5 tracking-widest uppercase">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-black/20">
                    {selectedProject.github && (
                      <a
                        href={selectedProject.github}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-3 w-full py-4 border border-sage text-sage text-xs font-bold tracking-widest uppercase hover:bg-sage hover:text-white transition-colors"
                      >
                        <Code2 size={16} /> VIEW CODE
                      </a>
                    )}
                    {selectedProject.live && (
                      <a
                        href={selectedProject.live}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-3 w-full py-4 bg-sage text-white text-xs font-bold tracking-widest uppercase hover:bg-deep-sage transition-colors"
                      >
                        <ExternalLink size={16} /> VIEW LIVE
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* GitHub Contributions - Full Width */}
      <motion.section 
        id="github" 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full bg-cream py-24"
      >
        <div className="px-6 md:px-12 lg:px-24 mb-16">
          <h2 className="text-4xl md:text-6xl font-black font-mono uppercase tracking-tighter text-black mb-4">Contributions</h2>
          <p className="text-black/70 font-serif italic text-xl">
            My open source activity on GitHub.
          </p>
        </div>
        <div className="px-6 md:px-12 lg:px-24 overflow-x-auto flex justify-center">
          <GitHubCalendar 
            username="luqss-s" 
            colorScheme="light"
            theme={{
              light: ['#f0f0f0', '#dccca1', '#99AD7A', '#7a915c', '#546B41'],
              dark: ['#1a1a1a', '#2a2a1a', '#3d4d2a', '#6b8a50', '#99AD7A'],
            }}
            fontSize={14}
            blockSize={16}
            blockMargin={5}
          />
        </div>
      </motion.section>



      {/* Footer */}
      <footer className="border-t border-sand/30 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-black/50">
          <div className="flex items-center gap-2">
            <Terminal size={14} />
            <span>sys.exit(0)</span>
          </div>
          <span>© {new Date().getFullYear()} LUQMAN AZRI</span>
        </div>
      </footer>
      </motion.div>
    </>
  );
}
