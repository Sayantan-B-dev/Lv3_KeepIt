import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Loading from '../components/home/Loading';

const TagNotes = () => {
  const { tagname } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`/api/notes?tag=${encodeURIComponent(tagname)}`);
        setNotes(res.data || []);
      } catch (err) {
        setError('Failed to fetch notes for this tag.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [tagname]);

  return (
    <div className="container mx-auto p-6 md:p-10 max-w-3xl bg-gradient-to-br from-white via-indigo-50 to-blue-50 shadow-2xl border border-indigo-100 mt-10 mb-16 w-[90%] max-w-full md:max-w-2xl lg:max-w-3xl rounded-3xl">
      <h2 className="text-2xl font-bold mb-6 text-indigo-700 text-center">Notes tagged with <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-base">#{tagname}</span></h2>
      {loading ? (
        <Loading />
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : notes.length === 0 ? (
        <div className="text-gray-400 text-center py-8">No notes found with this tag.</div>
      ) : (
        <ul className="divide-y divide-indigo-50">
          {notes.map(note => (
            <li
              key={note._id}
              className="py-4 px-2 hover:bg-indigo-50 rounded cursor-pointer transition"
              onClick={() => navigate(`/note/${note._id}`)}
            >
              <div className="font-semibold text-indigo-700 truncate text-lg">{note.title}</div>
              <div className="text-xs text-gray-500 truncate">{note.content?.slice(0, 80) || "No content"}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagNotes; 