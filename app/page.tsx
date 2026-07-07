"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Terminal, Mail, FileDown, Layout, Code2, ArrowUpRight, Menu, X } from "lucide-react";
import { SiJavascript, SiPython, SiR, SiHtml5, SiCss, SiDotnet, SiReact, SiTailwindcss, SiMysql, SiFirebase, SiAndroidstudio, SiGit } from "react-icons/si";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import dynamic from "next/dynamic";
import { MeshGradient } from "@paper-design/shaders-react";
import CursorTrail from "../components/ui/cursor-trail";
import ExpandOnHover from "../components/ui/expand-cards";

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
const GitHubCalendar = dynamic(
  () => import('react-github-calendar').then((mod) => mod.GitHubCalendar as React.ComponentType<any>),
  { ssr: false }
);

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

const ScrambleText = ({ text, delay = 0, trigger = true }: { text: string, delay?: number, trigger?: boolean }) => {
  const [displayText, setDisplayText] = useState(text);
  const [scrambleCount, setScrambleCount] = useState(0);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+?=";

  useEffect(() => {
    if (!trigger) return;

    let timer: NodeJS.Timeout;
    let iteration = 0;
    const intervalTime = 30;
    const targetLength = text.length;

    // Start by fully scrambling the text on trigger
    setDisplayText(
      text
        .split("")
        .map(char => (char === " " ? " " : chars[Math.floor(Math.random() * chars.length)]))
        .join("")
    );

    const startScrambling = () => {
      timer = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((char, index) => {
              if (char === " ") return " ";
              if (index < iteration) {
                return text[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );

        if (iteration >= targetLength) {
          clearInterval(timer);
        }

        iteration += 1 / 3; // Controls how fast it resolves
      }, intervalTime);
    };

    // Hover trigger (scrambleCount > 0) starts immediately without entry delay
    const activeDelay = scrambleCount === 0 ? delay * 1000 : 0;
    const delayTimer = setTimeout(startScrambling, activeDelay);

    return () => {
      clearTimeout(delayTimer);
      clearInterval(timer);
    };
  }, [text, delay, trigger, scrambleCount]);

  const handleMouseEnter = () => {
    setScrambleCount(prev => prev + 1);
  };

  return (
    <span onMouseEnter={handleMouseEnter} className="cursor-default select-none">
      {displayText}
    </span>
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
            className={`${line?.startsWith('$') ? 'text-white font-bold text-lg' : 'text-zinc-500'
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

const getValidSrc = (src: any, fallbackTitle?: string): string => {
  if (typeof src !== 'string' || !src || src === '[]') {
    const text = encodeURIComponent(fallbackTitle || "Project");
    return `https://placehold.co/800x500/18181b/ffffff/png?font=Roboto&text=${text}`;
  }

  // Automatically fix user-provided placehold.co links that are missing the png format
  if (src.includes('placehold.co') && !src.includes('/png') && !src.includes('.png')) {
    return src.replace('?', '/png?');
  }

  const resolved = (src.startsWith('http') || src.startsWith('/')) ? src : `/${src}`;
  return encodeURI(resolved);
};

// ─── Live Preview Image (Microlink Screenshot API) ──────────────────────────
const LivePreviewImage = ({ liveUrl, fallbackSrc, alt, className = "", fill, sizes, priority = false }: {
  liveUrl: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
}) => {
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFailed(false);
    setScreenshotUrl(null);

    fetch(`/api/screenshot?url=${encodeURIComponent(liveUrl)}`)
      .then(res => res.json())
      .then(data => {
        if (cancelled) return;
        if (data?.screenshotUrl) {
          setScreenshotUrl(data.screenshotUrl);
        } else {
          setFailed(true);
        }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [liveUrl]);

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-slate-100/50`}>
        <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (failed || !screenshotUrl) {
    return <Image src={fallbackSrc} alt={alt} fill={fill} sizes={sizes} className={className} priority={priority} />;
  }

  return (
    <Image
      src={screenshotUrl}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
};

export default function Portfolio() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [visibleProjectsCount, setVisibleProjectsCount] = useState(6);
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [modalPreviewTab, setModalPreviewTab] = useState<'screenshots' | 'live'>('screenshots');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchProjects = async () => {
      // 1. Use session storage for simple, fast initial render
      const cached = sessionStorage.getItem("portfolio_projects_cache");
      if (cached) {
        setProjects(JSON.parse(cached));
      }

      // 2. Always fetch from Supabase to get the latest data and update cache/state
      if (!supabase) return;
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (!error && data) {
        setProjects(data);
        sessionStorage.setItem("portfolio_projects_cache", JSON.stringify(data));
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

      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 z-[-20] overflow-hidden bg-black pointer-events-none">
        <MeshGradient
          className="w-full h-full absolute inset-0"
          colors={["#000000", "#1f2022", "#89c2d9", "#61a5c2"]}
          speed={0.5}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="min-h-screen text-zinc-100 selection:bg-cyan-500/30 selection:text-cyan-200 font-sans relative z-10"
      >
        <CursorTrail />
        {/* Floating Glass Navigation */}
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl bg-zinc-950/45 backdrop-blur-2xl z-50 border border-zinc-800/40 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] rounded-3xl overflow-hidden">
          <div className="px-6 md:px-8 py-4 flex flex-row justify-between items-center gap-4">
            <span className="font-extrabold text-sm tracking-wider text-zinc-200 flex items-center gap-2 font-mono">
              <Terminal size={16} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
              ~/luqman-azri
            </span>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4 md:gap-8 text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
              <a href="#about" className="hover:text-white hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.4)] transition-colors">./about</a>
              <a href="#experience" className="hover:text-white hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.4)] transition-colors">./experience</a>
              <a href="#projects" className="hover:text-white hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.4)] transition-colors">./projects</a>
              <a href="#tools" className="hover:text-white hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.4)] transition-colors">./tools</a>
              <a href="#github" className="hover:text-white hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.4)] transition-colors">./github</a>
            </div>
            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-zinc-400 hover:text-white focus:outline-none transition-colors p-1"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
          {/* Mobile Navigation Panel */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="md:hidden border-t border-zinc-800/40 bg-zinc-950/70 backdrop-blur-2xl"
              >
                <div className="px-6 py-4 flex flex-col gap-4 text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
                  <a href="#about" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors py-1">./about</a>
                  <a href="#experience" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors py-1">./experience</a>
                  <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors py-1">./projects</a>
                  <a href="#tools" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors py-1">./tools</a>
                  <a href="#github" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors py-1">./github</a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Hero Section */}
        <motion.section
          id="about"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="w-full min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-28 pb-10 md:pt-32 md:pb-16 relative overflow-hidden"
        >
          {/* Intro text */}
          <motion.div variants={fadeInUp} className="mb-6 z-10">
            <p className="text-zinc-300 text-sm sm:text-lg md:text-2xl leading-relaxed font-serif italic font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              I'm a <span className="font-sans not-italic font-extrabold text-white border-b-2 border-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">Fresh Graduate</span> passionate <br className="hidden md:block" />
              about crafting intelligent web solutions
            </p>
          </motion.div>

          {/* Huge Typography */}
          <motion.div variants={fadeInUp} className="flex flex-col gap-0 relative z-10">
            {/* Row 1 */}
            <div className="flex items-baseline overflow-hidden">
              <motion.span
                whileHover={{ color: "#caf0f8" }}
                className="font-mono text-[14vw] sm:text-[16vw] md:text-[22vw] font-black leading-[0.8] text-white mix-blend-difference tracking-tighter cursor-default select-none transition-colors duration-300"
              >
                <ScrambleText text="LUQMAN" trigger={!loading} delay={0.2} />
              </motion.span>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col xl:flex-row xl:items-end gap-6 xl:gap-24 mt-2">
              <div className="flex overflow-hidden">
                <motion.span
                  whileHover={{ color: "#caf0f8" }}
                  className="font-sans font-black text-[12vw] sm:text-[14vw] md:text-[20vw] leading-[0.75] text-white mix-blend-difference tracking-tighter uppercase cursor-default select-none transition-colors duration-300"
                >
                  <ScrambleText text="AZRI." trigger={!loading} delay={0.5} />
                </motion.span>
              </div>

              {/* Bio & Links next to the name */}
              <motion.div variants={fadeInUp} className="max-w-lg space-y-4 md:space-y-6 pb-4 xl:pb-12">
                <p className="text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed font-sans font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  Recent graduate specializing in Intelligence Computing with hands-on experience in full-stack development, machine learning, and system reliability. I specialize in creating <span className="font-semibold text-white">dynamic experiences</span> that leave a lasting impact.
                </p>
                <div className="flex flex-wrap items-center gap-4 md:gap-6">
                  <a
                    href="/Luqman.pdf"
                    download
                    className="group flex items-center justify-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-zinc-800/50 backdrop-blur-md border border-zinc-700/60 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] text-slate-200 rounded-full font-sans text-[10px] md:text-xs font-black tracking-widest uppercase hover:bg-slate-100 hover:text-slate-900 hover:border-slate-100 hover:shadow-lg transition-all duration-300"
                  >
                    <FileDown size={18} />
                    DOWNLOAD RESUME
                  </a>
                  <div className="flex items-center gap-6">
                    <a href="https://github.com/luqss-s" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-400 hover:scale-110 transition-all duration-300">
                      <GithubIcon size={26} />
                    </a>
                    <a href="mailto:luqmanazri0305@gmail.com" className="text-slate-400 hover:text-cyan-400 hover:scale-110 transition-all duration-300">
                      <Mail size={26} />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>

        {/* Experience & Education - Floating Glass Card */}
        <motion.section
          id="experience"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full py-16 px-4 md:px-8 lg:px-12"
        >
          <div className="w-full bg-zinc-950/45 backdrop-blur-2xl border border-zinc-800/40 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] rounded-3xl md:rounded-[2.5rem] p-5 sm:p-8 md:p-16">

            {/* Header & Toggle */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8 md:mb-16">
              <div>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mix-blend-difference mb-4">
                  <Typewriter text="BACKGROUND" />
                </h2>
                <p className="text-zinc-400 text-lg md:text-xl font-serif italic font-light">
                  <Typewriter text="My academic foundation and professional journey." delay={0.2} />
                </p>
              </div>

              <div className="flex bg-zinc-900/40 border border-zinc-850/60 p-1 rounded-full relative w-max backdrop-blur-md shadow-inner">
                <button
                  onClick={() => setActiveTab('experience')}
                  className={`relative z-10 px-8 py-3 rounded-full text-[11px] font-bold tracking-widest uppercase transition-colors duration-300 ${activeTab === 'experience' ? 'text-white font-black' : 'text-zinc-400 hover:text-white'}`}
                >
                  Experience
                </button>
                <button
                  onClick={() => setActiveTab('education')}
                  className={`relative z-10 px-8 py-3 rounded-full text-[11px] font-bold tracking-widest uppercase transition-colors duration-300 ${activeTab === 'education' ? 'text-white font-black' : 'text-zinc-400 hover:text-white'}`}
                >
                  Education
                </button>
                {/* Animated Pill Background */}
                <motion.div
                  className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-zinc-800 rounded-full border border-zinc-700/60"
                  initial={false}
                  animate={{ x: activeTab === 'experience' ? '4px' : 'calc(100% + 4px)' }}
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
                    className="space-y-6 md:space-y-12"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-zinc-800/60 pb-4 md:pb-8">
                      <div>
                        <h4 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-zinc-100">
                          <Typewriter text="Software Engineer Intern" />
                        </h4>
                        <div className="text-zinc-400 text-sm sm:text-base md:text-lg mt-1 md:mt-2 font-light">
                          <Typewriter text="Venture GES Manufacturing Services" delay={0.4} />
                        </div>
                      </div>
                      <div className="text-[10px] text-zinc-300 font-extrabold tracking-widest uppercase border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm px-6 py-3 rounded-full whitespace-nowrap w-fit shadow-md">
                        MAR 2024 — OCT 2024
                      </div>
                    </div>
                    <ul className="space-y-3 md:space-y-6 text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-4xl font-light">
                      {[
                        "Developed and debugged C#-based LogCraftParser application to process PCB data, improving error reporting with detailed logs including line number, model name, station name, and serial number.",
                        "Designed Test Equipment Qualification Web application using ASP.NET, C#, AJAX, Telerik, and MySQL; designed frontend & built backend modules for ICT, FCT, Equipment Validation, and Edit Profile.",
                        "Built WhatsApp Automation system using AutoIt to enable real-time production floor notifications."
                      ].map((text, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <span className="text-cyan-400 font-extrabold drop-shadow-[0_0_4px_rgba(34,211,238,0.5)]">→</span>
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
                    className="space-y-6 md:space-y-12"
                  >
                    <div className="space-y-8 md:space-y-16">
                      {/* Degree */}
                      <div>
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-zinc-800/60 pb-3 mb-3 md:pb-6 md:mb-6">
                          <div>
                            <h4 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-zinc-100">
                              <Typewriter text="Bachelor of Computer Science (Intelligence Computing)" />
                            </h4>
                            <div className="text-zinc-400 text-sm sm:text-base md:text-lg mt-1 md:mt-2 font-light">
                              <Typewriter text="Universiti Sains Malaysia, Pulau Pinang" delay={0.4} />
                            </div>
                          </div>
                          <div className="text-[10px] text-zinc-300 font-extrabold tracking-widest uppercase border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm px-6 py-3 rounded-full whitespace-nowrap w-fit shadow-md">
                            2021 — 2025
                          </div>
                        </div>
                        <div className="space-y-2 md:space-y-4 text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-4xl font-light">

                          <li className="flex items-start gap-4">
                            <span className="text-cyan-400 font-extrabold drop-shadow-[0_0_4px_rgba(34,211,238,0.5)]">→</span>
                            <Typewriter text="Dean's List: Semester 7 (GPA 3.61) & Semester 8 (GPA 3.90)" delay={0.8} />
                          </li>
                        </div>
                      </div>

                      {/* Matriculation */}
                      <div>
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-zinc-800/60 pb-3 mb-3 md:pb-6 md:mb-6">
                          <div>
                            <h4 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-zinc-100">
                              <Typewriter text="Malaysian Matriculation Programme (Science)" />
                            </h4>
                            <div className="text-zinc-400 text-sm sm:text-base md:text-lg mt-1 md:mt-2 font-light">
                              <Typewriter text="Johore Matriculation College, Tangkak" delay={0.4} />
                            </div>
                          </div>
                          <div className="text-[10px] text-zinc-300 font-extrabold tracking-widest uppercase border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm px-6 py-3 rounded-full whitespace-nowrap w-fit shadow-md">
                            2020 — 2021
                          </div>
                        </div>
                        <div className="space-y-2 md:space-y-4 text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-4xl font-light">
                          <li className="flex items-start gap-4">
                            <span className="text-cyan-400 font-extrabold drop-shadow-[0_0_4px_rgba(34,211,238,0.5)]">→</span>
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

        {/* Tools & Languages - Floating Glass Marquee */}
        <motion.section
          id="tools"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full py-16 px-4 md:px-8 lg:px-12"
        >
          <div className="w-full bg-zinc-950/45 backdrop-blur-2xl border border-zinc-800/40 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] rounded-3xl md:rounded-[2.5rem] py-10 md:py-16 overflow-hidden">
            <div className="flex flex-col items-center mb-10 md:mb-16 px-6">
              <h2 className="text-3xl md:text-5xl font-black font-sans uppercase tracking-tighter text-white mix-blend-difference mb-4">Tools &amp; Languages</h2>
              <p className="text-zinc-400 font-serif italic font-light text-center max-w-xl text-sm md:text-base">
                Showcasing my expertise in building scalable, secure, and high-performance applications.
              </p>
            </div>

            <div className="relative w-full flex overflow-hidden group [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
                {[...tools, ...tools].map((tool, idx) => (
                  <div key={idx} className="flex flex-col items-center justify-center gap-4 mx-6">
                    <div className="w-24 h-24 bg-zinc-900/30 border border-zinc-800/60 flex items-center justify-center text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-zinc-800/50 transition-all rounded-2xl shadow-sm hover:shadow-md hover:scale-105 duration-300">
                      {tool.icon}
                    </div>
                    <span className="text-[10px] font-extrabold tracking-widest uppercase text-zinc-400">{tool.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Projects - Floating Glass Grid */}
        <motion.section
          id="projects"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full py-16 px-4 md:px-8 lg:px-12"
        >
          <div className="w-full bg-zinc-950/45 backdrop-blur-2xl border border-zinc-800/40 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] rounded-3xl md:rounded-[2.5rem] py-10 md:py-20 overflow-hidden">
            <div className="px-6 sm:px-8 md:px-16 mb-10 md:mb-16">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mix-blend-difference mb-4">Projects</h2>
              <p className="text-zinc-400 font-serif italic font-light text-lg md:text-xl">
                A selection of my most impactful work.
              </p>
            </div>

            {/* Project Cards Carousel on Mobile, Grid on Desktop */}
            <div className="px-6 sm:px-8 md:px-16 flex flex-row overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 snap-x snap-mandatory no-scrollbar pb-6 md:pb-0">
              {projects.slice(0, visibleProjectsCount).map((project, idx) => (
                <div
                  key={idx}
                  onClick={() => { setSelectedProject(project); setModalPreviewTab('screenshots'); }}
                  className="group bg-zinc-900/30 border border-zinc-800/50 backdrop-blur-md rounded-3xl p-4 sm:p-6 cursor-pointer hover:bg-zinc-800/30 hover:border-cyan-500/45 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-5 shadow-sm w-[82vw] sm:w-[350px] md:w-auto shrink-0 md:shrink snap-center"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <span className={`text-[9px] font-extrabold tracking-widest uppercase px-3 py-1 border rounded-full backdrop-blur-sm ${project.status === 'live'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_2px_10px_rgba(16,185,129,0.2)]'
                      : 'bg-zinc-900/50 text-zinc-500 border-zinc-800/30'
                      }`}>
                      {project.status === 'live' ? '● LIVE' : '○ OFFLINE'}
                    </span>
                    <ArrowUpRight size={16} className="text-zinc-400 group-hover:text-cyan-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300" />
                  </div>

                  {/* Image – Live screenshot via Microlink if live URL exists */}
                  <div className="relative h-36 sm:h-44 w-full overflow-hidden bg-zinc-900/50 rounded-2xl border border-zinc-800/40">
                    {project.live ? (
                      <LivePreviewImage
                        liveUrl={project.live}
                        fallbackSrc={getValidSrc(project.images ? (Array.isArray(project.images) ? project.images[0] : project.images) : null, project.title)}
                        alt={project.title || "Project Image"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      />
                    ) : (
                      <Image
                        src={getValidSrc(project.images ? (Array.isArray(project.images) ? project.images[0] : project.images) : null, project.title)}
                        alt={project.title || "Project Image"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-2.5 flex-grow">
                    <p className="text-[9px] text-zinc-400 font-mono tracking-wider font-semibold uppercase">{project.role}</p>
                    <h3 className="text-sm sm:text-base font-extrabold text-zinc-100 leading-snug group-hover:text-cyan-400 transition-colors duration-300">{project.title}</h3>
                    <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed line-clamp-3 font-light">{project.description}</p>
                  </div>

                  {/* Tech pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {(project.tech || []).slice(0, 4).map((t: string, i: number) => (
                      <span key={i} className="text-[8px] font-extrabold text-zinc-300 bg-zinc-900/40 border border-zinc-800/60 px-2 py-1 tracking-wider uppercase rounded-md backdrop-blur-sm">
                        {t}
                      </span>
                    ))}
                    {project.tech && project.tech.length > 4 && (
                      <span className="text-[8px] font-extrabold text-zinc-500 bg-zinc-900/40 border border-zinc-800/60 px-2 py-1 tracking-wider uppercase rounded-md backdrop-blur-sm">+{project.tech.length - 4}</span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-zinc-800/40">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedProject(project); setModalPreviewTab('screenshots'); }}
                      className="flex-1 py-1.5 md:py-2 text-[8px] sm:text-[9px] font-extrabold tracking-widest uppercase border border-zinc-700 text-zinc-300 bg-zinc-900/40 hover:bg-white hover:text-black hover:border-white transition-all duration-300 rounded-full"
                    >
                      Details
                    </button>
                    {project.live ? (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 py-1.5 md:py-2 text-[8px] sm:text-[9px] font-extrabold tracking-widest uppercase bg-cyan-600 text-white hover:bg-cyan-700 transition-all duration-300 flex items-center justify-center gap-2 rounded-full shadow-sm shadow-cyan-600/10"
                      >
                        <ExternalLink size={11} /> Visit
                      </a>
                    ) : (
                      <span className="flex-1 py-1.5 md:py-2 text-[8px] sm:text-[9px] font-extrabold tracking-widest uppercase border border-zinc-800/50 text-zinc-500 bg-zinc-900/20 flex items-center justify-center rounded-full">
                        OFFLINE
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination / Load More */}
            {visibleProjectsCount < projects.length && (
              <div className="flex justify-center mt-12 w-full">
                <button
                  onClick={() => setVisibleProjectsCount(prev => prev + 6)}
                  className="px-8 py-3 rounded-full text-[11px] font-black tracking-widest uppercase bg-zinc-900/40 border border-zinc-800/60 shadow-[0_5px_15px_rgba(0,0,0,0.3)] hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                >
                  Load More Projects
                </button>
              </div>
            )}

            {/* Expandable Project Screenshots Showcase */}
            {projects && projects.length > 0 && (
              <div className="mt-36 px-3 sm:px-6 md:px-8">
                <ExpandOnHover
                  projects={projects.map((p: any) => ({
                    id: p.id,
                    title: p.title,
                    image: getValidSrc(p.images ? (Array.isArray(p.images) ? p.images[0] : p.images) : null, p.title),
                    role: p.role || "Developer",
                    onSelect: () => {
                      setSelectedProject(p);
                      setModalPreviewTab("screenshots");
                    }
                  }))}
                />
              </div>
            )}
          </div>
        </motion.section>

        {/* Project Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-955/70 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 30, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-7xl max-h-[95vh] overflow-y-auto bg-zinc-950/80 backdrop-blur-2xl border border-zinc-800/80 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] rounded-3xl flex flex-col"
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between gap-6 p-5 sm:p-8 md:p-10 border-b border-zinc-800/60">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span className={`text-[9px] font-extrabold tracking-widest uppercase px-3 py-1 border rounded-full backdrop-blur-sm ${selectedProject.status === 'live' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-900/50 text-zinc-500 border-zinc-800/30'
                        }`}>
                        {selectedProject.status === 'live' ? '● LIVE' : '○ OFFLINE'}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase font-semibold">{selectedProject.role}</span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-extrabold text-zinc-100">{selectedProject.title}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 border border-zinc-800 bg-zinc-900/40 hover:bg-white hover:text-black rounded-full flex items-center justify-center text-zinc-350 transition-all duration-300 shadow-md"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 flex-1">
                  {/* Image Gallery & Info */}
                  <div className="lg:col-span-3 p-5 sm:p-8 md:p-10 lg:border-r border-zinc-800/60 space-y-8">
                    {/* Tab toggle – only show when project has a live URL */}
                    {selectedProject.live && (
                      <div className="flex bg-zinc-900/40 border border-zinc-800/60 p-1 rounded-full relative w-max backdrop-blur-md shadow-inner">
                        <button
                          onClick={() => setModalPreviewTab('screenshots')}
                          className={`relative z-10 px-8 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 ${modalPreviewTab === 'screenshots' ? 'text-white font-black' : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                          Screenshots
                        </button>
                        <button
                          onClick={() => setModalPreviewTab('live')}
                          className={`relative z-10 px-8 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 ${modalPreviewTab === 'live' ? 'text-white font-black' : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                          Live Preview
                        </button>
                        <motion.div
                          className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-zinc-800 rounded-full border border-zinc-700/60"
                          layout
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          style={{ left: modalPreviewTab === 'screenshots' ? '4px' : 'calc(50% + 4px)' }}
                        />
                      </div>
                    )}

                    {/* Screenshots Tab */}
                    {modalPreviewTab === 'screenshots' && (
                      <div className="space-y-4">
                        <div className="relative w-full aspect-video overflow-hidden bg-zinc-900/50 border border-zinc-800/40 rounded-2xl flex items-center justify-center shadow-inner">
                          {/* Blurred Background for Portrait Images */}
                          <div
                            className="absolute inset-0 scale-110 blur-2xl opacity-20 pointer-events-none"
                            style={{
                              backgroundImage: `url(${getValidSrc(selectedProject.images ? (Array.isArray(selectedProject.images) ? selectedProject.images[selectedProject.currentImageIndex || 0] : selectedProject.images) : null, selectedProject.title)})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center'
                            }}
                          />

                          <AnimatePresence mode="wait">
                            <motion.div
                              key={selectedProject.currentImageIndex || 0}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 1.05 }}
                              transition={{ duration: 0.4 }}
                              className="relative z-10 w-full h-full p-2"
                            >
                              <Image
                                src={getValidSrc(selectedProject.images ? (Array.isArray(selectedProject.images) ? selectedProject.images[selectedProject.currentImageIndex || 0] : selectedProject.images) : null, selectedProject.title)}
                                alt={selectedProject.title || "Project image"}
                                fill
                                className="object-contain"
                              />
                            </motion.div>
                          </AnimatePresence>
                        </div>

                        {/* Thumbnails */}
                        {Array.isArray(selectedProject.images) && selectedProject.images.length > 1 && (
                          <div className="flex flex-wrap gap-3">
                            {selectedProject.images.map((img: string, i: number) => (
                              <button
                                key={i}
                                onClick={() => setSelectedProject({ ...selectedProject, currentImageIndex: i })}
                                className={`relative w-20 h-20 border-2 transition-all rounded-lg overflow-hidden ${(selectedProject.currentImageIndex || 0) === i ? 'border-cyan-400 ring-2 ring-cyan-400/20 opacity-100' : 'border-transparent opacity-40 hover:opacity-80'
                                  }`}
                              >
                                <Image src={getValidSrc(img)} fill sizes="80px" className="object-cover" alt="Thumbnail" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Live Preview Tab */}
                    {modalPreviewTab === 'live' && selectedProject.live && (
                      <div className="space-y-2">
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-zinc-800/40 bg-zinc-900/30 shadow-inner">
                          <iframe
                            src={selectedProject.live}
                            title={`${selectedProject.title} live preview`}
                            className="w-full h-full"
                            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                            loading="lazy"
                          />
                        </div>
                        <p className="text-[9px] text-zinc-500 font-mono text-center">
                          Interactive preview — some sites may block iframe embedding
                        </p>
                      </div>
                    )}

                    {/* YouTube */}
                    {selectedProject.youtube && (
                      <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-md border border-zinc-800/40">
                        <iframe
                          src={`https://www.youtube.com/embed/${getYoutubeId(selectedProject.youtube)}`}
                          title={selectedProject.title}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}

                    {/* Description */}
                    <div className="space-y-3">
                      <h4 className="text-[11px] font-extrabold text-cyan-400 font-mono tracking-widest uppercase">// About this project</h4>
                      <p className="text-zinc-300 text-sm md:text-lg leading-relaxed font-light">{selectedProject.description}</p>
                    </div>
                  </div>

                  {/* Right: Tech + Links */}
                  <div className="p-5 sm:p-8 md:p-10 space-y-8">
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-extrabold text-cyan-400 font-mono tracking-widest uppercase">// Tech Stack</h4>
                      <div className="flex flex-wrap gap-2">
                        {(selectedProject.tech || []).map((t: string, i: number) => (
                          <span key={i} className="text-[10px] font-extrabold text-zinc-300 bg-zinc-900/60 border border-zinc-800/80 px-3 py-1.5 tracking-wider uppercase rounded-md shadow-md">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-zinc-800/60">
                      {selectedProject.github && (
                        <a
                          href={selectedProject.github}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-3 w-full py-4 text-[11px] font-extrabold tracking-widest uppercase border border-zinc-800 text-zinc-300 bg-zinc-900/40 hover:bg-white hover:text-black hover:border-white rounded-full transition-all duration-300 shadow-md"
                        >
                          <Code2 size={16} /> VIEW CODE
                        </a>
                      )}
                      {selectedProject.live && (
                        <a
                          href={selectedProject.live}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-3 w-full py-4 bg-cyan-600 text-white text-[11px] font-extrabold tracking-widest uppercase hover:bg-cyan-700 rounded-full transition-all duration-300 shadow-md shadow-cyan-600/10"
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


        {/* GitHub Contributions - Floating Glass Card */}
        <motion.section
          id="github"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full py-10 md:py-16 px-4 md:px-8 lg:px-12"
        >
          <div className="w-full bg-zinc-950/45 backdrop-blur-2xl border border-zinc-800/40 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] rounded-3xl md:rounded-[2.5rem] py-6 sm:py-10 px-4 sm:px-8 md:px-12 flex flex-col">
            <div className="mb-6 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mix-blend-difference mb-4">Contributions</h2>
              <p className="text-zinc-400 font-serif italic font-light text-sm md:text-xl">
                My open source activity on GitHub.
              </p>
            </div>
            <div className="overflow-x-auto flex justify-start md:justify-center w-full">
              <GitHubCalendar
                username="luqss-s"
                colorScheme="dark"
                theme={{
                  dark: ['#18181b', '#0e7490', '#06b6d4', '#22d3ee', '#67e8f9'],
                }}
                fontSize={14}
                blockSize={16}
                blockMargin={5}
              />
            </div>
          </div>
        </motion.section>



        {/* Footer */}
        <footer className="border-t border-zinc-800/40 mt-16 px-4 md:px-8 lg:px-12 w-full">
          <div className="px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-zinc-500 font-medium">
            <div className="flex items-center gap-2 font-mono">
              <Terminal size={14} className="text-cyan-400" />
              <span>sys.exit(0)</span>
            </div>
            <span>© {new Date().getFullYear()} LUQMAN AZRI</span>
          </div>
        </footer>
      </motion.div>
    </>
  );
}
