"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

interface ProjectItem {
  id: string;
  title: string;
  image: string;
  role: string;
  onSelect: () => void;
}

interface ExpandOnHoverProps {
  projects: ProjectItem[];
}

// Fallback high-quality stock developer/tech images
const fallbackImages = [
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
];

const ExpandOnHover = ({ projects }: ExpandOnHoverProps) => {
  const [expandedIndex, setExpandedIndex] = useState(0);

  if (!projects || projects.length === 0) return null;

  // Take at most 6 projects for the visual showcase
  const items = projects.slice(0, 6).map((proj, idx) => {
    // If the project doesn't have a valid image, use a fallback
    const imgUrl = proj.image && proj.image !== "[]" && !proj.image.includes("placehold.co")
      ? proj.image
      : fallbackImages[idx % fallbackImages.length];

    return {
      ...proj,
      image: imgUrl,
    };
  });

  return (
    <div className="w-full bg-zinc-950/20 border border-zinc-900/60 rounded-3xl md:rounded-[2.5rem] py-8 px-2.5 md:py-10 md:px-6 backdrop-blur-md shadow-inner">


      <div className="flex w-full items-center justify-start md:justify-center overflow-x-auto md:overflow-visible no-scrollbar py-2">
        <div className="flex min-w-full md:w-full items-center justify-start md:justify-center gap-2 md:gap-3">
          {items.map((project, idx) => {
            const isExpanded = idx === expandedIndex;

            return (
              <div
                key={project.id || idx}
                className={`relative cursor-pointer overflow-hidden rounded-2xl md:rounded-3xl border border-zinc-800/40 hover:border-zinc-700/60 shadow-lg transition-all duration-500 ease-in-out shrink-0
                  ${isExpanded 
                    ? 'w-[62vw] sm:w-[50vw] md:w-auto md:grow-[8] md:basis-0' 
                    : 'w-[13vw] sm:w-[10vw] md:w-auto md:grow-[1] md:basis-0'
                  }`}
                style={{
                  height: "clamp(20rem, 50vh, 32rem)",
                }}
                onMouseEnter={() => setExpandedIndex(idx)}
                onClick={() => {
                  if (isExpanded) {
                    project.onSelect();
                  } else {
                    setExpandedIndex(idx);
                  }
                }}
              >
                {/* Image */}
                <img
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-in-out"
                  style={{
                    transform: isExpanded ? "scale(1.02)" : "scale(1)",
                  }}
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                />

                {/* Dark Gradient Overlay for active text */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent transition-opacity duration-500 pointer-events-none"
                  style={{
                    opacity: isExpanded ? 0.9 : 0.2,
                  }}
                />

                {/* Text Overlay (Visible only when expanded) */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex flex-col justify-end transition-all duration-500 ease-in-out"
                  style={{
                    opacity: isExpanded ? 1 : 0,
                    transform: isExpanded ? "translateY(0)" : "translateY(10px)",
                    pointerEvents: isExpanded ? "auto" : "none",
                  }}
                >
                  <span className="text-[8px] md:text-[9px] font-mono tracking-widest text-cyan-400 font-extrabold uppercase mb-1">
                    {project.role}
                  </span>
                  <h5 className="text-xs md:text-lg font-black text-white leading-tight mb-2 tracking-tight">
                    {project.title}
                  </h5>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      project.onSelect();
                    }}
                    className="flex items-center gap-1.5 text-[8px] md:text-[9px] font-extrabold tracking-widest text-white bg-cyan-600/80 hover:bg-cyan-600 border border-cyan-500/20 px-3 py-1.5 rounded-full w-fit transition-all shadow-sm"
                  >
                    VIEW DETAILS <ArrowUpRight size={10} />
                  </button>
                </div>

                {/* Vertical Mini Title (Visible only when collapsed) */}
                <div
                  className="absolute inset-0 flex items-center justify-center p-2 transition-opacity duration-300 pointer-events-none"
                  style={{
                    opacity: isExpanded ? 0 : 0.7,
                  }}
                >
                  <span
                    className="text-[9px] font-extrabold tracking-widest text-zinc-400 uppercase whitespace-nowrap font-mono"
                    style={{
                      writingMode: "vertical-lr",
                      transform: "rotate(180deg)",
                    }}
                  >
                    {project.title.length > 20 ? `${project.title.substring(0, 18)}...` : project.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExpandOnHover;
