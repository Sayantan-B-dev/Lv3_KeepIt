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
                    <div className="relative group/avatar">
                        {user?.profileImage?.url ? (
                            <motion.img
                                src={user.profileImage.url}
                                alt={user.username}
                                className="w-12 h-12 rounded-full object-cover cursor-pointer border border-muted shadow-2xl z-1000"
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
                                className="w-12 h-12 rounded-full bg-type-1 flex items-center justify-center text-4xl text-type-2 font-bold border-1 border-muted shadow-2xl cursor-pointer"
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
                        
                        {(user?.isPro || user?.isPremium) && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-gradient-to-tr from-yellow-600 to-amber-400 text-[8px] font-black text-black rounded-md border border-yellow-300 shadow-[0_0_10px_rgba(245,158,11,0.5)] z-[1001]"
                            >
                                PRO
                            </motion.div>
                        )}
                    </div>
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                key="username"
                                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                animate={{ opacity: 1, y: 4, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="mt-2 px-3 py-1 rounded-lg bg-black/70 shadow text-type-1 text-sm font-mono border border-muted z-1500 glass-panel"
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