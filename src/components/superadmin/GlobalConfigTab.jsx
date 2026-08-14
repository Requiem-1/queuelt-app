import { Server, Database, CheckCircle2 } from 'lucide-react';

export const GlobalConfigTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Platform Health & Global Configuration</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Infrastructure runtime diagnostics, WebSocket sync metrics, and security configurations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Node.js API Microservice</h3>
              <p className="text-xs text-zinc-500">Express REST & Socket.io Gateway</p>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-400">Status</span>
              <span className="font-bold text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Operational
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-400">Socket Protocol</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">WebSocket / Polling v4</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-400">Active Node Region</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">Singapore (ap-southeast)</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-500">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">MongoDB Atlas Cluster</h3>
              <p className="text-xs text-zinc-500">Mongoose Document Engine</p>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-400">Connection</span>
              <span className="font-bold text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Connected
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-400">Compound Indexing</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">Enabled (Venue/Counter/Status)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-400">Consistency Strategy</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">Atomic findOneAndUpdate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalConfigTab;
