const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline')

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

function getSerialPort(portName, onData, baudRate = 9600) {
  const port = new SerialPort(portName, { baudRate });
  const parser = new Readline();
  port.pipe(parser);

  parser.on('data', onData);

  return port;
}

module.exports = { getArduinoPort, getSerialPort };
