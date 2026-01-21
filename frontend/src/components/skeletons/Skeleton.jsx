const Skeleton = () => (
  <div
    className="
      relative
      flex items-center gap-4
      w-full
      mx-auto
      px-5 py-4
      rounded-xl
      border border-muted
      backdrop-blur-md
      overflow-hidden
      animate-pulse
      glass-panel
    "
  >
    {/* shimmer layer */}
    <div
      className="
        absolute inset-0
        -translate-x-full
        bg-gradient-to-r
        from-transparent
        via-white/10
        to-transparent
        animate-[shimmer_0.5s_infinite]
      "
    />

    {/* title bar */}
    <div
      className="
        flex-1
        h-5
        rounded-full
        bg-type-1
        border border-muted
      "
    />

    {/* avatar circle */}
    <div
      className="
        w-11 h-11
        rounded-full
        bg-type-1
        border border-muted
      "
    />
  </div>
);

export default Skeleton;
