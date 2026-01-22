import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import UserBox from '../components/home/UserBox';
import Hero from '../components/home/Hero';
import Loading from '../components/home/Loading';
import { useAuth } from '../context/AuthContext';



const Home = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // server-side pagination for faster initial load
        const response = await axiosInstance.get('/api/profile/users', {
          params: { page: 1, limit: 24 }
        });
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
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto max-w-full ">
      <Hero user={user} isAuthenticated={isAuthenticated} />
      <div>
        <hr className="text-center pb-5 border-muted"/>
        <UserBox users={users} />
        <hr className="border-t border border-muted" />
      </div>

    </div>
  );
};

export default Home;
