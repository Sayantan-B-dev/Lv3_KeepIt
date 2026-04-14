import React from 'react';
import { User, FolderOpen, PenTool, Rocket } from 'lucide-react';

const ProcessGuide = () => {
  const steps = [
    {
      title: "Create Your Account",
      description: "Join the community of note-takers. Simple registration process with instant access to all core features.",
      icon: <User className="w-8 h-8 text-white/60" />,
      color: "bg-white/5",
      accent: "white",
    },
    {
      title: "Organize with Categories",
      description: "Categorize your thoughts. Create private or public categories to keep your workspace organized and efficient.",
      icon: <FolderOpen className="w-8 h-8 text-white/60" />,
      color: "bg-white/5",
      accent: "white",
    },
    {
      title: "Craft Your Notes",
      description: "Use our beautiful editor to write, tag, and export notes. Rich text support with a clean, distraction-free interface.",
      icon: <PenTool className="w-8 h-8 text-white/60" />,
      color: "bg-white/5",
      accent: "white",
    },
    {
      title: "Follow & Share",
      description: "Follow your favorite creators, stay updated with their latest public notes, and collaborate on shared categories.",
      icon: <Rocket className="w-8 h-8 text-white/60" />,
      color: "bg-white/5",
      accent: "white",
    }
  ];

  return (
    <div className="py-24 border-1 border-white/20 rounded-2xl my-5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase font-mono italic">
            How It Works
          </h2>
          <p className="text-type-3 font-mono max-w-2xl mx-auto text-sm">
            Experience the seamless flow of capturing, organizing, and sharing your ideas with <span className="text-white bg-white/10 px-2 rounded italic font-bold">re-Docs</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
           {/* Connecting Line (Desktop) */}
           <div className="hidden lg:block absolute top-[25%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10"></div>
           
           {steps.map((step, index) => (
             <div 
               key={index} 
               className="group relative flex flex-col items-center text-center p-8 rounded-[3rem] border border-white/20 bg-black/10 backdrop-blur-sm transition-all duration-500 hover:border-white/40 hover:bg-black/20 hover:-translate-y-2 shadow-2xl"
             >
               <div className={`
                 w-16 h-16 rounded-full ${step.color} mb-6 flex items-center justify-center
                 border border-white/20 group-hover:border-white/40 transition-all duration-300 shadow-xl
               `}>
                 {step.icon}
               </div>

               <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-black border border-white/20 text-[10px] font-mono text-type-3 uppercase tracking-widest group-hover:border-white/60 group-hover:text-white transition-colors duration-500">
                 Step 0{index + 1}
               </span>

               <h3 className="text-xl font-bold text-white mb-4 font-mono group-hover:text-white transition-colors duration-300">
                 {step.title}
               </h3>
               <p className="text-sm text-type-3 font-mono leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                 {step.description}
               </p>

               <div className={`mt-6 w-8 h-1 rounded-full bg-white opacity-20 group-hover:opacity-50 transition-all duration-500`}></div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessGuide;
