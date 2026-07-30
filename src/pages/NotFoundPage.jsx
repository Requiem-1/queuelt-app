import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center space-y-6 animate-in fade-in duration-300">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-zinc-900 text-zinc-300 border border-white/10 shadow-xl">
        <AlertCircle className="w-10 h-10 text-zinc-400" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight text-white">
          404 - Line Empty
        </h1>
        <p className="text-zinc-400 text-sm">
          Looks like this queue page doesn't exist or has been relocated.
        </p>
      </div>
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black hover:bg-zinc-200 font-extrabold text-sm shadow-xs transition-all cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
