const { EVENT_MESSAGES, SPECIAL, log } = require("./constants");
const { getArduinoPort, getSerialPort, sendMessage } = require("./serial");
const { getInput, getOutput, setMidiEventListeners } = require("./midi");
const { play } = require("./instrument");
const { noteFromKeyOn, noteFromKeyOff, noteOff, noteOn } = require("./notes");

const START_KEY = 44;
const DIR_KEY = 46;

// Array to store the keys to play
let playing = false;

// Method for the midi note callback
function onNoteOn({ channel, note, velocity }) {
  noteFromKeyOn(note);

  if (START_KEY === note && !playing) {
    playing = true;
    sendMessage(SPECIAL.START);

    const stop = play(step => {
      noteOn(step);
      noteOff((step - 1 + 4) % 4);
    });

    setTimeout(() => {
      stop();
      playing = false;
    }, 2800);
  }

  if (DIR_KEY === note) {
    sendMessage(SPECIAL.DIR);
  }
}
// Method for the midi note callback
function onNoteOff({ channel, note, velocity }) {
  noteFromKeyOff(note);
}

// Callback for receiving serial data
function onSerialData(data) {
  log(data, EVENT_MESSAGES.SERIAL);
}

// Method callback for when the arduino tells us its ready
function onSerialReady(input) {
  log("Port open and ready", EVENT_MESSAGES.SERIAL);

  setMidiEventListeners(input, {
    noteon: onNoteOn,
    noteoff: onNoteOff
  });
}

Promise.all([
  getInput(), // Get the midi input
  getOutput(), // Get the midi output
  getArduinoPort() // Get the arduino serialport
])
  .then(([input, output, arduinoPort]) => {
    getSerialPort(arduinoPort.comName, onSerialData, () =>
      onSerialReady(input)
    );

    // Send an alive signal
    sendMessage(SPECIAL.ALIVE);

    log("Node / Midi / Serial comms ready");
  })
  .catch(err => log(err, EVENT_MESSAGES.ERROR));
