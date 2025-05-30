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
