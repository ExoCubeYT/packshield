importScripts('/wasm_exec.js');

let wasmLoaded = false;
let isInitializing = false;

async function initWasm() {
  if (wasmLoaded) return;
  if (isInitializing) {
    // Wait until initialized if multiple rapid calls happen
    while (!wasmLoaded) {
      await new Promise(r => setTimeout(r, 100));
    }
    return;
  }
  
  isInitializing = true;
  try {
    const go = new Go();
    const result = await WebAssembly.instantiateStreaming(fetch('/main.wasm'), go.importObject);
    go.run(result.instance);
    wasmLoaded = true;
  } catch (err) {
    console.error('Failed to load WASM:', err);
    throw new Error('Failed to load encryption engine. Try refreshing.');
  } finally {
    isInitializing = false;
  }
}

self.onmessage = async (e) => {
  const { action, fileBuffer, key } = e.data;
  
  try {
    await initWasm();
    
    // Convert ArrayBuffer to Uint8Array
    const uint8Input = new Uint8Array(fileBuffer);
    
    // Provide a callback for progress reports from Go
    self.goProgressCallback = (percent) => {
      self.postMessage({ type: 'progress', percent });
    };
    
    self.postMessage({ type: 'status', payload: 'processing' });
    
    let resultUint8;
    if (action === 'encrypt') {
        resultUint8 = self.goEncrypt(uint8Input, key);
    } else if (action === 'decrypt') {
        resultUint8 = self.goDecrypt(uint8Input, key);
    } else {
        throw new Error('Unknown action: ' + action);
    }
    
    // Clean up callback binding
    delete self.goProgressCallback;
    
    if (!resultUint8 || resultUint8.length === 0) {
      throw new Error(action === 'encrypt' ? 'Encryption failed' : 'Wrong key or this pack is not encrypted');
    }
    
    // Convert output Uint8Array to Blob
    const resultBlob = new Blob([resultUint8], { type: 'application/zip' });
    
    self.postMessage({ 
      type: 'done', 
      payload: resultBlob 
    });

  } catch (err) {
    self.postMessage({ 
      type: 'error', 
      error: err.message || err.toString() 
    });
  }
};
