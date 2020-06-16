const { sendMessage } = require("./serial");
const { validateKey } = require("./midi");

const KEYS = [35, 36, 42, 39, 37, 38, 46, 44];
const THROTTLE_TIME = 20;

let notesOnList = [];
let notesOffList = [];

let reportTimer = null;

function noteFromKeyOn(note) {
  if (!validateKey(KEYS, note)) {
    return;
  }

  const noteIndex = KEYS.indexOf(note);

  if (noteIndex >= 0) {
    noteOn(noteIndex);
  }
}

function noteFromKeyOff(note) {
  if (!validateKey(KEYS, note)) {
    return;
  }

  const noteIndex = KEYS.indexOf(note);

  if (noteIndex >= 0) {
    noteOff(noteIndex);
  }
}

function noteOn(numIdx) {
  if (notesOnList.indexOf(numIdx) < 0) {
    notesOnList.push(numIdx);
    reportNotes();
  }
}

function noteOff(numIdx) {
  if (notesOffList.indexOf(numIdx) < 0) {
    notesOffList.push(numIdx);
    reportNotes();
  }
}

function reportNotes() {
  if (reportTimer !== null) {
    return;
  }

  reportTimer = setTimeout(() => {
    const notesList = [
      notesOnList.map(n => `${n}1`),
      notesOffList.map(n => `${n}0`)
    ].flat();

    sendMessage(notesList.join(","));

    notesOnList = [];
    notesOffList = [];

    reportTimer = null;
  }, THROTTLE_TIME);
}

module.exports = {
  noteOn,
  noteOff,
  noteFromKeyOn,
  noteFromKeyOff
};
