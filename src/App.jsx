import { useState, useCallback } from 'react';
import { Shield, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DropZone from './components/DropZone';
import KeyInput from './components/KeyInput';
import ProgressBar from './components/ProgressBar';
import DownloadBtn from './components/DownloadBtn';
import ExoCube from './components/ExoCube';
import { useWorker } from './hooks/useWorker';
import './styles/matrix.css';

export default function App() {
  const [file, setFile] = useState(null);
  const [keyStr, setKeyStr] = useState('');
  const [mode, setMode] = useState('encrypt');
  const [keyRevealed, setKeyRevealed] = useState(false);

  const { processFile, progress, status, result, error, resetWorker } = useWorker();

  const handleGenerateKey = useCallback(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    setKeyStr(Array.from(array, b => chars[b % chars.length]).join(''));
    setKeyRevealed(false);
  }, []);

  const handleProcess = () => {
    if (!file || keyStr.length !== 32) return;
    setKeyRevealed(mode === 'encrypt');
    processFile(file, keyStr, mode);
  };

  const resetAll = () => {
    setFile(null);
    setKeyStr('');
    setKeyRevealed(false);
    resetWorker();
  };

  const isFormValid = file && keyStr.length === 32;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="app-container">
      <ExoCube />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="main-content"
      >
        <motion.div 
          className="header-section"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <div className="logo-container animate-float">
            <div className="logo-glow" />
            <Shield className="logo-icon relative z-10" />
          </div>
          <h1 className="title-text drop-shadow-lg">
            Pack<span className="gradient-text-shimmer">Shield</span>
          </h1>
          <p className="subtitle-text">
            Client-side Minecraft Resource Pack Encryption
          </p>
        </motion.div>

        <div className="glass-panel main-card relative overflow-visible">
          <AnimatePresence mode="popLayout">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, scale: 0.9 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.9 }}
                className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-4"
              >
                <div className="bg-red-500/20 p-2 rounded-full shrink-0">
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="font-semibold text-red-400 text-sm md:text-base">Processing Exception</p>
                  <p className="text-xs md:text-sm text-red-300/80 mt-1">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="action-container"
          >
            <motion.div variants={itemVariants}>
              <DropZone file={file} setFile={(f) => { setFile(f); resetWorker(); }} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <KeyInput keyStr={keyStr} setKeyStr={setKeyStr} onGenerate={handleGenerateKey} />
            </motion.div>

            <motion.div variants={itemVariants} className="mode-switcher relative">
              <div 
                className="mode-switcher-pill"
                style={{ 
                  left: mode === 'encrypt' ? '6px' : '50%',
                  backgroundImage: mode === 'encrypt' 
                    ? 'linear-gradient(to right, #7c3aed, #6d28d9)' 
                    : 'linear-gradient(to right, #10b981, #059669)',
                  boxShadow: mode === 'encrypt' ? '0 8px 20px -5px rgba(124,58,237,0.4)' : '0 8px 20px -5px rgba(16,185,129,0.4)'
                }}
              />
              <button
                onClick={() => setMode('encrypt')}
                className={`mode-btn z-10 ${mode === 'encrypt' ? 'text-white' : 'text-white/40 hover:text-white/80'}`}
              >
                Encrypt
              </button>
              <button
                onClick={() => setMode('decrypt')}
                className={`mode-btn z-10 ${mode === 'decrypt' ? 'text-white' : 'text-white/40 hover:text-white/80'}`}
              >
                Decrypt
              </button>
            </motion.div>

            <AnimatePresence mode="popLayout">
              {status === 'idle' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring" }}
                >
                  <motion.button
                    whileTap={isFormValid ? { scale: 0.97 } : {}}
                    whileHover={isFormValid ? { scale: 1.02 } : {}}
                    onClick={handleProcess}
                    disabled={!isFormValid}
                    className={`process-btn group
                      ${!isFormValid
                        ? 'btn-disabled'
                        : mode === 'encrypt'
                          ? 'btn-encrypt'
                          : 'btn-decrypt'
                      }`}
                  >
                    {isFormValid && <div className="btn-shine group-hover:translate-x-[200%]" />}
                    <span className="relative z-10 flex items-center justify-center gap-2">
                       {mode === 'encrypt' ? 'Lock Pack' : 'Unlock Pack'}
                    </span>
                  </motion.button>
                </motion.div>
              )}

              {(status === 'processing' || status === 'compressing') && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ProgressBar progress={progress} status={status} />
                </motion.div>
              )}

              {status === 'done' && result && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <DownloadBtn 
                    file={file} 
                    resultBlob={result} 
                    mode={mode} 
                    onReset={resetAll} 
                    keyStr={keyRevealed ? keyStr : ''}
                  />
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="footer-info mt-8"
        >
          <span><CheckCircle2 className="w-4 h-4 text-emerald-500/50" /> Zero Uploads</span>
          <span><CheckCircle2 className="w-4 h-4 text-emerald-500/50" /> Runs Locally</span>
          <span><CheckCircle2 className="w-4 h-4 text-emerald-500/50" /> AES-256-CFB8</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
