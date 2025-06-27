import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import DottedButton from '../components/buttons/DottedButton';
import Author from '../components/Author';
import Magnet from '../components/advance/Magnet';

const AllNotes = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get('/api/global/all-notes');
        setNotes(res.data || []);
      } catch (err) {
        setError('Failed to load notes.');
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  return (
    <Magnet padding={50} disabled={false} magnetStrength={100} className="w-full">
      <div
        className="container mx-auto p-6 max-w-3xl shadow-2xl border-1 border-dashed border-black mt-10 mb-22 relative"
        style={{
          backdropFilter: 'blur(2px)',
          backdropShadow: '20px',
          background: 'rgba(255, 255, 255, 0.01)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.10)',
          borderRadius: '60px',
        }}
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-black mb-8">All Notes</h2>
        {loading && <div>Loading notes...</div>}
        {error && <div style={{ color: '#e63946' }}>{error}</div>}
        {!loading && !error && (
          <ul style={{ listStyle: 'none', padding: 0 }} className="flex flex-col gap-2">
            {notes.length === 0 ? (
              <li>No notes found.</li>
            ) : (
              notes.map((note) => (
                <div key={note._id || note.title} className="flex items-center gap-2 w-full">
                  <DottedButton
                    key={note._id || note.title}
                    text={note.title}
                    className="w-full"
                    onClick={() => navigate(`/notes/${note._id}`)}
                  />
                  <div className="w-12 h-12">
                    <Author user={note.user} handleUserClick={handleUserClick} />
                  </div>
                </div>
              ))
            )}
          </ul>
        )}
      </div>
    </Magnet>
  );
};

export default AllNotes;