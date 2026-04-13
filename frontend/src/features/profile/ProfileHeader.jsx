import React from "react";
import { motion } from "framer-motion";
import { DottedButton } from "@/components/ui/buttons";
import {
  Calendar,
  Globe,
  Users,
  FolderHeart,
  CheckCircle2
} from "lucide-react";

const ProfileHeader = ({
  profile,
  profileImageSrc,
  coverImageSrc,
  isOwnProfile,
  editMode,
  handleProfileImageClick,
  handleCoverImageClick,
  fileInputRef,
  coverInputRef,
  handleCreateNote,
  onEdit,
  isFollowing,
  onFollowToggle,
  onStatClick,
  handleProfileImageChange,
  handleCoverImageChange,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const resolveWebsiteHref = (website) =>
    /^https?:\/\//i.test(website) ? website : `//${website}`;

  return (
    <div 
      className="w-full flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-12 mb-10 p-8 rounded-3xl border border-muted shadow-2xl relative overflow-hidden transition-all duration-500"
      style={{
        backgroundImage: coverImageSrc ? `url(${coverImageSrc})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background Overlay */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-500 ${coverImageSrc ? 'bg-black/80 backdrop-blur-[2px]' : 'glass-panel opacity-100'}`} />

      {/* Profile/Cover Change Buttons Layer */}
      {isOwnProfile && editMode && (
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={handleCoverImageClick}
            className="flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-black/80 text-white text-xs font-mono rounded-xl border border-white/20 backdrop-blur-md transition-all active:scale-95"
          >
            <FolderHeart className="w-4 h-4" />
            Change Cover
          </button>
          <input
            type="file"
            accept="image/*"
            ref={coverInputRef}
            className="hidden"
            onChange={handleCoverImageChange}
          />
        </div>
      )}

      {/* Avatar Section */}
      <div
        className={`relative shrink-0 z-10 ${isOwnProfile && editMode ? "cursor-pointer group" : ""}`}
        onClick={isOwnProfile && editMode ? handleProfileImageClick : undefined}
      >
        <div className="relative">
          {profileImageSrc ? (
            <motion.img
              src={profileImageSrc}
              alt={profile.username}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-muted shadow-2xl transition-all duration-300 group-hover:border-white/40"
              style={{ opacity: editMode ? 0.6 : 1 }}
              whileHover={isOwnProfile ? { scale: 1.05 } : undefined}
            />
          ) : (
            <motion.div
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-type-2 flex items-center justify-center text-5xl font-bold text-type-1 border-4 border-muted shadow-2xl font-mono"
              whileHover={isOwnProfile ? { scale: 1.05 } : undefined}
            >
              {profile.username?.[0]?.toUpperCase() || "?"}
            </motion.div>
          )}

          {isOwnProfile && editMode && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="px-3 py-1 bg-black/60 text-white rounded-full text-xs backdrop-blur-sm border border-white/20">
                Change Photo
              </span>
            </div>
          )}
 
          {(profile?.isPro || profile?.isPremium) && (
            <motion.div
              initial={{ scale: 0, x: 20, y: 20 }}
              animate={{ scale: 1, x: 0, y: 0 }}
              className="absolute -bottom-2 -right-2 px-3 py-1 bg-gradient-to-tr from-yellow-600 to-amber-400 text-[10px] font-black text-black rounded-lg border-2 border-yellow-300 shadow-[0_0_20px_rgba(245,158,11,0.6)] z-10 select-none"
            >
              PRO
            </motion.div>
          )}
        </div>

        {isOwnProfile && editMode && (
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleProfileImageChange}
          />
        )}
      </div>

      {/* Info Section */}
      <div className="flex-1 w-full text-center sm:text-left flex flex-col pt-2 z-10 relative">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 justify-center sm:justify-start">
          <h3 className="text-4xl font-black text-type-1 font-mono tracking-tight break-all">
            {profile.username}
          </h3>
          {profile.isVerified && (
            <div className="flex items-center justify-center sm:justify-start">
              <CheckCircle2 className="w-6 h-6 text-blue-400 fill-blue-400/10" />
              <span className="ml-1 text-[10px] uppercase tracking-widest text-blue-400 font-bold hidden sm:inline">Verified</span>
            </div>
          )}
        </div>

        {/* User Bio */}
        {profile.bio && (
          <p className="text-type-2 text-lg mb-4 max-w-2xl font-mono leading-relaxed italic opacity-90">
            "{profile.bio}"
          </p>
        )}

        {/* Stats Row */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 mb-6 text-type-1 font-mono">
          <button
            onClick={() => onStatClick('followers')}
            className="flex flex-col items-center sm:items-start group hover:scale-105 transition-transform"
          >
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-type-3 group-hover:text-blue-400 transition-colors" />
              <span className="text-2xl font-black">{profile.followers?.length || 0}</span>
            </div>
            <span className="text-[10px] uppercase tracking-tighter text-type-3 font-bold">Followers</span>
          </button>
          <div className="h-10 w-px bg-white/10 hidden sm:block" />
          <button
            onClick={() => onStatClick('following')}
            className="flex flex-col items-center sm:items-start group hover:scale-105 transition-transform"
          >
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-type-3 group-hover:text-green-400 transition-colors" />
              <span className="text-2xl font-black">{profile.following?.length || 0}</span>
            </div>
            <span className="text-[10px] uppercase tracking-tighter text-type-3 font-bold">Following</span>
          </button>
          <div className="h-10 w-px bg-white/10 hidden sm:block" />
          <button
            onClick={() => onStatClick('categories')}
            className="flex flex-col items-center sm:items-start group hover:scale-105 transition-transform"
          >
            <div className="flex items-center gap-2 mb-1">
              <FolderHeart className="w-4 h-4 text-type-3 group-hover:text-red-400 transition-colors" />
              <span className="text-2xl font-black">{profile.categories?.length || 0}</span>
            </div>
            <span className="text-[10px] uppercase tracking-tighter text-type-3 font-bold">Categories</span>
          </button>
          
          <div className="h-10 w-px bg-white/10 hidden sm:block" />
          <div className="flex flex-col items-center sm:items-start group hover:scale-105 transition-transform">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-black">{profile.totalNotes || 0}</span>
            </div>
            <span className="text-[10px] uppercase tracking-tighter text-type-3 font-bold">Notes</span>
          </div>
          
          <div className="h-10 w-px bg-white/10 hidden sm:block" />
          <div className="flex flex-col items-center sm:items-start group hover:scale-105 transition-transform">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-black">{profile.totalTags || 0}</span>
            </div>
            <span className="text-[10px] uppercase tracking-tighter text-type-3 font-bold">Tags</span>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-type-3 font-mono mb-6">
          <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Joined {formatDate(profile.createdAt)}</span>
          </div>

          {profile.website && (
            <a
              href={resolveWebsiteHref(profile.website)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5 hover:bg-white/10 transition-colors text-blue-300"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="truncate max-w-[150px]">{profile.website.replace(/^https?:\/\//, "")}</span>
            </a>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex flex-wrap justify-center sm:justify-start gap-4">
          {isOwnProfile && !editMode ? (
            <>
              <DottedButton text="Create a new Note" href="/CreateNote" />
              <button
                onClick={onEdit}
                className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-type-1 font-mono text-sm border border-white/10 transition-all duration-300 active:scale-95"
              >
                Edit Profile
              </button>
            </>
          ) : !isOwnProfile ? (
            <button
              onClick={onFollowToggle}
              className={`px-8 py-2 rounded-xl font-bold font-mono text-sm border transition-all duration-300 active:scale-95 ${isFollowing
                  ? "bg-transparent text-type-1 border-white/10 hover:bg-red-500/50"
                  : "bg-transparent text-type-1 border-white/10 hover:bg-blue-500/50"
                }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
