const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const RUNNING_PIDS_FILE = path.join(__dirname, 'running_pids.json');

if (!fs.existsSync(RUNNING_PIDS_FILE)) {
  console.log(chalk.red('No running watchers found.'));
  process.exit(1);
}

const pids = JSON.parse(fs.readFileSync(RUNNING_PIDS_FILE, 'utf-8'));

console.log(chalk.yellow('Stopping watchers...'));

pids.forEach(pid => {
  try {
    process.kill(pid, 'SIGTERM');
    console.log(chalk.green(`Stopped watcher with PID ${pid}`));
  } catch (e) {
    console.log(chalk.red(`Failed to stop PID ${pid}: ${e.message}`));
  }
});

fs.unlinkSync(RUNNING_PIDS_FILE);
console.log(chalk.blue('All watchers stopped.'));
