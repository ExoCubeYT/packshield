<div align="center">

![Status](https://img.shields.io/badge/Status-Active-22c55e?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-AES--256--CFB8-8b5cf6?style=for-the-badge)

# 🛡️ PackShield

**Blazing-fast, zero-backend encryption for Minecraft resource packs**  
<sub>Secure. Private. Fully client-side.</sub>

</div>

---

## 🚀 Overview

**PackShield** is a high-performance, browser-based utility for encrypting and decrypting **Minecraft Bedrock Edition** resource packs (`.mcpack` / `.zip`).

No CLI tools. No file uploads. No shady services.

Everything runs **locally in your browser**, powered by a custom **WebAssembly crypto engine built with Go**.

---

## ✨ Features

- 🔒 **100% Private**  
  No servers, no uploads — your files never leave your device.

- ⚡ **WASM-Powered Performance**  
  Handles large HD packs smoothly with zero lag or freezing.

- 🧠 **AES-256-CFB8 Encryption**  
  Fully compatible with the Bedrock encryption standard.

- 🎨 **Premium UI/UX**  
  Clean glassmorphism design with smooth interactions.

---

## 🛠️ Tech Stack

| Layer        | Technology |
|--------------|-----------|
| **Frontend** | React 18, Vite, TailwindCSS v3 |
| **Engine**   | Go (compiled to WebAssembly) |
| **Processing** | Web Workers (multi-threaded, non-blocking) |

---

## ⚡ Quick Start

Get up and running in under a minute.

### 📦 Prerequisites

- Node.js (v18+)
- Go (v1.22+)

---

### 🔧 Setup

#### 1. Clone the repository
```bash
git clone https://github.com/exocubeyt/packshield.git
cd packshield
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Build the WebAssembly engine

**Windows**
```powershell
powershell -ExecutionPolicy Bypass -File .\build_wasm.ps1
```

**Linux / macOS**
```bash
./build_wasm.sh
```

#### 4. Start development server
```bash
npm run dev
```

Open the local URL shown in your terminal — you're ready to go.

---

## 🔐 Security

- Encryption keys are generated locally using:
  ```js
  crypto.getRandomValues()
  ```
- No keys or files are stored, logged, or transmitted.

> ⚠️ **Important:**  
> If you lose your encryption key, it **cannot be recovered**.

---

## 🌟 Support

If you like this project, consider giving it a ⭐  
It helps more than you think.
