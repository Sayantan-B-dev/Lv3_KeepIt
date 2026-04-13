import React from 'react';
import { Clock } from 'lucide-react';

const PreviewCountdown = ({ timeLeft }) => {
  if (timeLeft <= 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] group font-mono">
      <div className="bg-type-b4/80 backdrop-blur-xl border border-white/20 rounded-[4px] p-3 flex flex-col items-center gap-1 shadow-[0_0_40px_rgba(0,0,0,0.8)] min-w-[120px] transition-all hover:border-white/40">
        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Preview_Auth</span>
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3 text-white/60 group-hover:text-white lg:animate-none animate-pulse transition-colors" />
          <span className="text-xl font-black text-white italic tracking-tighter">
            {timeLeft}<span className="text-[10px] ml-1 opacity-50">S</span>
          </span>
        </div>
        <div className="w-full bg-white/5 h-[2px] mt-2 overflow-hidden">
          <div 
            className="h-full bg-white/80 transition-all duration-1000 ease-linear"
            style={{ width: `${(timeLeft / 10) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewCountdown;
