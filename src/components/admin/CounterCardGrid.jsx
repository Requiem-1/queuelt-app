import CounterCard from './CounterCard';

export const CounterCardGrid = ({
  counters,
  onCallNext,
  onSkipToken,
  onCompleteToken,
  onToggleStatus,
  onRequeueSkipped,
  onClearSkipped,
  onOpenQrModal,
  onOpenResetModal,
}) => {
  if (!counters || counters.length === 0) {
    return (
      <div className="py-16 text-center p-8 rounded-3xl bg-white/40 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 backdrop-blur-xl">
        <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
          No active counters found for this venue.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {counters.map((counter) => (
        <CounterCard
          key={counter.id}
          counter={counter}
          onCallNext={onCallNext}
          onSkipToken={onSkipToken}
          onCompleteToken={onCompleteToken}
          onToggleStatus={onToggleStatus}
          onRequeueSkipped={onRequeueSkipped}
          onClearSkipped={onClearSkipped}
          onOpenQrModal={onOpenQrModal}
          onOpenResetModal={onOpenResetModal}
        />
      ))}
    </div>
  );
};

export default CounterCardGrid;
