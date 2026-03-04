/*
  *** TO-DO ***
  - Implement positive/negative
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
    if (isOperator(equationText.innerText[i], i)) {
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
    if (isOperator(equationText.innerText[i], i)) {
      operator = equationText.innerText[i];
      operatorIndex = i;
      nextDigitIndex = i + 2;
      break;
    }
  }

  // If no operator is found, simply display the number
  if (operator === "") {
    answerText.innerText = formatNumber(equationText.innerText);
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
  answerText.innerText = `${formatNumber(result)}`;
}

function addDecimal() {
  // Divide into left and right portions of the equation
  let operator = "";
  let leftSide = "";
  let leftSideDecimal = false;
  let rightSide = "";
  let rightSideDecimal = false;

  for (let i = 0; i < equationText.innerText.length; i++) {
    if (isOperator(equationText.innerText[i], i)) {
      operator = equationText.innerText[i];
    } else if (operator === "") {
      if (equationText.innerText[i] === ".") {
        leftSideDecimal = true;
      }

      leftSide += equationText.innerText[i];
    } else {
      if (equationText.innerText[i] === ".") {
        rightSideDecimal = true;
      }

      rightSide += equationText.innerText[i];
    }
  }

  // If left side and no decimal, add decimal
  if (operator === "" && leftSideDecimal === false) {
    newText = equationText.innerText;
    equationText.innerText = `${newText}.`;

    if (equationText.innerText.length > 23) {
      autoScrollEquation();
    }
    return;
  }

  // If right side and no decimal, add decimal
  if (operator !== "" && rightSideDecimal === false) {
    newText = equationText.innerText;

    // If no values yet on right side, add a 0
    if (rightSide === "") {
      newText += " 0";
    }

    equationText.innerText = `${newText}.`;

    if (equationText.innerText.length > 23) {
      autoScrollEquation();
    }
    return;
  }
}

function toggleSign() {}

function hasOperator() {
  for (let i = 0; i < equationText.innerText.length; i++) {
    if (isOperator(equationText.innerText[i], i)) {
      return true;
    }
  }

  return false;
}

function isOperator(char, index = -1) {
  if (
    char === "%" ||
    char === "÷" ||
    char === "×" ||
    (char === "-" && index !== 0) ||
    char === "+" // ||
    //isSpace(char)
  ) {
    return true;
  }

  return false;
}

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
  // Make sure the number is a valid number
  number = Number(number);
  if (isNaN(number)) {
    return number;
  }

  // Convert number to a string
  let string = number.toString();

  //

  if (!Number.isInteger(number)) {
    return limitDecimalLength(number, 15);
  }

  if (string.length > 15) {
    return number.toExponential(6);
  }

  return string;
}

function limitDecimalLength(number, maxTotalLength) {
  let string = number.toString();

  if (!string.includes(".")) return number;

  if (string.length <= maxTotalLength) return number;

  const integerLength = string.split(".")[0].length;
  const allowedDecimals = Math.max(maxTotalLength - integerLength - 1, 0);

  return Number(number.toFixed(allowedDecimals));
}
