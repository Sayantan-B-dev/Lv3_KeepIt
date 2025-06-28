import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import UserBox from '../components/home/UserBox';
import Magnet from '../components/advance/Magnet';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/profile/users');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search input (case-insensitive, by username or name)
  const filteredUsers = users.filter(user => {
    const searchLower = search.toLowerCase();
    return (
      (user.username && user.username.toLowerCase().includes(searchLower)) ||
      (user.name && user.name.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const containerStyle = {
    backdropFilter: 'blur(2px)',
    backdropShadow: '20px',
    background: 'rgba(255, 255, 255, 0.01)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.10)',
    borderRadius: '60px',
  };

  return (
    <Magnet padding={50} disabled={false} magnetStrength={100} className="w-full">
      <div className="container mx-auto p-6 shadow-2xl border-1 border-dashed border-black mt-10 mb-21 relative w-[90%] max-w-[90%] md:max-w-2xl lg:max-w-3xl"
        style={{
          width: '90%',
          maxWidth: '90%',
          ...containerStyle,
        }}>
        <h1 className="text-2xl font-bold text-center mb-4 text-black mb-8">All Users</h1>
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
            placeholder="Search users"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 h-10 px-4 rounded-md border-1 border-gray-300 text-black focus:outline-none focus:border-black"
            style={{
              ...containerStyle,
            }}
          />
        </div>
        <div id="explore-users" >
          {filteredUsers.length === 0 ? (
            <div className="text-center text-red-500">No users found.</div>
          ) : (
            <UserBox users={filteredUsers} />
          )}
        </div>
      </div>
    </Magnet>
  );
};

export default AllUsers;
