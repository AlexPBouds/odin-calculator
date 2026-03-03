/*
  *** TO-DO ***
  - Format answers
  - Implement positive/negative
  - Implement decimals
  - Implement keyboard support
*/

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
  const lastIndex = equationText.innerText.length - 1;
  let newEquation = "";
  if (isOperator(equationText.innerText[lastIndex])) {
    newEquation = equationText.innerText.slice(0, -2);
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

function addNumber(number) {
  // If equation is currently 0, replace it with the number
  if (equationText.innerText === "0") {
    equationText.innerText = `${number}`;
    return;
  }

  // If last character is an operator, add a space
  let newText = equationText.innerText;

  const lastIndex = equationText.innerText.length - 1;
  if (isOperator(equationText.innerText[lastIndex])) {
    newText = `${equationText.innerText} `;
  }

  // Don't add pointless 0's
  let operator = "";
  let operatorIndex = 0;
  let pointlessZero = false;
  for (let i = 0; i < equationText.innerText.length; i++) {
    if (isOperator(equationText.innerText[i])) {
      operator = equationText.innerText[i];
      operatorIndex = i;
      break;
    }
  }

  // If there is an operator, look at next number
  if (operator !== "") {
    let leftSideNumber = equationText.innerText.slice(
      operatorIndex + 1,
      equationText.innerText.length,
    );

    if (leftSideNumber.replaceAll(" ", "") === "0") {
      if (number === 0) {
        return;
      }

      newText = equationText.innerText.slice(0, -1);
    }
  }

  // Simply add the number

  equationText.innerText = `${newText}${number}`;

  // If adding a character would make make the div need to scroll
  // Then scroll to the left
  if (newText.length > 23) {
    autoScrollEquation();
  }
}

function addOperation(operation) {
  // Check if valid to place an operation
  if (!isValidOperation()) {
    return;
  }

  // If there's already an operation in the equation, operate first
  if (hasOperator()) {
    operate();
  }

  let newText = equationText.innerText;

  // Add the corresponding operation to equation
  switch (operation) {
    case "modulo":
      newText = `${newText} %`;
      equationText.innerText = newText;
      break;

    case "divide":
      equationText.innerText = `${newText} ÷`;
      break;

    case "multiply":
      equationText.innerText = `${newText} ×`;
      break;

    case "subtract":
      equationText.innerText = `${newText} -`;
      break;

    case "add":
      equationText.innerText = `${newText} +`;
      break;

    default:
      break;
  }

  console.log(equationText.innerText.length);

  // If adding a character would make make the div need to scroll
  // Then scroll to the left
  if (equationText.innerText.length > 23) {
    autoScrollEquation();
  }
}

function operate() {
  // Find the operator
  let operator = "";
  let operatorIndex = 0;
  let nextDigitIndex = 0;
  for (let i = 0; i < equationText.innerText.length; i++) {
    if (isOperator(equationText.innerText[i])) {
      operator = equationText.innerText[i];
      operatorIndex = i;
      nextDigitIndex = i + 2;
      break;
    }
  }

  // If no operator is found, simply display the number
  if (operator === "") {
    answerText.innerText = equationText.innerText;
    return;
  }

  // If we're dividing, make sure it's not by 0
  if (operator === "÷") {
    if (
      equationText.innerText[nextDigitIndex] === "0" &&
      nextDigitIndex === equationText.innerText.length - 1
    ) {
      answerText.innerText = "Can't divide by 0!";
      return;
    }
  }

  // Replace division/multiplication symbols
  switch (operator) {
    case "÷":
      equationText.innerText[operatorIndex] = "/";
      break;

    case "×":
      equationText.innerText[operatorIndex] = "*";
      break;

    default:
      break;
  }

  // Evaluate the equation
  let firstNumber = Number(equationText.innerText.slice(0, operatorIndex));
  let secondNumber = Number(
    equationText.innerText.slice(
      operatorIndex + 1,
      equationText.innerText.length,
    ),
  );

  let result = 0;

  switch (operator) {
    case "%":
      result = firstNumber % secondNumber;
      break;

    case "÷":
      result = firstNumber / secondNumber;
      break;

    case "×":
      result = firstNumber * secondNumber;
      break;

    case "-":
      result = firstNumber - secondNumber;
      break;

    case "+":
      result = firstNumber + secondNumber;
      break;

    default:
      break;
  }

  equationText.innerText = `${result}`;
  answerText.innerText = `${result}`;
}

function addDecimal() {
  console.log("This will add a decimal in the future");
}

function hasOperator() {
  for (let i = 0; i < equationText.innerText.length; i++) {
    if (isOperator(equationText.innerText[i])) {
      return true;
    }
  }

  return false;
}

function isOperator(char) {
  if (
    char === "%" ||
    char === "÷" ||
    char === "×" ||
    char === "-" ||
    char === "+" // ||
    //isSpace(char)
  ) {
    return true;
  }

  return false;
}

/*
function isSpace(char) {
  return / /.test(char);
}
*/

function autoScrollEquation() {
  equationText.scrollLeft = equationText.scrollWidth;
}

function isValidOperation() {
  const lastIndex = equationText.innerText.length - 1;

  if (
    equationText.innerText[lastIndex] === "." ||
    isOperator(equationText.innerText[lastIndex])
  ) {
    return false;
  }

  return true;
}

function formatNumber(number) {
  let string = number.toString();

  if (string.length > 12) {
    return number.toExponential(6);
  }

  return string;
}
