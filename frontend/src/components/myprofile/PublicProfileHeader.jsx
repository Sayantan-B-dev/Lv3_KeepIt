import React from "react";

const PublicProfileHeader = ({ profile }) => (
  <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-8 md:mb-10">
    <div className="relative mb-4 sm:mb-0">
      {profile.profileImage?.url ? (
        <img
          src={profile.profileImage.url}
          alt={profile.username}
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-indigo-200 shadow-lg"
          style={{ opacity: 1 }}
        />
      ) : (
        <div
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-indigo-100 flex items-center justify-center text-4xl sm:text-5xl text-indigo-400 font-bold border-4 border-indigo-200 shadow-lg"
          style={{ opacity: 1 }}
        >
          {profile.username?.[0]?.toUpperCase() || "?"}
        </div>
      )}
    </div>
    <div className="w-full flex-1 justify-center">
      <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center gap-2 flex-wrap text-center justify-center" style={{ wordBreak: "break-all" }}>
        {profile.username}
        <span
          className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${profile.isVerified
            ? "bg-green-100 text-green-600"
            : "bg-yellow-100 text-yellow-600"
            }`}
        >
          {profile.isVerified ? "Verified" : "Unverified"}
        </span>
      </h3>
    </div>
  </div>
);

export default PublicProfileHeader; 