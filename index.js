const { EVENT_MESSAGES, SPECIAL, log } = require('./constants');
const { getArduinoPort, getSerialPort, sendMessage } = require('./serial');
const { getInput, getOutput, setMidiEventListeners, validateKey } = require('./midi');


// Tracks all the midi notes
// const KEYS = [48,50,52,53,55,57,59,60,62,64,65,67];

// LPD8
const KEYS = [35,36,42,39,37,38,46,44];

const START_KEY = 44;


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

  if (START_KEY === note) {
    sendMessage(SPECIAL.START);
  }
}


// Callback for receiving serial data
function onSerialData(data) {
  log(data, EVENT_MESSAGES.SERIAL);
}


// Method callback for when the arduino tells us its ready
function onSerialReady(input) {
  log("Port open and ready", EVENT_MESSAGES.SERIAL);

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

    // Send an alive signal
    sendMessage(SPECIAL.ALIVE);

    // Start a loop to throttle sending the notes
    setInterval(() => {
      if (notes.length) {
        sendMessage(notes.join(','));
        notes = [];
      }
    }, 50);

    log("Node / Midi / Serial comms ready");
  })
  .catch(err => log(err, EVENT_MESSAGES.ERROR))
