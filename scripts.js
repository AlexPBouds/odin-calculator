// HTML Elements
const equationText = document.getElementsByClassName("equation")[0];
const answerText = document.getElementsByClassName("answer")[0];

// Event Listeners
equationText.addEventListener("wheel", (event) => {
  event.preventDefault();
  equationText.scrollLeft += event.deltaY;
});

// Functions
function backspace() {
  // If equation is currently 0, do nothing
  if (equationText.innerText === "0") {
    return;
  }

  // If equation is currently a single digit, set to 0
  if (
    Number.isInteger(Number(equationText.innerText)) &&
    Number(equationText.innerText) < 10
  ) {
    equationText.innerText = "0";
    return;
  }

  // If last value in string is a space, remove the operator
  let lastIndex = equationText.innerText.length - 1;
  let newEquation = "";
  if (isSpace(equationText.innerText[lastIndex])) {
    newEquation = equationText.innerText.slice(0, -3);
    equationText.innerText = newEquation;
    return;
  }

  // Remove the last value of the string
  newEquation = equationText.innerText.slice(0, -1);
  equationText.innerText = newEquation;
}

function clearAll() {
  equationText.innerText = "0";
  answerText.innerText = "0";
}

function modulo() {
  console.log("Will add the modulo operator to the equation");
}

function addNumber(number) {
  // If equation is currently 0, replace it with the number
  if (equationText.innerText === "0") {
    equationText.innerText = `${number}`;
    return;
  }

  // Simply add the number
  const newText = `${equationText.innerText}${number}`;
  equationText.innerText = newText;

  // If adding a character would make make the div need to scroll
  // Then scroll to the left
  if (newText.length > 23) {
    autoScrollEquation();
  }
}

function addOperation(operation) {
  console.log("Will add the operator to the equation");
}

function operate() {
  console.log("Will calculate the result of the equation and display it");
}

function isSpace(char) {
  return / /.test(char);
}

function autoScrollEquation() {
  equationText.scrollLeft = equationText.scrollWidth;
}
