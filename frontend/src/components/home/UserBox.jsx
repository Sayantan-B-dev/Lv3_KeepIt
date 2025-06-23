import React from 'react'
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

const UserBox = ({ users }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full  border-y-1 border-black p-5 mb-10 rounded-lg">

            {users.map((user) => (
                <motion.div
                    key={user._id}
                    className="relative"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <Link
                        to={`/profile/${user._id}`}
                        className="block overflow-hidden flex justify-start items-center p-4 border rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                        <div className="flex items-center gap-4">
                            {user.profileImage && user.profileImage.url ? (
                                <motion.img
                                    src={user.profileImage.url}
                                    alt={user.username}
                                    className="w-12 h-12 rounded-full object-cover"
                                    whileHover={{ 
                                        scale: 1.3,
                                        rotate: 5,
                                        filter: "brightness(1.1)"
                                    }}
                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                />
                            ) : (
                                <motion.div
                                    className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-4xl text-indigo-400 font-bold border-4 border-indigo-200 shadow-lg"
                                    whileHover={{ 
                                        scale: 1.3,
                                        rotate: 5,
                                        filter: "brightness(1.1)"
                                    }}
                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                >
                                    {user.username?.[0]?.toUpperCase() || "?"}
                                </motion.div>
                            )}
                            <motion.div
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <h2 className="text-xl font-semibold text-gray-800">{user.username}</h2>
                                <p className="text-gray-600 text-sm">
                                    {user.categories && user.categories.length > 0 
                                        ? `${user.categories.length} categories`
                                        : 'No categories yet'
                                    }
                                </p>
                            </motion.div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    )
}

export default UserBox