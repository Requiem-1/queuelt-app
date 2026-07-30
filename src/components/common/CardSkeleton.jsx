

/**
 * Venue Card Loader Skeleton
 */
export const CardSkeleton = () => {
  return (
    <div className="rounded-3xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 p-5 space-y-4 animate-pulse min-w-0">
      {/* Image Skeleton */}
      <div className="w-full h-44 rounded-2xl bg-zinc-200 dark:bg-zinc-800/60" />

      {/* Header Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="h-6 w-3/4 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-3 w-1/2 rounded-lg bg-zinc-200 dark:bg-zinc-800/60" />
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <div className="h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800/50" />
        <div className="h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800/50" />
      </div>

      {/* Button Skeleton */}
      <div className="h-10 w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
};

/**
 * Live Queue Status Hero Skeleton Loader
 */
export const QueueStatusSkeleton = () => {
  return (
    <div className="max-w-xl mx-auto space-y-6 animate-pulse">
      <div className="h-5 w-32 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      <div className="rounded-3xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-8 text-center space-y-6 shadow-xl">
        <div className="h-6 w-28 rounded-full bg-zinc-200 dark:bg-zinc-800 mx-auto" />
        <div className="space-y-2">
          <div className="h-4 w-40 rounded-lg bg-zinc-200 dark:bg-zinc-800/60 mx-auto" />
          <div className="h-14 w-36 rounded-2xl bg-zinc-200 dark:bg-zinc-800 mx-auto" />
        </div>
        <div className="h-24 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50" />
          <div className="h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50" />
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;
