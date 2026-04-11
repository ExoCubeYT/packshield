import { Key, Shuffle, Check } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function KeyInput({ keyStr, setKeyStr, onGenerate }) {
  const [justGenerated, setJustGenerated] = useState(false);

  const handleGenerate = () => {
    onGenerate();
    setJustGenerated(true);
    setTimeout(() => setJustGenerated(false), 2000);
  };

  const isInvalidLength = keyStr.length > 0 && keyStr.length !== 32;
  const isPerfect = keyStr.length === 32;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
             <Key className="w-4 h-4 text-violet-400" />
          </div>
          AES-256 Key
        </label>
        <motion.span 
          animate={{ scale: isPerfect ? [1, 1.1, 1] : 1 }}
          className={`text-xs font-mono px-3 py-1.5 rounded-lg font-semibold tracking-wider transition-colors duration-300 ${
          isPerfect ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 
          keyStr.length === 0 ? 'bg-black/40 text-white/40 border border-white/5' : 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
        }`}>
          {keyStr.length}/32
        </motion.span>
      </div>
      
      <div className="relative group">
        <input 
          type="text"
          value={keyStr}
          onChange={(e) => setKeyStr(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
          placeholder="Enter or generate 32-char key..."
          maxLength={32}
          className={`w-full bg-black/40 backdrop-blur-3xl rounded-2xl py-4 pl-5 md:pr-[140px] pr-[110px] font-mono tracking-widest text-sm transition-all duration-300 outline-none ring-0
            ${isInvalidLength 
              ? 'border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1),inset_0_2px_4px_rgba(0,0,0,0.5)] text-red-50' 
              : isPerfect
                ? 'border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1),inset_0_2px_4px_rgba(0,0,0,0.5)] text-emerald-50'
                : 'border border-white/10 hover:border-violet-500/40 text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]'
            }
          placeholder:text-white/20`}
        />
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={handleGenerate}
          className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 backdrop-blur-md shadow-lg
            ${justGenerated 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/50' 
              : 'bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/40'
            }
          `}
        >
          {justGenerated ? <Check className="w-4 h-4 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]" /> : <Shuffle className="w-4 h-4" />}
          <span className="hidden sm:inline">{justGenerated ? 'Generated' : 'Gen Key'}</span>
        </motion.button>
      </div>
    </div>
  );
}
