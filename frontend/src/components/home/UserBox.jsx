import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const UserBox = ({ users }) => {
  return (
    <div
      className="
        w-full mb-10 p-5
        grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
        gap-4
        rounded-2xl
        border border-white/30
        bg-white/10 backdrop-blur-md
      "
    >
      {users.map((user) => (
        <motion.div
          key={user._id}
          className="relative"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
        >
          <Link
            to={`/profile/${user._id}`}
            className="
              block w-full
              rounded-xl
              border border-white/30
              bg-white/10 backdrop-blur-md
              hover:bg-white/20 hover:border-white/50
              shadow-lg hover:shadow-2xl
              transition-all duration-300
              p-4
            "
          >
            <div className="flex items-center gap-4">
              {/* Avatar */}
              {user.profileImage?.url ? (
                <motion.img
                  src={user.profileImage.url}
                  alt={user.username}
                  className="
                    w-12 h-12 rounded-full object-cover
                    border border-white/40
                  "
                  whileHover={{
                    scale: 1.15,
                    rotate: 4,
                    filter: "brightness(1.1)",
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 16 }}
                />
              ) : (
                <motion.div
                  className="
                    w-12 h-12 rounded-full
                    flex items-center justify-center
                    text-lg font-bold
                    text-white
                    bg-white/20
                    border border-white/40
                    shadow-md
                  "
                  whileHover={{
                    scale: 1.15,
                    rotate: 4,
                    filter: "brightness(1.1)",
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 16 }}
                >
                  {user.username?.[0]?.toUpperCase() || "?"}
                </motion.div>
              )}

              {/* User Info */}
              <motion.div
                className="flex flex-col"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
              >
                <h2 className="text-base sm:text-lg font-semibold text-white leading-tight">
                  {user.username}
                </h2>

                <p className="text-sm text-gray-200">
                  {user.categories && user.categories.length > 0
                    ? `${user.categories.length} categories`
                    : "No categories yet"}
                </p>
              </motion.div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default UserBox;
