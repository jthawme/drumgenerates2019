const { getArduinoPort, getSerialPort, sendMessage } = require('./serial');
const { getInput, getOutput, setMidiEventListeners, validateKey } = require('./midi');


// Tracks all the midi notes
const KEYS = [60,62,64,65,67,69,71,72];


// Array to store the keys to play
let notes = [];


// Method for the midi note callback
function onNoteOn({ channel, note, velocity}) {

  // Basically checks its a valid key that we're watching
  if (validateKey(KEYS, note)) {
    const noteIndex = KEYS.indexOf(note);

    // If its not in the array already, add to it
    if (notes.indexOf(noteIndex) < 0) {
      notes.push(noteIndex);
    }
  }
}



function onSerialData(data) {
  console.log("here", data);
}


// Method callback for when the arduino tells us its ready
function onSerialReady(input) {
  console.log("Port open and ready");

  setMidiEventListeners(input, {
    noteon: onNoteOn
  });
}

Promise.all([
  getInput(), // Get the midi input
  getOutput(), // Get the midi output
  getArduinoPort() // Get the arduino serialport
])
  .then(([ input, output, arduinoPort ]) => {
    getSerialPort(
      arduinoPort.comName,
      onSerialData,
      () => onSerialReady(input)
    );

    // Start a loop to throttle sending the notes
    setInterval(() => {
      if (notes.length) {
        sendMessage(notes.join(','));
        notes = [];
      }
    }, 50);
  });
