const chalk = require('chalk');

const EVENT_MESSAGES = {
  SERIAL: chalk.yellow('SERIAL: '),
  DEFAULT: chalk.green('MSG: '),
  ERROR: chalk.bgRed('ERR: '),
}

const SPECIAL = {
  START: '98',
  ALIVE: '99',
};

// Helper for logging
const log = (msg, event = EVENT_MESSAGES.DEFAULT) => {
  console.log([event, msg].join(''));
}

module.exports = { EVENT_MESSAGES, SPECIAL, log };
