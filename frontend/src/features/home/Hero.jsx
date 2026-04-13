import React, { useState, useEffect } from "react";
import { DottedButton } from "@/components/ui/buttons";
import { useNavigate } from "react-router-dom";
import { Sparkles, Folders, Globe } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import CipherNumber from "./CipherNumber";

const boxes = [
  {
    title: "Craft Notes",
    description: "Write and store your thoughts with rich text and custom exports.",
    icon: <Sparkles className="w-8 h-8 text-white/60" />,
  },
  {
    title: "Stay Organized",
    description: "Group notes by tags and multi-level categories with ease.",
    icon: <Folders className="w-8 h-8 text-white/60" />,
  },
  {
    title: "Discover Notes",
    description: "Discover shared knowledge globally with Live Notes Feed.",
    icon: <Globe className="w-8 h-8 text-white/60" />,
  }
];

const Hero = ({ user, isAuthenticated, isOffline }) => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    totalNotes: 0,
    totalTags: 0,
    totalCategories: 0,
    totalUsers: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get('/api/global/initial-data');
        setMetrics(res.data);
      } catch (err) {}
    };
    fetchStats();
  }, []);

  return (
      <div className="w-full relative z-10 border-1 rounded-2xl p-6 md:p-10 mb-5 border-white/20 overflow-hidden bg-black/20">


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          
          {/* Left Side: Text & Actions */}
          <div className="space-y-8 md:space-y-10 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <div className="inline-block px-4 py-1 rounded-full border border-white/20 bg-white/5 text-white/70 text-[10px] font-mono font-black uppercase tracking-[0.3em] animate-pulse">
                Version 3.0 • Now Live
              </div>
              <div className={`px-4 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-mono font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(52,211,153,0.1)]`}>
                <CipherNumber value={metrics.totalNotes} isOffline={isOffline} /> Notes Online
              </div>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase italic font-mono">
                Capture <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">Everything.</span>
              </h1>

              <p className="text-base md:text-xl text-type-3 font-mono leading-relaxed max-w-xl mx-auto lg:mx-0 opacity-80">
                <span className="text-white font-bold italic tracking-tighter">Re-Docs</span> is the ultimate workspace for your second brain. Transform scattered info into meaningful knowledge.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center lg:justify-start pt-4">
              <DottedButton
                text="Get Started Free"
                className="!px-10 !py-4 scale-100 md:scale-110"
                onClick={() => navigate(isAuthenticated ? "/CreateNote" : "/register")}
              />
              <button 
                onClick={() => navigate("/about")}
                className="group flex items-center justify-center gap-3 text-sm font-mono font-bold text-white/50 hover:text-white transition-all underline-animation"
              >
                Explore Features 
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            {/* Metrics Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-[10px] md:text-xs font-mono text-type-3 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-white font-black"><CipherNumber value={metrics.totalNotes} isOffline={isOffline} />+</span>
                <span className="uppercase tracking-widest opacity-50">Notes</span>
              </div>
              <div className="hidden sm:block text-white/20">|</div>
              <div className="flex items-center gap-2">
                <span className="text-white font-black"><CipherNumber value={metrics.totalTags} isOffline={isOffline} />+</span>
                <span className="uppercase tracking-widest opacity-50">Tags</span>
              </div>
              <div className="hidden sm:block text-white/20">|</div>
              <div className="flex items-center gap-2">
                <span className="text-white font-black"><CipherNumber value={metrics.totalCategories} isOffline={isOffline} />+</span>
                <span className="uppercase tracking-widest opacity-50">Topics</span>
              </div>
              <div className="hidden sm:block text-white/20">|</div>
              <div className="flex items-center gap-2">
                <span>Trusted by <span className="text-white font-black"><CipherNumber value={metrics.totalUsers} isOffline={isOffline} />+</span> note takers</span>
              </div>
            </div>
          </div>

          {/* Right Side: Visual Boxes (Static) */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
               {boxes.map((box, index) => (
                 <div
                   key={index}
                   className={`
                     relative p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-3xl
                     ${index === 2 ? 'md:col-span-2' : ''}
                     flex flex-col items-center text-center
                      transition-colors
                   `}
                 >
                   <div className="mb-4 md:mb-6 w-14 h-14 md:w-20 md:h-20 flex items-center justify-center rounded-2xl md:rounded-3xl border border-white/5 bg-white/[0.02]">
                     {box.icon}
                   </div>
                   <h3 className="text-lg md:text-xl font-black text-white italic uppercase font-mono tracking-tighter mb-2">
                     {box.title}
                   </h3>
                   <p className="text-xs md:text-sm text-type-3 font-mono opacity-70">
                     {box.description}
                   </p>
                 </div>
               ))}
               
               {/* Decorative Element */}
               <div className="absolute -z-10 -bottom-10 -right-10 text-[6rem] md:text-[8rem] font-black text-white/[0.02] font-mono pointer-events-none select-none uppercase italic">
                  RE-DOCS
               </div>
            </div>
          </div>

        </div>
      </div>
  );
};

export default Hero;
