const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

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
    console.log("No port set");
  } else {
    mainPort.write("<" + msg + ">" + "\n", (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Sent message - " + msg);
      }
    });
  }
}

module.exports = { getArduinoPort, getSerialPort, sendMessage };
