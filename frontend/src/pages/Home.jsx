import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import UserBox from '../components/home/UserBox';
import Hero from '../components/home/Hero';


const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/profile/users');
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
      <Hero />
      <h1 className="text-2xl font-bold mt-10 text-black pb-2 ">Explore</h1>
      <UserBox users={users} />
    </div>
  );
};

export default Home;
