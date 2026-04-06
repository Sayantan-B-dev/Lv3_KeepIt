import { useState, useEffect } from 'react';
import axiosInstance from "@/api/axiosInstance";
import {
  UserBox,
  Hero,
  ColdStartBanner,
  AppStats,
  Marquee,
  ProcessGuide,
  TechStackThread,
  FeaturesCarousel
} from "@/features/home";
import { UserBoxSkeleton } from "@/features/home/Loading";
import { useAuth } from "@/context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showColdStartMessage, setShowColdStartMessage] = useState(false);
  const [isBackendOffline, setIsBackendOffline] = useState(false);

  useEffect(() => {
    // Show cold start message if backend doesn't respond in 2.5 seconds
    const timer = setTimeout(() => {
      if (loading) setShowColdStartMessage(true);
    }, 2500);

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setIsBackendOffline(false);
        const response = await axiosInstance.get('/api/profile/users', {
          params: { page: 1, limit: 24 }
        });
        const data = response.data;
        setUsers(Array.isArray(data) ? data : (data.notes || data.users || []));
      } catch (err) {
        console.error('Error details:', err.response || err);
        setError('Failed to connect to backend');
        setIsBackendOffline(true);
      } finally {
        setLoading(false);
        setShowColdStartMessage(false);
        clearTimeout(timer);
      }
    };

    fetchUsers();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full overflow-x-hidden selection:bg-red-500/30">
      {/* Hero Section */}
      <Hero user={user} isAuthenticated={isAuthenticated} />

      {/* Stats Section */}
      <div className="container mx-auto px-4">
        <AppStats />
      </div>

      {/* Demo Notes Marquee */}
      <div className="mt-20">
         <div className="container mx-auto px-4 mb-4">
            <h2 className="text-sm font-mono text-type-3 uppercase tracking-[0.3em] font-bold text-center">
              Live Feed {isBackendOffline ? '(Demo Archive)' : '(From Community)'}
            </h2>
         </div>
         <Marquee isLoading={loading} isOffline={isBackendOffline} />
      </div>

      {/* Step by Step Guide */}
      <ProcessGuide />

      {/* Features Carousel (Follow, Private, Pro/Free) */}
      <FeaturesCarousel />

      {/* Tech Stack Thread */}
      <TechStackThread />

      {/* Discover Users (Only show if backend is potentially up or after initial load) */}
      <div className="container mx-auto px-4 py-24">
        {showColdStartMessage && <ColdStartBanner />}

        <div className="mb-8 flex flex-col items-center">
          <h2 className="text-3xl font-black text-white font-mono tracking-tighter uppercase italic mb-2">
            The Community
          </h2>
          <div className="h-1 w-20 bg-red-500/50 rounded-full"></div>
          {loading && (
            <span className="mt-4 text-[10px] text-type-3 font-mono animate-pulse uppercase tracking-widest font-bold">
              Connecting to database...
            </span>
          )}
        </div>

        <div className="
          w-full p-8
          rounded-[2rem]
          border border-white/5
          bg-white/[0.02] backdrop-blur-3xl
          shadow-2xl relative overflow-hidden
        ">
          {/* Decorative background element */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500/5 blur-[100px] rounded-full pointer-events-none"></div>
          
          {loading ? (
            <UserBoxSkeleton count={12} />
          ) : isBackendOffline ? (
            <div className="text-red-400 py-16 text-center font-mono border border-red-500/10 rounded-2xl bg-red-500/[0.02]">
              <div className="text-5xl mb-6">📡</div>
              <p className="font-black text-xl mb-2 uppercase italic tracking-tighter">Backend is currently offline</p>
              <p className="text-xs text-type-3 font-mono max-w-md mx-auto leading-relaxed">
                We're currently using a demo state. The server might be waking up from its nap (common on free-tier hosting). 
                Once it's up, you'll see live user profiles here.
              </p>

              <button
                onClick={() => window.location.reload()}
                className="mt-8 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Attempt Reconnect
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-6">
              <UserBox users={users} />
            </div>
          )}
        </div>
      </div>

      <footer className="py-20 border-t border-white/5 bg-[#0a0b09]">
         <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl font-black text-white/5 font-mono uppercase italic select-none">KEEP IT. SHARE IT.</h2>
            <div className="mt-10 flex justify-center gap-8 text-[10px] font-mono text-type-3 uppercase tracking-widest">
               <a href="#" className="hover:text-red-300 transition-colors">Privacy</a>
               <a href="#" className="hover:text-red-300 transition-colors">Terms</a>
               <a href="#" className="hover:text-red-300 transition-colors">GitHub</a>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default Home;
