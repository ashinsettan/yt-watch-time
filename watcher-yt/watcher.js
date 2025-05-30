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
