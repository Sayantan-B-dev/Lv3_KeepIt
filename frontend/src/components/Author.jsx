import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";

const Author = ({ user, handleUserClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div>
            <div className='flex flex-col items-center gap-2 justify-center mb-8'>
                <div
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="flex flex-col items-center"
                >
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
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                key="username"
                                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                animate={{ opacity: 1, y: 4, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="mt-2 px-3 py-1 rounded-lg bg-white/80 shadow text-indigo-700 text-sm font-semibold border border-indigo-100 z-10"
                                style={{ pointerEvents: "none" }}
                            >
                                {user?.username}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            {/* Optionally, you can remove the always-visible username below, or keep it for accessibility */}
            {/* <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-500'>{user?.username}</span>
            </div> */}
        </div>
    )
}

export default Author