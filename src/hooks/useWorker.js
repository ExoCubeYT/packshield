import { useState, useCallback, useRef, useEffect } from 'react';

export function useWorker() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, processing, compressing, done, error
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  const workerRef = useRef(null);

  useEffect(() => {


    workerRef.current = new Worker(new URL('../worker/worker.js', import.meta.url));

    workerRef.current.onmessage = (e) => {
      const { type, percent, payload, error } = e.data;
      if (type === 'progress') {
        setProgress(percent);
      } else if (type === 'status') {
        setStatus(payload);
      } else if (type === 'done') {
        setStatus('done');
        setResult(payload); // payload is Blob
        setProgress(100);
      } else if (type === 'error') {
        setStatus('error');
        setError(error);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const processFile = useCallback((file, key, mode) => {
    if (!workerRef.current) return;
    setStatus('processing');
    setProgress(0);
    setError('');
    setResult(null);

    // Read file as ArrayBuffer before sending to worker to avoid serialization limits with some File objects
    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target.result;
      workerRef.current.postMessage({
        action: mode,
        fileBuffer: buffer,
        key: key
      }, [buffer]); // transfer ownership to avoid copy
    };
    reader.onerror = () => {
      setStatus('error');
      setError('Failed to read file on main thread.');
    };
    reader.readAsArrayBuffer(file);

  }, []);

  const resetWorker = useCallback(() => {
    setStatus('idle');
    setProgress(0);
    setResult(null);
    setError('');
  }, []);

  return {
    progress,
    status,
    result,
    error,
    processFile,
    resetWorker
  };
}
