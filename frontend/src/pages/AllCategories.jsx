import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import DottedButton from '../components/buttons/DottedButton';
import Author from '../components/Author';
import Magnet from '../components/advance/Magnet'

const AllCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  }

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get('/api/global/all-categories');
        setCategories(res.data || []);
      } catch (err) {
        setError('Failed to load categories.');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Magnet padding={50} disabled={false} magnetStrength={100} className="w-full">
      <div className='container mx-auto p-6 max-w-3xl shadow-2xl border-1 border-dashed border-black mt-10 mb-21 relative'
        style={{
          backdropFilter: 'blur(2px)',
          backdropShadow: '20px',
          background: 'rgba(255, 255, 255, 0.01)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.10)',
          borderRadius: '60px',
        }}>
        <h2 className='text-2xl font-bold text-center mb-4 text-black mb-8'>All Categories</h2>
        <div className="flex items-center gap-3 w-full mb-6">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-black"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607Z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search categories"
            className="flex-1 h-10 px-4 rounded-md border-1 border-gray-300 text-black focus:outline-none focus:border-black"
            style={{
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(12px)',
              background: 'rgba(255, 255, 255, 0.1)',
              boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.10)',
              borderRadius: '60px',
            }}
          />
        </div>
        {loading && <div>Loading categories...</div>}
        {error && <div style={{ color: '#e63946' }}>{error}</div>}
        {!loading && !error && (
          <ul style={{ listStyle: 'none', padding: 0 }} className='flex flex-col gap-2'>
            {categories.length === 0 ? (
              <li>No categories found.</li>
            ) : (
              categories.map((cat) => (
                <div key={cat._id || cat.name} className='flex items-center gap-2 w-full'>
                  <DottedButton key={cat._id || cat.name} text={cat.name} className='w-full' />
                  <div className='w-12 h-12'><Author user={cat.user} handleUserClick={handleUserClick} /></div>
                </div>
              ))
            )}
          </ul>
        )}
      </div>
    </Magnet>
  );
};

export default AllCategories;