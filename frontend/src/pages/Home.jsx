import { useState, useEffect } from 'react';
import axiosInstance from "@/api/axiosInstance";
import {
  UserBox,
  Hero,
  ColdStartBanner,
  AppStats
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

  useEffect(() => {
    // Show cold start message if backend doesn't respond in 2.5 seconds
    const timer = setTimeout(() => {
      if (loading) setShowColdStartMessage(true);
    }, 2500);

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/profile/users', {
          params: { page: 1, limit: 24 }
        });
        const data = response.data;
        setUsers(Array.isArray(data) ? data : (data.notes || data.users || []));
      } catch (err) {
        console.error('Error details:', err.response || err);
        setError('Failed to load users');
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
    <div className="container mx-auto max-w-full">
      <Hero user={user} isAuthenticated={isAuthenticated} />

      <div className="px-4">
        <AppStats />

        {showColdStartMessage && <ColdStartBanner />}

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-type-1 font-mono tracking-tight flex items-center gap-2">
            Discover Users
          </h2>
          {loading && (
            <span className="text-[10px] text-type-3 font-mono animate-pulse uppercase tracking-widest font-bold">
              Fetching profiles...
            </span>
          )}
        </div>

        <div className="
          w-full mb-8 p-6
          rounded-2xl
          border border-muted
          bg-white/5 backdrop-blur-md
          shadow-xl
        ">
          {loading ? (
            <UserBoxSkeleton count={8} />
          ) : error ? (
            <div className="text-red-400 py-10 text-center font-mono border border-red-500/20 rounded-xl bg-red-500/5">
              <p className="font-bold">Oops! {error}</p>
              <p className="text-xs text-type-3 font-mono">
                This may be due to network issues or the free-tier server on Render being temporarily offline or asleep.
                Please wait a moment for it to wake up and try again.
              </p>


              <button
                onClick={() => window.location.reload()}
                className="mt-4 text-xs underline hover:text-white"
              >
                Try refreshing
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center sm:justify-start gap-4">
              <UserBox users={users} />
            </div>
          )}
        </div>
      </div>

      <hr className="border-t border-muted opacity-20" />
    </div>
  );
};

export default Home;
