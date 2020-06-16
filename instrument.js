const StepSequencer = require("step-sequencer");

// Instantiate a new StepSequencer object
var tempo = 160;
var division = 4;
var sequence = [0, 1, 2, 3];
var stepSequencer = new StepSequencer(tempo, division, sequence);

// The StepSequencer emits the number of
// the step when that step is to be played

const getNotes = () =>
  new Array(6)
    .fill(0)
    .map((v, i) => i)
    .filter(() => Math.random() > 0.5);

const play = cb => {
  stepSequencer
    .on("0", function(step) {
      cb(step);
    })
    .on("1", function(step) {
      cb(step);
    })
    .on("2", function(step) {
      cb(step);
    })
    .on("3", function(step) {
      cb(step);
    });

  // Begin playing the sequence
  stepSequencer.play();

  return () => stepSequencer.stop();
};

module.exports = { play };
