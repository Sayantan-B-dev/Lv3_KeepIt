import React from 'react'
import { motion } from "framer-motion";


const Author = ({ user, handleUserClick  }) => {
    return (
        <div className='flex items-center gap-6 justify-center mb-8'>
            {user?.profileImage?.url ? (
                <motion.img
                    src={user.profileImage.url}
                    alt={user.username}
                    className="w-12 h-12 rounded-full object-cover cursor-pointer border-2 border-indigo-200 shadow-2xl"
                    whileHover={{
                        scale: 1.3,
                        rotate: 5,
                        filter: "brightness(1.1)"
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    onClick={() => handleUserClick(user._id)}
                />
            ) : (
                <motion.div
                    className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-4xl text-indigo-400 font-bold border-2 border-indigo-200 shadow-2xl cursor-pointer"
                    whileHover={{
                        scale: 1.3,
                        rotate: 5,
                        filter: "brightness(1.1)"
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    onClick={() => handleUserClick(user._id)}
                >
                    {user?.username?.[0]?.toUpperCase() || "?"}
                </motion.div>
            )}
        </div>
    )
}

export default Author