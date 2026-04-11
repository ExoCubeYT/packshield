<div align="center">
  <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 20px; display: inline-block;">
    <img src="https://img.shields.io/badge/Status-Active-emerald?style=for-the-badge" alt="Status" />
    <img src="https://img.shields.io/badge/Security-AES--256--CFB8-violet?style=for-the-badge" alt="Security" />
  </div>
  
  <br />
  <h1>🛡️ PackShield</h1>
  <p><b>Zero-backend, insanely fast client-side Minecraft resource pack encryption.</b></p>
</div>

---

**PackShield** is an ultra-fast, beautifully designed browser-based utility that encrypts and decrypts Minecraft Bedrock Edition resource packs (`.mcpack` and `.zip`). 

Instead of dealing with CLI tools or sketchy upload websites, PackShield integrates a custom high-performance WebAssembly engine powered by Go directly into your browser.

## ✨ Features
* **100% Private:** No uploads, no backend, no server. Everything is isolated securely inside your local machine.
* **AES-256-CFB8 Encryption:** Flawlessly matches the Bedrock engine standard. Fully compatible with packs created by `mcrputil` and `Pack Essentials`.
* **WASM Accelerated:** Encrypts massive HD texture packs blazingly fast without stuttering or freezing your browser tab.
* **Premium UX:** Built with glassmorphism aesthetics, fluid micro-interactions, and a premium "vibe-coded" feel.

## 🛠️ Tech Stack
* **Frontend:** React 18, Vite, TailwindCSS v3
* **Crypto Engine:** Go 1.22+ (Compiled to WebAssembly)
* **Threading:** Dedicated Web Workers for zero-friction background processing

---

## 🚀 Quick Start (Development)

Want to run PackShield locally or contribute? It takes less than a minute to spin up!

### Prerequisites
* Node.js (v18+)
* Go (v1.22+)

### Standard Setup

**1. Clone the repository:**
```bash
git clone https://github.com/yourusername/packshield.git
cd packshield
```

**2. Install frontend dependencies:**
```bash
npm install
```

**3. Compile the WebAssembly Crypto Engine:**
If you're on Windows, simply run the PowerShell script:
```powershell
powershell -ExecutionPolicy Bypass -File .\build_wasm.ps1
```
*(For Linux or macOS, run `./build_wasm.sh` instead)*

**4. Start the development server:**
```bash
npm run dev
```

Visit the `localhost` URL shown in your terminal, and you're ready to encrypt!

## 🔒 Security Notice
Your encryption key is generated locally on your machine via standard secure entropy (`crypto.getRandomValues`). **Please save your keys!** PackShield cannot magically bypass AES-256 to recover a lost key.

## 📄 License
MIT License. Feel free to use, modify, and distribute.
