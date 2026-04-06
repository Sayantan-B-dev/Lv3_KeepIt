import React from "react";
import { DottedButton } from "@/components/ui/buttons";
import { useNavigate } from "react-router-dom";

const boxes = [
  {
    title: "Craft Notes",
    description: "Write and store your thoughts with rich text and custom exports.",
    icon: "🖋️",
    glow: "group-hover:shadow-white/10"
  },
  {
    title: "Stay Organized",
    description: "Group notes by tags and multi-level categories with ease.",
    icon: "📂",
    glow: "group-hover:shadow-white/10"
  },
  {
    title: "Community Feed",
    description: "Follow creators and discover shared knowledge globally.",
    icon: "🌐",
    glow: "group-hover:shadow-white/10"
  }
];

const Hero = ({ user, isAuthenticated }) => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[700px] md:min-h-[900px] flex items-center overflow-hidden border-b border-white/5 bg-[#10110f]">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full animate-bounce-slow"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Text & Actions */}
          <div className="space-y-10 text-center lg:text-left">
            <div className="inline-block px-4 py-1 rounded-full border border-white/20 bg-white/5 text-white/70 text-[10px] font-mono font-black uppercase tracking-[0.3em] animate-pulse">
              Version 3.0 • Now Live
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase italic font-mono">
                Capture <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">Everything.</span>
              </h1>

              <p className="text-lg md:text-xl text-type-3 font-mono leading-relaxed max-w-xl mx-auto lg:mx-0 opacity-80">
                <span className="text-white font-bold italic tracking-tighter">re-Docs</span> is the ultimate workspace for your second brain. From quick thoughts to complex research, organize your life in one powerful, minimalist interface.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <DottedButton
                text="Get Started Free"
                className="!px-10 !py-4 scale-110"
                onClick={() => navigate(isAuthenticated ? "/CreateNote" : "/register")}
              />
              <button 
                onClick={() => navigate("/about")}
                className="group flex items-center gap-3 text-sm font-mono font-bold text-white/50 hover:text-white transition-all underline-animation"
              >
                Explore Features 
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            <div className="flex items-center gap-4 justify-center lg:justify-start text-xs font-mono text-type-3">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-type-2 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                  </div>
                ))}
              </div>
              <span>Trusted by <span className="text-white font-black">500+</span> note takers</span>
            </div>
          </div>

          {/* Right Side: Visual Boxes */}
          <div className="relative group">
            <div className="absolute inset-0 bg-white/5 blur-[100px] rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
               {boxes.map((box, index) => (
                 <div
                   key={index}
                   className={`
                     group/card relative p-8 rounded-2xl border border-white/20 bg-black/40 backdrop-blur-3xl
                     transition-all duration-500 hover:-translate-y-3 hover:bg-black/60 hover:border-white/40
                     ${index === 2 ? 'md:col-span-2' : ''}
                     flex flex-col items-center text-center
                     shadow-2xl ${box.glow}
                   `}
                 >
                   <div className="text-5xl mb-6 bg-black/40 w-20 h-20 flex items-center justify-center rounded-3xl border border-white/5 transition-transform duration-500 group-hover/card:scale-110 group-hover/card:rotate-6">
                     {box.icon}
                   </div>
                   <h3 className="text-xl font-black text-white italic uppercase font-mono tracking-tighter mb-2 italic">
                     {box.title}
                   </h3>
                   <p className="text-sm text-type-3 font-mono opacity-70 group-hover/card:opacity-100 transition-opacity">
                     {box.description}
                   </p>
                 </div>
               ))}
               
               {/* Decorative Element */}
               <div className="absolute -z-10 -bottom-10 -right-10 text-[10rem] font-black text-white/[0.02] font-mono pointer-events-none select-none uppercase italic">
                  re-Docs
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
