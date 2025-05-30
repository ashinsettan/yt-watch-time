# 🎥 YouTube Watcher Bot | Premium Watch Hour Booster via Proxies

Boost your **YouTube watch time** using a custom-built, proxy-powered watcher system! Automatically spawns multiple headless browser instances via Puppeteer, each simulating a real viewer from different IPs.

> ⚠️ **Educational Use Only** – Use responsibly. You are fully liable for your actions.

---

## 💡 Features

- 🔁 Supports auto-replay
- 🌐 Free proxy rotation
- 🧠 Headless Chromium viewers (via Puppeteer)
- 📊 Real-time logs in `logs/` folder
- 🛠 Single bash launch (`watcher.sh`)
- ❌ One-command shutdown (`stop.sh`)

---

## 🧰 Prerequisites

Run on **Ubuntu 20.04 or later VPS**

Recommended specs:
- RAM: 2GB+  
- Storage: 10GB+  
- Network: Good speed for streaming

---

## 📥 Installation & Setup

```bash
# Clone the repo
https://github.com/ashinsettan/yt-watch-time.git
cd yt-watcher

# Make scripts executable
chmod +x watcher.sh stop.sh

# Run initial setup
./watcher.sh
