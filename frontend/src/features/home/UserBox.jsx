import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const underlineAnimation = `
  relative inline-block text-white no-underline
  after:content-[''] after:absolute after:left-0 after:bottom-0
  after:w-full after:h-[1px] after:bg-white
  after:origin-right after:scale-x-0
  after:transition-transform after:duration-300
  hover:after:origin-left hover:after:scale-x-100
`;

const UserBox = ({ users }) => {
  return (
      <div
        className="
        w-full mb-5 p-5
        flex flex-wrap gap-4
        rounded-xl
        border border border-muted
        bg-type-1 backdrop-blur-md
      "
      >
        {users.map((user) => (
          <motion.div
            key={user._id}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 280, damping: 18 }}
          >
            <Link
              to={`/profile/${user._id}`}
              className="
              inline-flex
              rounded-xl
              border border border-muted
              bg-type-1 backdrop-blur-md
              hover:bg-type-2 hover:border border-muted
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
                    border border border-muted
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
                    bg-type-2
                    border border border-muted
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
                  <h2
                    className={
                      "text-base sm:text-lg font-semibold text-white leading-tight whitespace-nowrap " +
                      underlineAnimation
                    }
                  >
                    {user.username}
                  </h2>

                  <p className="text-sm text-gray-200 whitespace-nowrap">
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
