import React from 'react';

const Marquee = ({ items, isLoading, isOffline }) => {
  const demoNotes = [
    { title: "Quantum Physics Notes", content: "Understanding entanglement and superposition in multi-dimensional spaces.", category: "Science", author: "Dr. Smith" },
    { title: "Perfect Pasta Sauce", content: "Slow-cooked tomatoes with fresh basil and a hint of red wine.", category: "Cooking", author: "Chef Mario" },
    { title: "React Best Practices", content: "Use composition, keep state local, and optimize with useMemo.", category: "Tech", author: "DevGuru" },
    { title: "Morning Routine", content: "Meditation, 20 mins of reading, and high-protein breakfast.", category: "Lifestyle", author: "LifeCoach" },
    { title: "Project Alpha Plan", content: "Milestones for Q3 including the new API integration and UI overhaul.", category: "Work", author: "ManagerX" },
    { title: "Book Recommendations", content: "The Overstory, Dune, and Thinking Fast and Slow.", category: "Reading", author: "Bibliophile" },
  ];

  const displayItems = isOffline || isLoading ? Array(10).fill({}) : (items && items.length > 0 ? items : demoNotes);

  return (
    <div className="relative flex overflow-x-hidden py-10 bg-black/20 border-y border-white/5 my-12 group">
      <div className="animate-marquee flex whitespace-nowrap gap-6 py-4">
        {displayItems.concat(displayItems).map((note, idx) => (
          <div
            key={idx}
            className={`
              inline-block w-72 p-6 rounded-2xl border transition-all duration-500
              ${isLoading || isOffline 
                ? 'bg-white/5 border-white/10 animate-pulse' 
                : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10 hover:-translate-y-1'
              }
            `}
          >
            {isLoading || isOffline ? (
              <div className="space-y-3">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-3 bg-white/10 rounded w-full"></div>
                <div className="h-3 bg-white/10 rounded w-5/6"></div>
                <div className="flex justify-between pt-4 border-t border-white/5">
                  <div className="h-3 bg-white/10 rounded w-1/4"></div>
                  <div className="h-3 bg-white/10 rounded w-1/4"></div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-[10px] text-red-200 font-mono border border-red-500/30 uppercase tracking-widest">
                    {note.category || 'Note'}
                  </span>
                  {isOffline && (
                    <span className="text-[10px] text-type-3 font-mono opacity-50 uppercase tracking-tighter italic">
                      DEMO
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{note.title || 'Untitled Note'}</h3>
                <p className="text-sm text-type-3 line-clamp-2 mb-4 leading-relaxed italic opacity-80">
                  "{note.content || 'No content provided.'}"
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-white/5 text-[10px] font-mono text-type-3">
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></span>
                    {note.author || 'Anonymous'}
                  </span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      
      {/* Reverse Marquee for depth */}
      <div className="absolute top-0 animate-marquee-reverse flex whitespace-nowrap gap-6 py-4 opacity-30 pointer-events-none -z-10 blur-[1px]">
         {displayItems.concat(displayItems).map((note, idx) => (
          <div key={`rev-${idx}`} className="inline-block w-72 p-6 rounded-2xl border border-white/10 bg-white/5">
             <div className="h-4 bg-white/10 rounded w-3/4 mb-4"></div>
             <div className="h-3 bg-white/10 rounded w-full mb-2"></div>
             <div className="h-3 bg-white/10 rounded w-5/6"></div>
          </div>
         ))}
      </div>
    </div>
  );
};

export default Marquee;
