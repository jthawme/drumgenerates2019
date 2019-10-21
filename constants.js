const chalk = require('chalk');

const EVENT_MESSAGES = {
  SERIAL: chalk.yellow('SERIAL: '),
  DEFAULT: chalk.green('MSG: '),
  ERROR: chalk.bgRed('ERR: '),
}

// Helper for logging
const log = (msg, event = EVENT_MESSAGES.DEFAULT) => {
  console.log([event, msg].join(''));
}

module.exports = { EVENT_MESSAGES, log };
