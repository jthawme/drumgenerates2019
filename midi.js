const easymidi = require('easymidi');

function getInput() {
  return new Promise((resolve, reject) => {
    const inputs = easymidi.getInputs();

    console.log(inputs);

    const filterInput = v => {
      return v;
    };

    const inputName = inputs.find(filterInput);

    if (!inputName) {
      reject("No input");
    } else {
      resolve(new easymidi.Input(inputName));
    }
  });
}

function getOutput() {
  return new Promise((resolve, reject) => {
    const outputs = easymidi.getOutputs();

    const filterOutput = v => {
      return v;
    };

    const outputName = outputs.find(filterOutput);

    if (!outputName) {
      reject("No output");
    } else {
      resolve(new easymidi.Output(outputName));
    }
  });
}

function setMidiEventListeners(input, events) {
  Object.keys(events).forEach(evt => {
    input.on(evt, msg => events[evt](msg));
  });
}

function validateKey(keys, note) {
  return keys.includes(note);
}

module.exports = {
  getInput, getOutput, setMidiEventListeners, validateKey
};
