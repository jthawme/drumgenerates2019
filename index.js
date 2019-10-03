const { getArduinoPort, getSerialPort } = require('./serial');
const { getInput, getOutput, setMidiEventListeners, validateKey } = require('./midi');

const KEYS = [53, 57, 60];

function onNoteOn({ channel, note, velocity, ...props}) {
  if (validateKey(KEYS, note)) {
    const noteIndex = KEYS.indexOf(note);
  }
}

function onSerialData(data) {

}

Promise.all([
  getInput(),
  getOutput(),
  getArduinoPort()
])
  .then(([ input, output, arduinoPort ]) => {
    setMidiEventListeners(input, {
      noteon: onNoteOn
    });

    const serialPort = getSerialPort(arduinoPort.comName, onSerialData);

    console.log(serialPort);
  });
