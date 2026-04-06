import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getOptimizedImageUrl } from "../../utils/imageUtils";

const underlineAnimation = `
  relative inline-block text-white no-underline
  after:content-[''] after:absolute after:left-0 after:bottom-0
  after:w-full after:h-[1px] after:bg-white
  after:origin-right after:scale-x-0
  after:transition-transform after:duration-300
  hover:after:origin-left hover:after:scale-x-100
`;

const UserBox = ({ users = [] }) => {
  if (!Array.isArray(users)) return null;

  return (
    <>
      {users.map((user) => (
        <motion.div
          key={user._id}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
          className=""
        >
          <Link
            to={`/profile/${user._id}`}
            className="
              flex
              rounded-2xl
              border border-white/20
              bg-black/40 backdrop-blur-md
              hover:bg-black/60 hover:border-white/40
              shadow-lg hover:shadow-2xl
              transition-all duration-300
              p-4
              min-w-[140px]
            "
          >
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full text-center sm:text-left">
              {/* Avatar */}
              {user.profileImage?.url ? (
                <motion.img
                  src={getOptimizedImageUrl(user.profileImage.url, 100, 100)}
                  alt={user.username}
                  className="
                    w-12 h-12 rounded-full object-cover
                    border border-white/20
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
                    bg-white/10
                    border border-white/20
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
                className="flex flex-col items-center sm:items-start"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
              >
                <h2
                  className={
                    "text-base sm:text-lg font-semibold text-white leading-tight whitespace-nowrap " +
                    underlineAnimation
                  }
                >
                  {user.username}
                </h2>

                <p className="text-xs text-white/50 font-mono italic whitespace-nowrap">
                  {user.categories && user.categories.length > 0
                    ? `${user.categories.length} segments`
                    : "Empty space"}
                </p>
              </motion.div>
            </div>
          </Link>
        </motion.div>
      ))}
    </>
  );
};

export default UserBox;
