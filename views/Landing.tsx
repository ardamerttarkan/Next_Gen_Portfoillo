import React, { useState } from "react";
import { User, Briefcase, Lock } from "lucide-react";

interface LandingProps {
  onSelect: (mode: "personal" | "professional") => void;
  onAdmin: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onSelect, onAdmin }) => {
  const [hovered, setHovered] = useState<"left" | "right" | null>(null);

  return (
    <div className="relative h-screen w-screen overflow-hidden flex flex-col md:flex-row font-display bg-white dark:bg-slate-900">
      {/* Admin Button (Hidden/Subtle) */}
      <button
        onClick={onAdmin}
        className="absolute bottom-4 left-4 z-50 opacity-20 hover:opacity-100 text-gray-500 hover:text-prof-blue transition-all"
      >
        <Lock className="w-4 h-4" />
      </button>

      {/* Personal Side (Left) */}
      <div
        className={`
          relative flex-1 h-1/2 md:h-full transition-all duration-700 ease-in-out cursor-pointer group
          flex flex-col items-center justify-center
          bg-white dark:bg-[#121212] text-gray-900 dark:text-white border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800
          ${hovered === "left" ? "md:flex-[1.5]" : hovered === "right" ? "md:flex-[0.5]" : "md:flex-1"}
        `}
        onMouseEnter={() => setHovered("left")}
        onMouseLeave={() => setHovered(null)}
        onClick={() => onSelect("personal")}
      >
        {/* Background Image/Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://picsum.photos/id/56/1000/1000')] bg-cover bg-center filter grayscale group-hover:grayscale-0 transition duration-700"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-100/50 to-pink-100/50 dark:from-purple-900/20 dark:to-pink-900/20 group-hover:opacity-100 transition duration-700"></div>

        <div className="relative z-10 text-center p-6 transform group-hover:scale-105 transition duration-500">
          <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-2 tracking-tighter text-gray-900 dark:text-white">
            Kİşisel
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-xs mx-auto text-sm opacity-80 group-hover:opacity-100 transition-opacity">
            Müzik, Filmler, Hobiler & Hayat. <br /> Koddaki kaosun arkasında.
          </p>
          <div className="mt-8 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
            <span className="inline-block border border-gray-300 dark:border-white/30 px-6 py-2 rounded-full text-sm font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
              Enter World
            </span>
          </div>
        </div>
      </div>

      {/* Professional Side (Right) */}
      <div
        className={`
          relative flex-1 h-1/2 md:h-full transition-all duration-700 ease-in-out cursor-pointer group
          flex flex-col items-center justify-center
          bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100
          ${hovered === "right" ? "md:flex-[1.5]" : hovered === "left" ? "md:flex-[0.5]" : "md:flex-1"}
        `}
        onMouseEnter={() => setHovered("right")}
        onMouseLeave={() => setHovered(null)}
        onClick={() => onSelect("professional")}
      >
        {/* Background Pattern - Technical/Code */}
        <div className="absolute inset-0 opacity-10 dark:opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 opacity-5 dark:opacity-10 font-mono text-xs overflow-hidden leading-tight text-prof-blue pointer-events-none select-none">
          {Array(50)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="whitespace-nowrap">
                const init = () ={">"} {"{"} console.log("System Ready"); {"}"};
                if (admin) return true;
              </div>
            ))}
        </div>

        <div className="relative z-10 text-center p-6 transform group-hover:scale-105 transition duration-500">
          <div className="w-20 h-20 mx-auto bg-slate-900 dark:bg-prof-blue rounded-full flex items-center justify-center mb-6 shadow-xl">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-2 tracking-tighter">
            Profesyonel
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xs mx-auto text-sm opacity-80 group-hover:opacity-100 transition-opacity">
            Portföy, Yetenekler, CV & Teknoloji Blogu. <br /> Profesyonel Hayat
            ile Alakalı.
          </p>
          <div className="mt-8 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
            <span className="inline-block bg-slate-900 dark:bg-prof-blue text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-prof-blue dark:hover:bg-white dark:hover:text-prof-blue transition-colors shadow-lg">
              View Portfolio
            </span>
          </div>
        </div>
      </div>

      {/* Center Divider Visual (Desktop) */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 dark:bg-white/20 z-20 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
        <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-sm shadow-xl text-black dark:text-white border border-gray-100 dark:border-gray-700">
          OR
        </div>
      </div>
    </div>
  );
};
