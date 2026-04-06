import React from 'react';

const TechStackThread = () => {
  const techs = [
    "Vite", "React", "Node.js", "Express", "MongoDB", "Tailwind CSS", 
    "Framer Motion", "Axios", "JWT", "Passport.js", "Google OAuth", 
    "Cloudinary", "Lucide React", "Mongoose", "KaTeX", "Three.js", 
    "Shadcn UI", "PostCSS", "Remark", "Rehype", "Zod", "Joi", 
    "Helmet", "Bcrypt", "Nodemailer", "Multer", "ESLint", "Git"
  ];

  return (
    <div className="relative py-16  border-1 border-white/20 rounded-2xl overflow-hidden group">
      <div className="text-center mb-10">
         <h3 className="text-xl text-white tracking-widest uppercase font-mono italic inline-block relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-white/10 after:scale-x-0 group-hover:after:scale-x-100 transition-all duration-500">
           Engineered With
         </h3>
      </div>

      <div className="mx-auto px-6">
        <div className="flex overflow-hidden relative bo border-1 border-white/20  bg-black/40  py-6 ">
           <div className="animate-tech-scroll flex gap-5 py-4 items-center whitespace-nowrap">
             {techs.concat(techs).map((tech, index) => (
               <div 
                 key={index} 
                 className="flex items-center gap-3 text-3xl md:text-5xl font-black text-white hover:opacity-100 opacity-60 transition-all duration-500 cursor-default font-mono italic uppercase tracking-tighter"
               >
                 <span className="drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{tech}</span>
                 <span className="text-white mx-10 text-2xl">•</span>
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
