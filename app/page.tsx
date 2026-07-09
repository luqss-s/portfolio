"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import Lenis from "lenis";
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

// Concave curve SVG divider — sits at the very top of each section card
const CurveDivider = ({ color = "#f4f4f1", bgColor = "transparent" }: { color?: string; bgColor?: string }) => (
  <div className="w-full overflow-hidden leading-none" style={{ background: bgColor, marginBottom: '-2px' }}>
    <svg
      viewBox="0 0 1440 80"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className="w-full block"
      style={{ height: '60px' }}
    >
      <path
        d="M0,80 C360,0 1080,0 1440,80 L1440,80 L0,80 Z"
        fill={color}
      />
    </svg>
  </div>
);

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

const ScrambleText = ({ text, delay = 0, trigger = true, skipInitial = false }: { text: string, delay?: number, trigger?: boolean, skipInitial?: boolean }) => {
  const [displayText, setDisplayText] = useState(text);
  const [scrambleCount, setScrambleCount] = useState(0);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+?=";

  useEffect(() => {
    if (!trigger) return;
    if (skipInitial && scrambleCount === 0) return;

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
  }, [text, delay, trigger, scrambleCount, skipInitial]);

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

const ProgressScrambleText = ({ text, progress }: { text: string; progress: number }) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+?=";
  const targetLength = text.length;
  const revealedCount = Math.floor((progress / 100) * targetLength);
  const [scrambled, setScrambled] = useState(text);

  useEffect(() => {
    const result = text
      .split("")
      .map((char, index) => {
        if (char === " ") return " ";
        if (index < revealedCount) {
          return char;
        }
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join("");
    setScrambled(result);
  }, [text, progress, revealedCount]);

  return <span>{scrambled}</span>;
};

const BootLoader = ({ onDone }: { onDone: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds animation
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(Math.round(nextProgress));

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(onDone, 400); // Small pause at 100% before unmounting
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-black flex flex-col justify-center px-6 md:px-12 lg:px-24 pointer-events-none select-none"
    >
      <div className="max-w-6xl w-full mx-auto flex flex-col justify-center">
        <div className="flex flex-col gap-0 relative">
          {/* Row 1: LUQMAN */}
          <div className="flex items-baseline overflow-hidden">
            <motion.span
              layoutId="hero-luqman"
              className="font-mono text-[9vw] sm:text-[10vw] md:text-[12vw] font-black leading-[0.8] text-white tracking-tighter"
            >
              <ProgressScrambleText text="LUQMAN" progress={progress} />
            </motion.span>
          </div>

          {/* Row 2: AZRI. */}
          <div className="flex items-baseline overflow-hidden mt-1 md:mt-2">
            <motion.span
              layoutId="hero-azri"
              className="font-sans font-black text-[8vw] sm:text-[9vw] md:text-[11vw] leading-[0.75] text-white tracking-tighter uppercase"
            >
              <ProgressScrambleText text="AZRI." progress={progress} />
            </motion.span>
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="mt-8 md:mt-10 max-w-[250px] md:max-w-[320px] w-full">
          <div className="h-[2px] bg-zinc-900 w-full overflow-hidden relative rounded-full">
            <div
              className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)] transition-all duration-75 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-3 font-mono text-[8px] md:text-[10px] text-zinc-500 tracking-widest uppercase">
            <span>INITIALIZING WEB</span>
            <span className="text-zinc-300 font-bold">{progress}%</span>
          </div>
        </div>
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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <BootLoader onDone={() => setLoading(false)} />
        )}
      </AnimatePresence>

      {!loading && (
        <MainPortfolioContent />
      )}
    </>
  );
}

