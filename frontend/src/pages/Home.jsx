import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';


const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/auth/users');
        console.log('Users response:', response.data);
        setUsers(response.data);
      } catch (err) {
        console.error('Error details:', err.response || err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="grid gap-4">
        {users.map((user) => (
          <Link 
            key={user._id}
            to={`/profile/${user._id}`}
            className="block p-4 border rounded hover:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              {user.profileImage && (
                <img 
                  src={user.profileImage.url} 
                  alt={user.username} 
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold">{user.username}</h2>
                <p className="text-gray-600">View profile and notes</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
