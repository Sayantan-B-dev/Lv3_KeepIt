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
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notesLoading, setNotesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showColdStartMessage, setShowColdStartMessage] = useState(false);
  const [isBackendOffline, setIsBackendOffline] = useState(false);

  useEffect(() => {
    // Show cold start message if backend doesn't respond in 2.5 seconds
    const timer = setTimeout(() => {
      if (loading || notesLoading) setShowColdStartMessage(true);
    }, 2500);

    const fetchData = async () => {
      setLoading(true);
      setNotesLoading(true);
      setIsBackendOffline(false);

      // Fetch Users
      try {
        const userResponse = await axiosInstance.get('/api/profile/users', {
          params: { page: 1, limit: 24 }
        });
        const userData = userResponse.data;
        setUsers(Array.isArray(userData) ? userData : (userData.notes || userData.users || []));
      } catch (err) {
        console.error('Error fetching users:', err);
        setIsBackendOffline(true);
      } finally {
        setLoading(false);
      }

      // Fetch Public Notes
      try {
        const noteResponse = await axiosInstance.get('/api/notes/public/random');
        const noteData = noteResponse.data;
        // The API might return { notes: [...] } or just [...]
        const extractedNotes = Array.isArray(noteData) ? noteData : (noteData.notes || []);
        setNotes(extractedNotes);
      } catch (err) {
        console.error('Error fetching notes:', err);
      } finally {
        setNotesLoading(false);
        setShowColdStartMessage(false);
        clearTimeout(timer);
      }
    };

    fetchData();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full overflow-x-hidden selection:bg-white/30">
      {/* Hero Section */}
      <Hero user={user} isAuthenticated={isAuthenticated} />

      {/* Stats Section */}

      <AppStats />


      {/* Demo Notes Marquee */}
      <div className=" pt-5 border-1 border-white/20 rounded-2xl">
        <h2 className="text-sm font-mono text-type-3 uppercase tracking-[0.3em] font-bold text-center">
          {isBackendOffline ? 'Feed Offline' : 'Live Community Feed'}
        </h2>
        <Marquee
          items={notes}
          isLoading={notesLoading}
          isOffline={isBackendOffline}
        />
      </div>

      {/* Step by Step Guide */}
      <ProcessGuide />

      {/* Features Carousel (Follow, Private, Pro/Free) */}
      <FeaturesCarousel />

      {/* Tech Stack Thread */}
      <TechStackThread />

      {/* Discover Users (Only show if backend is potentially up or after initial load) */}
      <div className="w-full px-4 py-10 border-1 border-white/20 rounded-2xl my-5">
        {showColdStartMessage && <ColdStartBanner />}

        <div className="mb-8 flex flex-col items-center">
          <h2 className="text-3xl font-black text-white font-mono tracking-tighter uppercase italic mb-2">
            The Community
          </h2>
          <div className="h-1 w-20 bg-white/20 rounded-full"></div>
          {loading && (
            <span className="mt-4 text-[10px] text-type-3 font-mono animate-pulse uppercase tracking-widest font-bold">
              Connecting to database...
            </span>
          )}
        </div>

        <div className="
          w-full p-8
           border-1 border-white/20 rounded-2xl  backdrop-blur-3xl
          shadow-2xl relative overflow-hidden
        ">
          {/* Decorative background element */}
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none"></div>

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
            <div className="flex flex-wrap justify-center gap-6 ">
              <UserBox users={users} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
