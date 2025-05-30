# 🎥 YouTube Watcher Bot | Premium Proxy-Based Watch Hour Booster

Welcome to the **YouTube Watcher Bot** – a high-performance, proxy-rotating system designed to boost **watch hours** by simulating multiple viewers using headless Chromium browsers via Puppeteer and random proxies.

> ⚠️ For **educational purposes only**. Any misuse of this script is at your own risk.

---

## 🚀 Features

- 💻 Launch up to 1000 headless browser viewers.
- 🌐 Automatically fetch and rotate free proxies.
- 🔁 Auto-replay when video ends.
- 📊 Logs per watcher instance.
- 🎯 Lightweight bash script installer.
- 🧱 Puppeteer-based viewer launcher (Node.js).
- ✅ Proxy support (HTTP/SOCKS5).
- 📂 Logs neatly stored in the `logs/` folder.
- ❌ Stop watchers with one command.

---

## 📦 Setup Instructions

### ⚙️ Prerequisites

Run on a **fresh Ubuntu 20.04+ VPS** with at least **1GB RAM**. Recommended: **Google Cloud, AWS, Oracle, Hetzner** VPS.

### 📁 Clone the Project

```bash
git clone https://github.com/yourusername/yt-watcher.git
cd yt-watcher
chmod +x watcher.hs
