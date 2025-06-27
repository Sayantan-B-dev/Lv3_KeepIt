import React from 'react'

const Author = ({user, handleUserClick}) => {
    return (
        <>
            {/* Author */}
            <div className=" flex items-center gap-6 justify-center mb-8">
                <div className="relative group">
                    {user?.profileImage?.url ? (
                        <img
                            src={user.profileImage.url}
                            alt={user.username}
                            className="w-15 h-15 md:w-15 md:h-15 rounded-full object-cover border-4 border-indigo-200 shadow-xl transition-transform duration-300 hover:scale-105"
                            onClick={() => handleUserClick(user._id)}
                        />
                    ) : (
                        <div className="w-15 h-15 md:w-15 md:h-15 rounded-full bg-indigo-100 flex items-center justify-center text-4xl text-indigo-400 font-bold border-4 border-indigo-200 shadow-xl cursor-pointer"
                            onClick={() => handleUserClick(user._id)}>
                            {user?.username?.[0]?.toUpperCase() || "?"}
                        </div>
                    )}

                    <span
                        className={`absolute w-15 h-15  text-black text-center text-xs rounded-full cursor-pointer ${user?.username ? "group-hover:block hidden" : "hidden"}`}
                        onClick={() => handleUserClick(user._id)}
                    >
                        {user?.username}
                    </span>
                </div>
            </div>
            </>
    )
}

export default Author