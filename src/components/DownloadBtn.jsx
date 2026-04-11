import { Download, RefreshCw, Copy, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DownloadBtn({ file, resultBlob, mode, onReset, keyStr }) {
  
  const handleDownload = () => {
    if (!resultBlob || !file) return;
    
    const ext = file.name.includes('.mcpack') ? '.mcpack' : '.zip';
    const baseName = file.name.replace(/\.(zip|mcpack)$/i, '');
    const defaultSuffix = mode === 'encrypt' ? '_encrypted' : '_decrypted';
    const newName = `${baseName}${defaultSuffix}${ext}`;
    
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = newName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyKey = () => {
    navigator.clipboard.writeText(keyStr);
  };

  return (
    <div className="space-y-4">
      {keyStr && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-md"
        >
          <div className="flex items-center gap-3 text-amber-400 font-bold text-sm mb-3">
            <div className="p-1.5 bg-amber-500/20 rounded-full">
               <ShieldAlert className="w-4 h-4" />
            </div>
            Save this key to decrypt later!
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 block p-4 bg-black/60 rounded-2xl text-amber-100 font-mono text-xs md:text-sm break-all font-semibold border border-amber-500/10 tracking-widest shadow-inner">
              {keyStr}
            </code>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={copyKey}
              className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-colors group shadow-lg"
              title="Copy key"
            >
              <Copy className="w-5 h-5 text-white/70 group-hover:text-white" />
            </motion.button>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleDownload}
          className="flex-1 flex w-full items-center justify-center gap-3 py-5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-2xl font-bold shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] border border-emerald-400/50"
        >
          <Download className="w-6 h-6 animate-bounce mt-1" />
          <span className="text-lg">Download Result</span>
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={onReset}
          className="px-6 py-5 w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl transition-colors flex items-center justify-center backdrop-blur-md"
          title="Start over"
        >
          <RefreshCw className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
}
