import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import UserBox from '../components/home/UserBox';
import Magnet from '../components/advance/Magnet';

const AllUsers = () => {
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
    <Magnet  padding={50} disabled={false} magnetStrength={100} className="w-full">
    <div className="container mx-auto p-4 ">
      <h1 className="text-2xl font-bold mt-10 text-black pb-2">All Users</h1>
      <div id="explore-users">
        <UserBox users={users} />
      </div>
    </div>
    </Magnet>
  );
};

export default AllUsers;