function MainPortfolioContent() {
  const [projects, setProjects] = useState<any[]>([]);
  const [visibleProjectsCount, setVisibleProjectsCount] = useState(6);
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [modalPreviewTab, setModalPreviewTab] = useState<'screenshots' | 'live'>('screenshots');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 1. Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // 2. Auto-hiding Navbar
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Only hide navbar when scrolling down past 100px
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const [timeString, setTimeString] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kuala_Lumpur",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      };
      const formatter = new Intl.DateTimeFormat([], options);
      setTimeString(`${formatter.format(now)} MYT`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 3. Scroll transformations for Hero Exit Animation
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);
  const heroY = useTransform(scrollY, [0, 400], [0, 50]);

  // 4. Scroll progress hooks and interpolations for auto-full-page scale effect
  const expScrollRef = useRef<HTMLDivElement>(null);
  const toolsScrollRef = useRef<HTMLDivElement>(null);
  const projectsScrollRef = useRef<HTMLDivElement>(null);
  const githubScrollRef = useRef<HTMLDivElement>(null);
  const footerScrollRef = useRef<HTMLDivElement>(null);

  // Tracks the entire scroll timeline of the Experience section for background transition
  const { scrollYProgress: expBgScrollY } = useScroll({
    target: expScrollRef,
    offset: ["start end", "end start"]
  });
  const bgOpacity = useTransform(expBgScrollY, [0.05, 0.25, 0.8, 0.95], [1, 0, 0, 1]);

  const { scrollYProgress: expScrollY } = useScroll({
    target: expScrollRef,
    offset: ["start end", "end start"]
  });
  const { scrollYProgress: toolsScrollY } = useScroll({
    target: toolsScrollRef,
    offset: ["start end", "end start"]
  });
  const { scrollYProgress: projectsScrollY } = useScroll({
    target: projectsScrollRef,
    offset: ["start end", "end start"]
  });
  const { scrollYProgress: githubScrollY } = useScroll({
    target: githubScrollRef,
    offset: ["start end", "end start"]
  });
  const { scrollYProgress: footerScrollY } = useScroll({
    target: footerScrollRef,
    offset: ["start end", "end end"]
  });

  // Entry: 92% → 96% as section scrolls into view (leaves gap on sides)
  // In-view: stays at 96% while section is on screen
  // Exit: 96% → 92% as section scrolls out above
  const expWidth = useTransform(expScrollY, [0.05, 0.25, 0.75, 0.95], ["92%", "96%", "96%", "92%"]);
  const expRadius = useTransform(expScrollY, [0.05, 0.25, 0.75, 0.95], ["2.5rem", "0.75rem", "0.75rem", "2.5rem"]);
  const expBorderColor = useTransform(expScrollY, [0.05, 0.25, 0.75, 0.95], ["rgba(63, 63, 70, 0.4)", "rgba(63, 63, 70, 0.2)", "rgba(63, 63, 70, 0.2)", "rgba(63, 63, 70, 0.4)"]);

  const toolsWidth = useTransform(toolsScrollY, [0.05, 0.25, 0.75, 0.95], ["92%", "96%", "96%", "92%"]);
  const toolsRadius = useTransform(toolsScrollY, [0.05, 0.25, 0.75, 0.95], ["2.5rem", "0.75rem", "0.75rem", "2.5rem"]);
  const toolsBorderColor = useTransform(toolsScrollY, [0.05, 0.25, 0.75, 0.95], ["rgba(228, 228, 231, 0.5)", "rgba(228, 228, 231, 0.2)", "rgba(228, 228, 231, 0.2)", "rgba(228, 228, 231, 0.5)"]);

  const projectsWidth = useTransform(projectsScrollY, [0.05, 0.15, 0.85, 0.95], ["92%", "96%", "96%", "92%"]);
  const projectsRadius = useTransform(projectsScrollY, [0.05, 0.15, 0.85, 0.95], ["2.5rem", "0.75rem", "0.75rem", "2.5rem"]);
  const projectsBorderColor = useTransform(projectsScrollY, [0.05, 0.15, 0.85, 0.95], ["rgba(228, 228, 231, 0.5)", "rgba(228, 228, 231, 0.2)", "rgba(228, 228, 231, 0.2)", "rgba(228, 228, 231, 0.5)"]);

  const githubWidth = useTransform(githubScrollY, [0.05, 0.25, 0.75, 0.95], ["92%", "96%", "96%", "92%"]);
  const githubRadius = useTransform(githubScrollY, [0.05, 0.25, 0.75, 0.95], ["2.5rem", "0.75rem", "0.75rem", "2.5rem"]);
  const githubBorderColor = useTransform(githubScrollY, [0.05, 0.25, 0.75, 0.95], ["rgba(228, 228, 231, 0.5)", "rgba(228, 228, 231, 0.2)", "rgba(228, 228, 231, 0.2)", "rgba(228, 228, 231, 0.5)"]);

  const footerWidth = useTransform(footerScrollY, [0.15, 0.85], ["92%", "96%"]);
  const footerRadius = useTransform(footerScrollY, [0.15, 0.85], ["2.5rem", "0.75rem"]);
  const footerBorderColor = useTransform(footerScrollY, [0.15, 0.85], ["rgba(228, 228, 231, 0.5)", "rgba(228, 228, 231, 0.2)"]);

  useEffect(() => {
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

  return (
    <>
      {/* Mesh Gradient Background */}
      <motion.div
        style={{ opacity: bgOpacity }}
        className="fixed inset-0 z-[-20] overflow-hidden bg-black pointer-events-none"
      >
        <MeshGradient
          className="w-full h-full absolute inset-0"
          colors={["#000000", "#121212", "#27272a", "#3f3f46"]}
          speed={0.5}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen text-zinc-100 selection:bg-cyan-500/30 selection:text-cyan-200 font-sans relative z-10"
      >
        <CursorTrail />
        {/* Floating Glass Navigation */}
        <motion.nav
          animate={{ y: showNav ? 0 : -110 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl bg-zinc-950/45 backdrop-blur-2xl z-50 border border-zinc-800/40 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] rounded-3xl overflow-hidden"
        >
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
        </motion.nav>

        {/* Hero Section */}
        <motion.section
          id="about"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="w-full min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-28 pb-10 md:pt-32 md:pb-16 relative overflow-hidden"
        >
          <motion.div
            style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
            className="w-full h-full flex flex-col justify-center"
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
                  layoutId="hero-luqman"
                  whileHover={{ color: "#caf0f8" }}
                  className="font-mono text-[14vw] sm:text-[16vw] md:text-[22vw] font-black leading-[0.8] text-white mix-blend-difference tracking-tighter cursor-default select-none transition-colors duration-300"
                >
                  <ScrambleText text="LUQMAN" trigger={true} delay={0.2} skipInitial />
                </motion.span>
              </div>

              {/* Row 2 */}
              <div className="flex flex-col xl:flex-row xl:items-end gap-6 xl:gap-24 mt-2">
                <div className="flex overflow-hidden">
                  <motion.span
                    layoutId="hero-azri"
                    whileHover={{ color: "#caf0f8" }}
                    className="font-sans font-black text-[12vw] sm:text-[14vw] md:text-[20vw] leading-[0.75] text-white mix-blend-difference tracking-tighter uppercase cursor-default select-none transition-colors duration-300"
                  >
                    <ScrambleText text="AZRI." trigger={true} delay={0.5} skipInitial />
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
          </motion.div>
        </motion.section>

        {/* Tools & Languages - Floating Glass Marquee */}
        <motion.section
          id="tools"
          ref={toolsScrollRef}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full py-0 px-0 md:px-0 lg:px-0"
        >
          <motion.div
            style={{ width: toolsWidth, borderRadius: toolsRadius, borderColor: toolsBorderColor }}
            className="mx-auto bg-[#f4f4f1] border shadow-2xl overflow-hidden min-h-[100dvh] flex flex-col justify-center"
          >
            {/* Concave curve top divider */}
            <CurveDivider color="#f4f4f1" bgColor="transparent" />
            <div className="flex flex-col items-center mb-12 md:mb-20 px-6 sm:px-10 text-center min-h-[220px] sm:min-h-[180px] md:min-h-[150px] justify-center">
              <motion.p
                variants={{
                  hidden: { opacity: 1 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.02, delayChildren: 0.2 } }
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-zinc-500 max-w-5xl leading-tight"
              >
                {[
                  { text: "I build ", bold: false },
                  { text: "full-stack web systems", bold: true },
                  { text: " with clean user interfaces, ", bold: false },
                  { text: "reliable backend architecture", bold: true },
                  { text: ", and data-driven workflows helping teams turn complex processes into ", bold: false },
                  { text: "efficient digital products", bold: true },
                  { text: ".", bold: false },
                ].map((chunk, i) => (
                  <span key={i} className={chunk.bold ? "font-bold text-zinc-950" : ""}>
                    {chunk.text.split("").map((char, j) => (
                      <motion.span
                        key={j}
                        variants={{
                          hidden: { opacity: 0, display: 'none' },
                          visible: { opacity: 1, display: 'inline' }
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                ))}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                  className="inline-block w-[3px] h-[1em] bg-zinc-950 align-middle ml-1 -mt-2"
                />
              </motion.p>
            </div>

            <div className="relative w-full flex overflow-hidden group [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
                {[...tools, ...tools].map((tool, idx) => (
                  <div key={idx} className="flex flex-col items-center justify-center gap-4 mx-6">
                    <div className="w-24 h-24 bg-zinc-200/40 border border-zinc-300/40 flex items-center justify-center text-zinc-700 hover:text-cyan-600 hover:border-cyan-500/50 hover:bg-white transition-all rounded-2xl shadow-sm hover:shadow-md hover:scale-105 duration-300">
                      {tool.icon}
                    </div>
                    <span className="text-[10px] font-extrabold tracking-widest uppercase text-zinc-500">{tool.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Experience & Education */}
        <motion.section
          id="experience"
          ref={expScrollRef}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full py-0 px-0 md:px-0 lg:px-0"
        >
          <motion.div
            style={{ width: expWidth, borderRadius: expRadius }}
            className="mx-auto overflow-hidden px-4 md:px-8 lg:px-12 flex flex-col justify-center min-h-[100dvh]"
          >
            {/* Header & Toggle */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8 md:mb-12 pt-24">
              <div>
                <span className="font-mono text-zinc-500 uppercase tracking-widest text-[10px] md:text-xs">
                  {activeTab === 'experience' ? "Career Archive" : "Academic Path"}
                </span>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-100 mt-1 leading-none">
                  {activeTab === 'experience' ? "Experiences" : "Education"}
                </h2>
              </div>

              <div className="flex flex-col md:items-end gap-4">
                <p className="text-zinc-400 text-xs md:text-sm font-serif italic font-light text-left md:text-right max-w-xs">
                  {activeTab === 'experience'
                    ? "Roles, systems, and the work behind them."
                    : "My academic foundation and qualifications."}
                </p>

                {/* Toggle tab */}
                <div className="flex bg-zinc-800 border border-zinc-700 p-1 rounded-full relative w-max shadow-inner mt-2">
                  <button
                    onClick={() => setActiveTab('experience')}
                    className={`relative z-10 px-6 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 ${activeTab === 'experience' ? 'text-white font-black' : 'text-zinc-500 hover:text-zinc-200'}`}
                  >
                    Experience
                  </button>
                  <button
                    onClick={() => setActiveTab('education')}
                    className={`relative z-10 px-6 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 ${activeTab === 'education' ? 'text-white font-black' : 'text-zinc-500 hover:text-zinc-200'}`}
                  >
                    Education
                  </button>
                  {/* Animated Pill Background */}
                  <motion.div
                    className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-zinc-700 rounded-full border border-zinc-600/60 shadow-sm"
                    initial={false}
                    animate={{ x: activeTab === 'experience' ? '4px' : 'calc(100% + 4px)' }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="w-full relative">
              <AnimatePresence mode="wait">
                {activeTab === 'experience' ? (
                  <motion.div
                    key="exp"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="w-full flex flex-row overflow-x-auto gap-8 pb-8 no-scrollbar snap-x snap-mandatory justify-center"
                  >
                    {/* Experience Card */}
                    <motion.div
                      className="w-full mx-auto overflow-hidden border border-zinc-700/40 rounded-[2.5rem] shadow-xl flex flex-col md:grid md:grid-cols-12 min-h-[650px] shrink-0 snap-center"
                    >
                      {/* Left Side: Content */}
                      <div className="md:col-span-7 bg-[#f4f4f1] text-zinc-900 p-8 sm:p-10 md:p-14 flex flex-col justify-between gap-8">
                        <div>
                          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                            <span>Professional Experience</span>
                            <span className="bg-zinc-200 text-zinc-800 text-[9px] font-bold px-2 py-0.5 rounded-full">Work</span>
                          </div>

                          <h3 className="font-sans font-black text-3xl sm:text-4xl md:text-5xl text-zinc-950 tracking-tighter mt-4 leading-none uppercase">
                            Software Engineer Intern
                          </h3>

                          <p className="font-sans font-bold text-[11px] md:text-xs text-zinc-700 tracking-wider mt-3 uppercase">
                            Venture GES Manufacturing Services
                          </p>

                          <p className="text-zinc-600 text-xs sm:text-sm md:text-base leading-relaxed font-light mt-8 max-w-xl">
                            Developed and debugged C#-based LogCraftParser application to process PCB data, improving error reporting with detailed logs including line number, model name, station name, and serial number. Designed Test Equipment Qualification Web application using ASP.NET, C#, AJAX, Telerik, and MySQL; designed frontend & built backend modules for ICT, FCT, Equipment Validation, and Edit Profile. Built WhatsApp Automation system using AutoIt to enable real-time production floor notifications.
                          </p>
                        </div>

                        <div>
                          <div className="border-t border-zinc-300 w-full my-6" />
                          <p className="font-mono text-[9px] text-zinc-400 tracking-widest uppercase mb-4 font-semibold">Highlights</p>

                          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-left">
                            <div className="flex items-center">
                              <span className="font-mono text-[10px] text-zinc-400 mr-2">01</span>
                              <span className="font-sans text-[11px] md:text-xs font-bold text-zinc-800 uppercase tracking-wider">LogCraft Parser</span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-mono text-[10px] text-zinc-400 mr-2">02</span>
                              <span className="font-sans text-[11px] md:text-xs font-bold text-zinc-800 uppercase tracking-wider">Test Equipment Web App</span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-mono text-[10px] text-zinc-400 mr-2">03</span>
                              <span className="font-sans text-[11px] md:text-xs font-bold text-zinc-800 uppercase tracking-wider">WhatsApp Automation</span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-mono text-[10px] text-zinc-400 mr-2">04</span>
                              <span className="font-sans text-[11px] md:text-xs font-bold text-zinc-800 uppercase tracking-wider">Production Notifications</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Image */}
                      <div className="md:col-span-5 relative min-h-[300px] md:min-h-full overflow-hidden bg-zinc-950">
                        <Image
                          src="/venture.jpg"
                          alt="Venture GES Office"
                          fill
                          className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 z-10 pointer-events-none" />

                        <span className="absolute top-6 right-8 font-sans font-black text-5xl md:text-7xl text-white/90 tracking-tighter z-20">
                          01
                        </span>

                        <div className="absolute bottom-6 left-8 font-mono text-[10px] md:text-xs text-white/90 tracking-widest uppercase z-20">
                          MAR 2024 — OCT 2024 · 7 MONTHS
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ) : (
                  <EducationSection />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.section>

        {/* Projects - Floating Glass Grid */}
        <motion.section
          id="projects"
          ref={projectsScrollRef}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full py-0 px-0 md:px-0 lg:px-0"
        >
          <motion.div
            style={{ width: projectsWidth, borderRadius: projectsRadius, borderColor: projectsBorderColor }}
            className="mx-auto bg-[#f4f4f1] border shadow-2xl overflow-hidden min-h-[100dvh] flex flex-col justify-center"
          >
            {/* Concave curve top divider */}
            <CurveDivider color="#f4f4f1" bgColor="transparent" />
            <div className="px-6 sm:px-8 md:px-16 mb-10 md:mb-16">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-zinc-950 mb-4">Projects</h2>
              <p className="text-zinc-600 font-serif italic font-light text-lg md:text-xl">
                A selection of my most impactful work.
              </p>
            </div>

            {/* Project Cards Carousel on Mobile, Grid on Desktop */}
            <div className="px-6 sm:px-8 md:px-16 flex flex-row overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 snap-x snap-mandatory no-scrollbar pb-6 md:pb-0">
              {projects.slice(0, visibleProjectsCount).map((project, idx) => (
                <div
                  key={idx}
                  onClick={() => { setSelectedProject(project); setModalPreviewTab('screenshots'); }}
                  className="group bg-white/70 border border-zinc-200/50 backdrop-blur-md rounded-3xl p-4 sm:p-6 cursor-pointer hover:bg-white hover:border-cyan-500/45 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-5 shadow-sm w-[82vw] sm:w-[350px] md:w-auto shrink-0 md:shrink snap-center"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <span className={`text-[9px] font-extrabold tracking-widest uppercase px-3 py-1 border rounded-full backdrop-blur-sm ${project.status === 'live'
                      ? 'bg-emerald-100/80 text-emerald-800 border-emerald-200/60 shadow-sm'
                      : 'bg-zinc-200/80 text-zinc-500 border-zinc-300/40'
                      }`}>
                      {project.status === 'live' ? '● LIVE' : '○ OFFLINE'}
                    </span>
                    <ArrowUpRight size={16} className="text-zinc-500 group-hover:text-cyan-600 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300" />
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
                    <p className="text-[9px] text-zinc-500 font-mono tracking-wider font-semibold uppercase">{project.role}</p>
                    <h3 className="text-sm sm:text-base font-extrabold text-zinc-950 leading-snug group-hover:text-cyan-600 transition-colors duration-300">{project.title}</h3>
                    <p className="text-zinc-600 text-[11px] sm:text-xs leading-relaxed line-clamp-3 font-light">{project.description}</p>
                  </div>

                  {/* Tech pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {(project.tech || []).slice(0, 4).map((t: string, i: number) => (
                      <span key={i} className="text-[8px] font-extrabold text-zinc-700 bg-zinc-200/50 border border-zinc-300/40 px-2 py-1 tracking-wider uppercase rounded-md">
                        {t}
                      </span>
                    ))}
                    {project.tech && project.tech.length > 4 && (
                      <span className="text-[8px] font-extrabold text-zinc-500 bg-zinc-200/50 border border-zinc-300/40 px-2 py-1 tracking-wider uppercase rounded-md">+{project.tech.length - 4}</span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-zinc-200/40">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedProject(project); setModalPreviewTab('screenshots'); }}
                      className="flex-1 py-1.5 md:py-2 text-[8px] sm:text-[9px] font-extrabold tracking-widest uppercase border border-zinc-300 text-zinc-700 bg-white/50 hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-all duration-300 rounded-full"
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
                      <span className="flex-1 py-1.5 md:py-2 text-[8px] sm:text-[9px] font-extrabold tracking-widest uppercase border border-zinc-200 text-zinc-400 bg-zinc-100/30 flex items-center justify-center rounded-full">
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
                  className="px-8 py-3 rounded-full text-[11px] font-black tracking-widest uppercase bg-white/60 border border-zinc-300/60 shadow-[0_5px_15px_rgba(0,0,0,0.05)] text-zinc-800 hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-all duration-300"
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
          </motion.div>
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
                className="w-full max-w-7xl max-h-[95vh] overflow-hidden bg-zinc-950/80 backdrop-blur-2xl border border-zinc-800/80 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] rounded-3xl flex flex-col"
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between gap-6 p-5 sm:p-8 md:p-10 border-b border-zinc-800/60 flex-shrink-0">
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

                <div className="grid grid-cols-1 lg:grid-cols-4 flex-1 overflow-y-auto min-h-0 overscroll-contain">
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
          ref={githubScrollRef}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full py-0 px-0 md:px-0 lg:px-0"
        >
          <motion.div
            style={{ width: githubWidth, borderRadius: githubRadius }}
            className="mx-auto overflow-hidden flex flex-col justify-center min-h-[100dvh]"
          >
            <div className="px-4 sm:px-8 md:px-12 pb-6 sm:pb-10 flex flex-col justify-center flex-1">
              <div className="mb-6 md:mb-16">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-zinc-100 mb-4">Contributions</h2>
                <p className="text-zinc-400 font-serif italic font-light text-sm md:text-xl">
                  My open source activity on GitHub.
                </p>
              </div>
              <div className="overflow-x-auto flex justify-start md:justify-center w-full">
                <GitHubCalendar
                  username="luqss-s"
                  colorScheme="dark"
                  theme={{
                    dark: ['#27272a', '#a7f3d0', '#34d399', '#059669', '#064e3b'],
                  }}
                  fontSize={14}
                  blockSize={16}
                  blockMargin={5}
                />
              </div>
            </div>
          </motion.div>
        </motion.section>



        {/* Footer - Floating Card expanding to Full Page */}
        <motion.section
          id="contact"
          ref={footerScrollRef}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full py-0 px-0 md:px-0 lg:px-0"
        >
          <motion.div
            style={{ width: footerWidth, borderRadius: footerRadius, borderColor: footerBorderColor }}
            className="mx-auto bg-[#f4f4f1] border shadow-2xl pb-12 px-6 sm:px-10 md:px-16 flex flex-col items-center justify-center relative overflow-hidden min-h-[100dvh]"
          >
            {/* Concave curve top divider */}
            <CurveDivider color="#f4f4f1" bgColor="transparent" />
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
              <span className="text-[20vw] font-black uppercase text-zinc-400/20 font-sans leading-none tracking-tighter">
                HELLO
              </span>
            </div>

            {/* Main Split Grid */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 z-10">
              {/* Left Column (col-span-7): Heading & Location */}
              <div className="lg:col-span-7 flex flex-col justify-between gap-12 text-left">
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500 font-extrabold">
                    Get in Touch
                  </span>
                  <h2 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter text-zinc-950 leading-[0.9] mt-6 select-none">
                    LET'S BUILD <br />
                    <span className="font-serif italic font-light lowercase text-zinc-800 text-[1.1em]">something</span> <br />
                    EXTRAORDINARY.
                  </h2>
                </div>

                <div className="flex items-center gap-3 text-zinc-600">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-mono text-xs tracking-wider uppercase font-semibold">
                    AVAILABLE FOR FREELANCE & CONTRACTS
                  </span>
                </div>
              </div>

              {/* Right Column (col-span-5): Contact Info & Socials */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-12 lg:items-end">
                <div className="w-full lg:text-right">
                  <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-zinc-500 mb-4 font-semibold">
                    KUALA LUMPUR, MY · {timeString || "12:00:00 MYT"}
                  </p>
                  <a
                    href="mailto:luqmanazri0305@gmail.com"
                    className="group inline-flex items-center justify-between w-full lg:w-auto gap-4 px-8 py-5 bg-zinc-950 text-white rounded-full font-bold shadow-xl hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 tracking-wider text-sm md:text-base"
                  >
                    <span>luqmanazri0305@gmail.com</span>
                    <span className="inline-block transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 text-cyan-400">↗</span>
                  </a>
                </div>

                <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs font-black uppercase tracking-widest text-zinc-500 font-mono lg:justify-end w-full">
                  <a href="/Luqman.pdf" download className="hover:text-zinc-950 transition-colors duration-300 relative group">
                    RESUME
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-zinc-950 group-hover:w-full transition-all duration-300" />
                  </a>
                  <a href="https://github.com/luqss-s" target="_blank" rel="noreferrer" className="hover:text-zinc-950 transition-colors duration-300 relative group">
                    GITHUB
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-zinc-950 group-hover:w-full transition-all duration-300" />
                  </a>
                  <a href="https://linkedin.com/in/luqman-azri" target="_blank" rel="noreferrer" className="hover:text-zinc-950 transition-colors duration-300 relative group">
                    LINKEDIN
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-zinc-950 group-hover:w-full transition-all duration-300" />
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Copyright and sys.exit */}
            <div className="w-full max-w-6xl border-t border-zinc-200/60 pt-10 flex flex-col sm:flex-row justify-between items-center gap-6 text-[10px] text-zinc-500 font-mono z-10">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span>sys.exit(0)</span>
              </div>
              <span className="text-center sm:text-right">© {new Date().getFullYear()} LUQMAN AZRI. ALL RIGHTS RESERVED.</span>
            </div>
          </motion.div>
        </motion.section>
      </motion.div>
    </>
  );
}

function EducationSection() {
  return (
    <motion.div
      key="edu"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col w-full mx-auto"
    >
      {/* Education Card 1: Degree */}
      <div className="py-0 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden border border-zinc-700/40 rounded-[2.5rem] shadow-2xl flex flex-col md:grid md:grid-cols-12 min-h-[650px] w-full"
        >
          {/* Left Side: Content */}
          <div className="md:col-span-7 bg-[#f4f4f1] text-zinc-900 p-8 sm:p-10 md:p-14 flex flex-col justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                <span>Academic Path</span>
                <span className="bg-zinc-200 text-zinc-800 text-[9px] font-bold px-2 py-0.5 rounded-full">Degree</span>
              </div>

              <h3 className="font-sans font-black text-3xl sm:text-4xl md:text-5xl text-zinc-950 tracking-tighter mt-4 leading-none uppercase">
                Bachelor of Computer Science
              </h3>

              <p className="font-sans font-bold text-[11px] md:text-xs text-zinc-700 tracking-wider mt-3 uppercase">
                Universiti Sains Malaysia, Pulau Pinang
              </p>

              <p className="text-zinc-600 text-xs sm:text-sm md:text-base leading-relaxed font-light mt-8 max-w-xl">
                Specialized in Intelligence Computing. Focused on machine learning, artificial intelligence, database systems, and advanced full-stack web architectures. Gained hands-on experience through project-based coursework.
              </p>
            </div>

            <div>
              <div className="border-t border-zinc-300 w-full my-6" />
              <p className="font-mono text-[9px] text-zinc-400 tracking-widest uppercase mb-4 font-semibold">Highlights</p>

              <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-left">
                <div className="flex items-center">
                  <span className="font-mono text-[10px] text-zinc-400 mr-2">01</span>
                  <span className="font-sans text-[11px] md:text-xs font-bold text-zinc-800 uppercase tracking-wider">Intelligence Computing</span>
                </div>
                <div className="flex items-center">
                  <span className="font-mono text-[10px] text-zinc-400 mr-2">02</span>
                  <span className="font-sans text-[11px] md:text-xs font-bold text-zinc-800 uppercase tracking-wider">Machine Learning & AI</span>
                </div>
                <div className="flex items-center">
                  <span className="font-mono text-[10px] text-zinc-400 mr-2">03</span>
                  <span className="font-sans text-[11px] md:text-xs font-bold text-zinc-800 uppercase tracking-wider">Semester 7 Dean's List</span>
                </div>
                <div className="flex items-center">
                  <span className="font-mono text-[10px] text-zinc-400 mr-2">04</span>
                  <span className="font-sans text-[11px] md:text-xs font-bold text-zinc-800 uppercase tracking-wider">Semester 8 Dean's List</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Image */}
          <div className="md:col-span-5 relative min-h-[300px] md:min-h-full overflow-hidden bg-zinc-950">
            <Image
              src="/usm.jpg"
              alt="Universiti Sains Malaysia Campus"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 z-10 pointer-events-none" />

            <span className="absolute top-6 right-8 font-sans font-black text-5xl md:text-7xl text-white/90 tracking-tighter z-20">
              01
            </span>

            <div className="absolute bottom-6 left-8 font-mono text-[10px] md:text-xs text-white/90 tracking-widest uppercase z-20">
              2021 — 2025 · 4 YEARS
            </div>
          </div>
        </motion.div>
      </div>

      {/* Education Card 2: Matriculation */}
      <div className="py-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="overflow-hidden border border-zinc-700/40 rounded-[2.5rem] shadow-2xl flex flex-col md:grid md:grid-cols-12 min-h-[650px] w-full"
        >
          {/* Left Side: Content */}
          <div className="md:col-span-7 bg-[#f4f4f1] text-zinc-900 p-8 sm:p-10 md:p-14 flex flex-col justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                <span>Academic Path</span>
                <span className="bg-zinc-200 text-zinc-800 text-[9px] font-bold px-2 py-0.5 rounded-full">Science</span>
              </div>

              <h3 className="font-sans font-black text-3xl sm:text-4xl md:text-5xl text-zinc-950 tracking-tighter mt-4 leading-none uppercase">
                Matriculation Programme
              </h3>

              <p className="font-sans font-bold text-[11px] md:text-xs text-zinc-700 tracking-wider mt-3 uppercase">
                Johore Matriculation College, Tangkak
              </p>

              <p className="text-zinc-600 text-xs sm:text-sm md:text-base leading-relaxed font-light mt-8 max-w-xl">
                Completed rigorous pre-university physical science program with a strong focus on mathematics, computer science, and physics, establishing a solid quantitative base for higher education.
              </p>
            </div>

            <div>
              <div className="border-t border-zinc-300 w-full my-6" />
              <p className="font-mono text-[9px] text-zinc-400 tracking-widest uppercase mb-4 font-semibold">Highlights</p>

              <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-left">
                <div className="flex items-center">
                  <span className="font-mono text-[10px] text-zinc-400 mr-2">01</span>
                  <span className="font-sans text-[11px] md:text-xs font-bold text-zinc-800 uppercase tracking-wider">Physical Sciences Stream</span>
                </div>
                <div className="flex items-center">
                  <span className="font-mono text-[10px] text-zinc-400 mr-2">02</span>
                  <span className="font-sans text-[11px] md:text-xs font-bold text-zinc-800 uppercase tracking-wider">Advanced Mathematics</span>
                </div>
                <div className="flex items-center">
                  <span className="font-mono text-[10px] text-zinc-400 mr-2">03</span>
                  <span className="font-sans text-[11px] md:text-xs font-bold text-zinc-800 uppercase tracking-wider">Analytical Physics</span>
                </div>
                <div className="flex items-center">
                  <span className="font-mono text-[10px] text-zinc-400 mr-2">04</span>
                  <span className="font-sans text-[11px] md:text-xs font-bold text-zinc-800 uppercase tracking-wider">CGPA 3.83 Academic Honors</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Image */}
          <div className="md:col-span-5 relative min-h-[300px] md:min-h-full overflow-hidden bg-zinc-950">
            <Image
              src="/kmj.jpg"
              alt="Johore Matriculation College"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 z-10 pointer-events-none" />

            <span className="absolute top-6 right-8 font-sans font-black text-5xl md:text-7xl text-white/90 tracking-tighter z-20">
              02
            </span>

            <div className="absolute bottom-6 left-8 font-mono text-[10px] md:text-xs text-white/90 tracking-widest uppercase z-20">
              2020 — 2021 · 1 YEAR
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
