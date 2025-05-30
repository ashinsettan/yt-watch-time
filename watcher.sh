#!/bin/bash

# === COLORS ===
GREEN="\033[1;32m"
CYAN="\033[1;36m"
RED="\033[1;31m"
YELLOW="\033[1;33m"
NC="\033[0m" # No Color

# === CLEAR AND BANNER ===
clear
echo -e "${CYAN}"
echo "╔═══════════════════════════════════════════╗"
echo "║              YouTube Watch Hour           ║"
echo "║          by github.com/ashinsettan        ║"
echo "╚═══════════════════════════════════════════╝"
echo -e "${NC}"

# === PROMPTS ===
read -p "🔗 Enter YouTube Live URL: " VIDEO_URL
read -p "👥 Number of Watchers: " WATCHER_COUNT

# === DEPENDENCY CHECK ===
echo -e "${YELLOW}🔍 Checking dependencies...${NC}"
sudo apt update -y
sudo apt install -y curl wget unzip build-essential libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2 libx11-xcb1 libxss1 libgtk-3-0

# === NODE + NPM CHECK ===
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Installing Node.js...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# === PREPARE FOLDER ===
rm -rf watcher-yt
mkdir watcher-yt
cd watcher-yt
npm init -y > /dev/null
npm install puppeteer chalk inquirer axios > /dev/null

# === CREATE watcher.js ===
cat > watcher.js << 'EOF'
const puppeteer = require("puppeteer");
const axios = require("axios");
const fs = require("fs");
const chalk = require("chalk");

const url = process.env.YT_URL;
const watchers = parseInt(process.env.WATCHERS || "1");

const log = (msg) => {
  const time = new Date().toISOString();
  fs.appendFileSync("logs/run.log", `[${time}] ${msg}\n`);
  console.log(chalk.green(`[+] ${msg}`));
};

const fetchProxies = async () => {
  const res = await axios.get("https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=5000&country=all&ssl=all&anonymity=all");
  return res.data.trim().split("\n");
};

(async () => {
  if (!fs.existsSync("logs")) fs.mkdirSync("logs");
  const proxies = await fetchProxies();
  log(`Fetched ${proxies.length} proxies`);

  for (let i = 0; i < watchers; i++) {
    const proxy = proxies[i % proxies.length];
    const logFile = `logs/watcher-${i + 1}.log`;

    const env = {
      ...process.env,
      PROXY: proxy,
      INDEX: i + 1,
      VIDEO_URL: url,
    };

    const { spawn } = require("child_process");
    const child = spawn("node", ["watch.js"], {
      env,
      detached: true,
      stdio: ["ignore", fs.openSync(logFile, "a"), fs.openSync(logFile, "a")],
    });

    log(`Started watcher ${i + 1} with proxy ${proxy}`);
  }
})();
EOF

# === CREATE watch.js ===
cat > watch.js << 'EOF'
const puppeteer = require("puppeteer");

const url = process.env.VIDEO_URL;
const proxy = process.env.PROXY;
const index = process.env.INDEX;

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: proxy ? [`--proxy-server=${proxy}`] : [],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "load", timeout: 60000 });

    console.log(`Watcher ${index} is watching ${url} using ${proxy}`);
    await page.waitForTimeout(180000); // 3 mins
    await browser.close();
  } catch (err) {
    console.error(`Watcher ${index} failed: ${err.message}`);
  }
})();
EOF

# === CREATE LOG FOLDER ===
mkdir -p logs
echo "" > logs/run.log

# === EXPORT ENV & RUN ===
export YT_URL="$VIDEO_URL"
export WATCHERS="$WATCHER_COUNT"

echo -e "${GREEN}🚀 Starting ${WATCHER_COUNT} watchers for ${VIDEO_URL}${NC}"
node watcher.js

echo -e "${CYAN}📁 Logs are saved in watcher-yt/logs/${NC}"
