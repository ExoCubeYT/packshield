import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProgressBar({ progress, status }) {
  return (
    <div className="w-full bg-black/60 border border-white/5 rounded-3xl p-8 relative overflow-hidden backdrop-blur-xl shadow-2xl">
      <div className="flex flex-col items-center justify-center gap-5 relative z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-violet-500/30 rounded-full blur-xl animate-pulse" />
          <Loader2 className="w-10 h-10 text-white animate-spin relative z-10 opacity-90 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-lg mb-1 shadow-black drop-shadow-md">
            WASM Engine Working...
          </p>
          <div className="flex items-center justify-center gap-2 text-white/50 text-sm font-medium">
            <span className="animate-pulse">{progress}% Complete</span>
          </div>
        </div>
      </div>
      
      {/* Dynamic Background fill */}
      <motion.div 
        className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-emerald-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ ease: "linear", duration: 0.2 }}
      />
    </div>
  );
}
