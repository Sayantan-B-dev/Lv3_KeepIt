import React from 'react';

const Marquee = ({ items, isLoading, isOffline }) => {

  const displayItems = (isLoading || isOffline) 
    ? Array(10).fill({}) 
    : (items && items.length > 0 ? items : []);

  return (
    <div className="relative flex overflow-x-hidden  my-5 group">
      <div className="animate-marquee flex whitespace-nowrap gap-6 py-4">
        {displayItems.concat(displayItems).map((note, idx) => (
          <div
            key={idx}
            className={`
              inline-block w-72 p-6 rounded-2xl border transition-all duration-500
              ${isLoading || isOffline 
                ? 'bg-black/40 border-white/10 animate-pulse' 
                : 'bg-black/40 border-white/20 hover:border-white/40 hover:bg-black/60 hover:-translate-y-1 shadow-2xl'
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
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-white/70 font-mono border border-white/20 uppercase">
                    {typeof note.category === 'object' ? note.category?.name : (note.category || note.theme || 'Note')}
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
                    <span className="w-1 h-1 rounded-full bg-white/40"></span>
                    {typeof note.user === 'object' ? note.user?.username : (note.user || 'Anonymous')}
                  </span>
                  <span>{note.createdAt ? new Date(note.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</span>
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
