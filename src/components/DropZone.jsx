import { useState, useRef } from 'react';
import { UploadCloud, File, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DropZone({ file, setFile }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const validateAndSetFile = (selectedFile) => {
    setError('');
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.zip') && !selectedFile.name.endsWith('.mcpack')) {
      setError('Only .zip or .mcpack files are allowed');
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const onDragLeave = () => {
    setIsDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div 
      whileHover={{ scale: file ? 1 : 1.01 }}
      whileTap={{ scale: file ? 1 : 0.98 }}
    >
      <div 
        onClick={() => inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative w-full rounded-3xl border-2 border-dashed p-8 md:p-12 text-center cursor-pointer transition-all duration-300 overflow-hidden
          ${error 
            ? 'border-red-500/50 bg-red-500/5 hover:bg-red-500/10' 
            : isDragActive 
              ? 'border-violet-400 bg-violet-500/10 shadow-[inset_0_0_50px_rgba(124,58,237,0.2)]' 
              : file 
                ? 'border-white/20 bg-white/5 border-solid' 
                : 'border-white/10 bg-black/20 hover:border-violet-500/50 hover:bg-white/5'
          }
        `}
      >
        <input 
          type="file" 
          ref={inputRef} 
          onChange={(e) => { if (e.target.files?.length) validateAndSetFile(e.target.files[0]); }} 
          className="hidden" 
          accept=".zip,.mcpack"
        />
        
        <AnimatePresence mode="wait">
          {file ? (
            <motion.div 
              key="file"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-3 relative z-10"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center mb-2 shadow-xl shadow-emerald-900/20">
                <File className="w-10 h-10 text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              </div>
              <div>
                <p className="text-white font-bold text-lg break-all">{file.name}</p>
                <p className="text-emerald-400/80 font-medium text-sm mt-1">{formatSize(file.size)}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 relative z-10"
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl
                ${error ? 'bg-red-500/10 border border-red-500/20' : isDragActive ? 'bg-violet-500/20 border border-violet-500/30 scale-110' : 'bg-white/5 border border-white/5 group-hover:scale-110'}
              `}>
                {error ? (
                  <AlertCircle className="w-10 h-10 text-red-500" />
                ) : (
                  <UploadCloud className={`w-10 h-10 ${isDragActive ? 'text-violet-400' : 'text-white/40 group-hover:text-violet-400 transition-colors'}`} />
                )}
              </div>
              <div>
                <p className={`font-bold text-lg md:text-xl ${error ? 'text-red-400' : 'text-white/90'}`}>
                  {error || 'Upload Resource Pack'}
                </p>
                <p className="text-white/40 text-sm md:text-base mt-2 max-w-[250px] mx-auto leading-relaxed">
                  {error ? 'Try again with a valid file' : 'Drag & drop or click to browse. Accepts .zip and .mcpack'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
