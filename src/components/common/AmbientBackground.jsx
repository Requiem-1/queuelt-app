

export const AmbientBackground = () => {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* Base Background Layer */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-[#02050f] transition-colors duration-300" />

      {/* Primary Static Deep Blue Radial Source Glow Emitting Outward */}
      <div className="absolute top-[18%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.18)_0%,_rgba(59,130,246,0.08)_35%,_transparent_70%)] dark:bg-[radial-gradient(circle_at_center,_rgba(29,78,216,0.38)_0%,_rgba(30,58,138,0.22)_35%,_rgba(15,23,42,0.5)_65%,_transparent_100%)] blur-[90px]" />

      {/* Secondary Static Deep Indigo/Blue Ambient Glow */}
      <div className="absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[700px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.12)_0%,_rgba(226,232,240,0.5)_55%,_transparent_100%)] dark:bg-[radial-gradient(circle_at_center,_rgba(30,27,75,0.28)_0%,_rgba(2,6,23,0.6)_55%,_transparent_100%)] blur-[110px]" />
    </div>
  );
};

export default AmbientBackground;
