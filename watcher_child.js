const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const [,, url, proxy] = process.argv;

const LOG_DIR = path.join(__dirname, 'logs');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

const watcherId = process.pid;
const logFile = path.join(LOG_DIR, `watcher_${watcherId}.log`);

function logToFile(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

(async () => {
  logToFile(chalk.blue(`Watcher PID ${watcherId} started for ${url} using proxy: ${proxy || 'none'}`));
  try {
    const args = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu',
    ];

    if(proxy && proxy !== '') {
      args.push(`--proxy-server=http://${proxy}`);
    }

    const browser = await puppeteer.launch({
      headless: true,
      args,
      ignoreDefaultArgs: ['--mute-audio'],
    });

    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(url, { waitUntil: 'networkidle2' });
    logToFile('Page loaded.');

    await page.evaluate(() => {
      const video = document.querySelector('video');
      if(!video) {
        window.logMessage('Error: No video element found!');
        return;
      }
      video.muted = true;
      video.play();
      video.addEventListener('ended', () => {
        video.currentTime = 0;
        video.play();
      });
      video.addEventListener('pause', () => {
        video.play();
      });
    });

    while(true) {
      logToFile('Watcher running...');
      await sleep(300000);
    }

  } catch (err) {
    logToFile(chalk.red(`Error: ${err.message}`));
  }
})();
