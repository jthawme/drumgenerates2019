const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const { EVENT_MESSAGES, log } = require('./constants');

let mainPort;

function getArduinoPort() {
  return new Promise((resolve, reject) => {
    SerialPort.list((err, ports) => {
      // console.log(ports);
      const port = ports.find(p => {
        return p.manufacturer && p.manufacturer.toLowerCase().includes('arduino');
      });

      if (port) {
        resolve(port);
      } else {
        reject('No arduino connected');
      }
    })
  });
}

function getSerialPort(portName, onData, onReady, baudRate = 9600) {
  mainPort = new SerialPort(portName, { baudRate });
  const parser = new Readline();

  let ready = false;

  mainPort.pipe(parser);
  parser.on('data', data => {
    if (!ready) {
      ready = true;
      onReady();
    }
    else {
      onData(data);
    }
  });

  return mainPort;
}

function sendMessage(msg) {
  if (!mainPort) {
    log("No port set", EVENT_MESSAGES.ERROR);
  } else {
    mainPort.write("<" + msg + ">" + "\n", (err) => {
      if (err) {
        log(err, EVENT_MESSAGES.ERROR);
      } else {
        log(`Sent message (${ msg })`, EVENT_MESSAGES.SERIAL);
      }
    });
  }
}

module.exports = { getArduinoPort, getSerialPort, sendMessage };
