import React from 'react'
import { Link } from 'react-router-dom';

const UserBox = ({users}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
    {users.map((user) => (
      <Link 
        key={user._id}
        to={`/profile/${user._id}`}
        className="block flex justify-center items-center p-4 border rounded bg-gray-200 hover:bg-gray-100"
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
  )
}

export default UserBox