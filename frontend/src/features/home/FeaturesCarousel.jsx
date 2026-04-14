import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Users, Lock, Crown } from 'lucide-react';

const FeaturesCarousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const carouselRef = useRef(null);
    const containerRef = useRef(null);

    const features = [
        {
            title: "Follow Creators",
            content: "Stay updated with your favorite note-takers. Get notifications and see their latest public notes right on your home feed.",
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800&h=450",
            icon: <Users className="w-6 h-6 text-white/70" />,
            list: ["Unlimited Follows", "Real-time updates", "Feed Discovery"]
        },
        {
            title: "Private Categories",
            content: "Keep your sensitive thoughts secure. Use private categories to strictly manage who sees what. Encryption at rest for peace of mind.",
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800&h=450",
            icon: <Lock className="w-6 h-6 text-white/70" />,
            list: ["Password Protection", "Hidden from Global", "Encrypted Content"]
        },
        {
            title: "Pro Account Perks",
            content: "Upgrade your productivity with Pro features. More storage, priority support, and advanced analytics for your notes.",
            image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=800&h=450",
            icon: <Crown className="w-6 h-6 text-white/70" />,
            list: ["Higher Character Limit", "Advanced Exporting", "Priority Server Wakeup", "No Ads (Coming soon)"]
        }
    ];

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % features.length);
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + features.length) % features.length);
    };

    useEffect(() => {
        if (isHovering) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % features.length);
        }, 1000);

        return () => clearInterval(interval);
    }, [isHovering]);

    return (
        <div ref={containerRef} className="py-24 my-5 border-y border-white/5 relative overflow-hidden border-1 border-white/20 rounded-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none opacity-20 bg-white/5 blur-[100px]"></div>
            
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 uppercase italic font-mono tracking-tighter">
                        Why Choose Re-Docs?
                    </h2>
                    <div className="flex justify-center gap-4">
                        {features.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeIndex ? 'bg-white w-8' : 'bg-white/10 hover:bg-white/30'}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="relative h-[500px] md:h-[400px] lg:h-[350px] transition-all duration-500 flex items-center group/carousel">
                    {/* Navigation Arrows */}
                    <button 
                        onClick={prevSlide}
                        className="absolute -left-4 lg:-left-12 z-30 p-4 rounded-full border border-white/20 bg-black/60 hover:bg-white/10 hover:border-white/40 transition-all text-white/50 hover:text-white opacity-0 group-hover/carousel:opacity-100 backdrop-blur-xl translate-x-4 group-hover/carousel:translate-x-0"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button 
                        onClick={nextSlide}
                        className="absolute -right-4 lg:-right-12 z-30 p-4 rounded-full border border-white/20 bg-black/60 hover:bg-white/10 hover:border-white/40 transition-all text-white/50 hover:text-white opacity-0 group-hover/carousel:opacity-100 backdrop-blur-xl -translate-x-4 group-hover/carousel:translate-x-0"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`
                                absolute top-0 left-0 w-full h-full flex flex-col lg:flex-row items-center gap-10 transition-all duration-1000 ease-in-out
                                ${index === activeIndex ? 'opacity-100 translate-x-0 scale-100 z-10' : 'opacity-0 translate-x-10 scale-95 pointer-events-none' }
                            `}
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            <div className="w-full lg:w-1/2 group relative overflow-hidden rounded-2xl border border-white/20">
                                <img 
                                    src={feature.image} 
                                    alt={feature.title} 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#10110f] via-transparent to-transparent opacity-60"></div>
                                <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md p-2 rounded-xl border border-white/10 shadow-2xl">
                                    {feature.icon}
                                </div>
                            </div>

                            <div className="w-full lg:w-1/2 space-y-6">
                                <h3 className="text-3xl font-black text-white italic uppercase font-mono tracking-tight flex items-center gap-3">
                                   <span className="text-white/40">_</span> {feature.title}
                                </h3>
                                <p className="text-lg text-type-3 font-mono leading-relaxed opacity-80 italic">
                                    "{feature.content}"
                                </p>
                                <ul className="grid grid-cols-2 gap-3">
                                    {feature.list.map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-[10px] font-bold font-mono text-white/50 uppercase tracking-widest border border-white/20 bg-black/40 p-3 rounded-full hover:bg-white/10 hover:text-white transition-colors duration-300">
                                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturesCarousel;
