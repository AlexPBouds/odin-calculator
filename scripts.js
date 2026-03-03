// HTML Elements
const equationText = document.getElementsByClassName("equation")[0];
const answerText = document.getElementsByClassName("answer")[0];

// Functions
function backspace() {
  console.log("Will remove a digit or operation from the equation");
}

function clearAll() {
  equationText.innerText = "0";
  answerText.innerText = "0";
}

function modulo() {
  console.log("Will add the modulo operator to the equation");
}

function addNumber(number) {
  console.log("Will add the number to the equation");
}

function addOperation() {
  console.log("Will add the operator to the equation");
}

function operate() {
  console.log("Will calculate the result of the equation and display it");
}
