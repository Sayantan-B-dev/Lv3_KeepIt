import { useState, useEffect } from 'react';
import axiosInstance from "@/api/axiosInstance";
import {
  Hero,
  Marquee,
  ProcessGuide,
  TechStackThread,
  FeaturesCarousel,
  ProComparison,
} from "@/features/home";
import { useAuth } from "@/context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [isBackendOffline, setIsBackendOffline] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setNotesLoading(true);
      setIsBackendOffline(false);

      // Fetch Public Notes
      try {
        const noteResponse = await axiosInstance.get('/api/notes/public/random');
        const noteData = noteResponse.data;
        const extractedNotes = Array.isArray(noteData) ? noteData : (noteData.notes || []);
        setNotes(extractedNotes);
      } catch (err) {
        console.error('Error fetching notes:', err);
        setIsBackendOffline(true);
      } finally {
        setNotesLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full overflow-x-hidden selection:bg-white/30">
      <Hero user={user} isAuthenticated={isAuthenticated} isOffline={isBackendOffline} />

      {/* Live Notes Marquee */}
      <div className="pt-5 border-1 border-white/20 rounded-2xl ">
        <h2 className="text-sm font-mono text-type-3 uppercase tracking-[0.3em] font-bold text-center">
          {isBackendOffline ? 'Feed Offline' : 'Live Notes Feed'}
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
      
      {/* Pro vs Free Comparison */}
      <ProComparison />

      {/* Tech Stack Thread */}
      <TechStackThread />

      {/* Placeholder at bottom for spacing */}
      <div className="h-20" />
    </div>
  );
};

export default Home;
