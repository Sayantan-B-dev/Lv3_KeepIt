import React from 'react';

const TechStackThread = () => {
  const techs = [
    { name: "React", icon: "⚛️", color: "text-blue-400" },
    { name: "Node.js", icon: "🟢", color: "text-green-500" },
    { name: "Express", icon: "🛡️", color: "text-gray-300" },
    { name: "MongoDB", icon: "🍃", color: "text-green-600" },
    { name: "Tailwind CSS", icon: "🎨", color: "text-cyan-400" },
    { name: "Vite", icon: "⚡", color: "text-yellow-400" },
    { name: "JWT", icon: "🔑", color: "text-pink-500" },
    { name: "Axios", icon: "🔗", color: "text-blue-500" },
    { name: "Render", icon: "☁️", color: "text-indigo-400" },
    { name: "Mongoose", icon: "🦢", color: "text-red-500" },
    { name: "ESLint", icon: "✅", color: "text-purple-400" }
  ];

  return (
    <div className="relative py-16 bg-black overflow-hidden group">
      <div className="text-center mb-10">
         <h3 className="text-xl font-black text-white/40 tracking-widest uppercase font-mono italic inline-block relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-white/10 after:scale-x-0 group-hover:after:scale-x-100 transition-all duration-500">
           Engineered With
         </h3>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex overflow-hidden relative border border-white/20 bg-black/40 backdrop-blur-sm rounded-full py-6 px-10">
           <div className="animate-tech-scroll flex gap-20 py-4 items-center whitespace-nowrap">
             {techs.concat(techs).map((tech, index) => (
               <div 
                 key={index} 
                 className={`
                   flex items-center gap-3 text-3xl md:text-5xl font-black opacity-20 group-hover:opacity-40 transition-all duration-500
                   text-white hover:opacity-100 cursor-default font-mono italic uppercase tracking-tighter
                 `}
               >
               <span className="text-5xl">{tech.icon}</span>
               <span className="drop-shadow-lg">{tech.name}</span>
               <span className="text-white/10 mx-10 text-2xl">•</span>
             </div>
           ))}
           </div>
        </div>
      </div>
      
      {/* Decorative Blur and Noise */}
      <div className="absolute top-0 left-0 w-40 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
    </div>
  );
};

export default TechStackThread;
