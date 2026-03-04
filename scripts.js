// ===============================
// Constants
// ===============================
const MAX_LENGTH_BEFORE_SCROLL = 23;
const MAX_LENGTH_DECIMAL = 15;
const MAX_EXPONENTIAL = 6;

const OPERATORS = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "×": (a, b) => a * b,
  "÷": (a, b) => a / b,
  "%": (a, b) => a % b,
};

// ===============================
// HTML Elements
// ===============================
const equationText = document.getElementsByClassName("equation")[0];
const answerText = document.getElementsByClassName("answer")[0];

// ===============================
// Event Listeners
// ===============================
equationText.addEventListener("wheel", (event) => {
  event.preventDefault();
  equationText.scrollLeft += event.deltaY;
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (key === " ") {
    event.preventDefault();
  }

  if (/^\d$/.test(key)) {
    addNumber(Number(key));
    return;
  }

  switch (key) {
    case "+":
      addOperation("+");
      return;

    case "-":
      addOperation("-");
      return;

    case "*":
      addOperation("×");
      return;

    case "/":
      event.preventDefault();
      addOperation("÷");
      return;

    case "%":
      addOperation("%");
      return;
  }

  if (key === ".") {
    addDecimal();
    return;
  }

  if (key === "Backspace") {
    event.preventDefault();
    backspace();
    return;
  }

  if (key === "Enter" || key === "=") {
    event.preventDefault();
    operate();
    return;
  }
});

// ===============================
// Core Functions
// ===============================
function backspace() {
  let text = getText();
  if (text === "0") return;

  const { left, operator, right } = parseEquation();

  if (!operator) {
    const newText = text.slice(0, -1);
    setText(newText === "" || newText === "-" ? "0" : newText);
    return;
  }

  if (!right) {
    setText(left);
    return;
  }

  const newRight = right.slice(0, -1);
  setText(
    newRight === "" || newRight === "-"
      ? `${left} ${operator}`
      : `${left} ${operator} ${newRight}`,
  );
}

function clearAll() {
  setText("0");
  answerText.innerText = "0";
}

function addNumber(number) {
  let text = getText();
  if (text === "0") {
    setText(String(number));
    return;
  }

  const { left, operator, right } = parseEquation();

  if (!operator) {
    setText(text + number);
    return;
  }

  if (right === "0") {
    if (number === 0) return;
    setText(`${left} ${operator} ${number}`);
    return;
  }

  if (right === "") {
    setText(`${text} ${number}`);
    return;
  }

  setText(text + number);
}

function addOperation(operation) {
  if (!isValidOperation()) {
    return;
  }

  if (hasOperator()) {
    operate();
  }

  setText(`${getText()} ${operation}`);
}

function operate() {
  const { left, operator, right } = parseEquation();

  if (!operator) {
    answerText.innerText = formatNumber(left);
    return;
  }

  if (operator && right === "") {
    setText(left);
    answerText.innerText = formatNumber(left);
    return;
  }

  if (operator === "÷" && Number(right) === 0) {
    answerText.innerText = "Can't divide by 0!";
    return;
  }

  const result = OPERATORS[operator](Number(left), Number(right));

  setText(String(result));
  answerText.innerText = formatNumber(result);
}

function addDecimal() {
  const { left, operator, right } = parseEquation();

  if (!operator) {
    if (!left.includes(".")) {
      setText(getText() + ".");
    }

    return;
  }

  if (!right.includes(".")) {
    if (right === "") {
      setText(`${left} ${operator} 0.`);
    } else {
      setText(getText() + ".");
    }
  }
}

function toggleSign() {
  const { left, operator, right } = parseEquation();

  if (!operator) {
    setText(left.startsWith("-") ? left.slice(1) : `-${left}`);
    return;
  }

  if (!right) {
    setText(`${left} ${operator} -0`);
    return;
  }

  const toggled = right.startsWith("-") ? right.slice(1) : `-${right}`;

  setText(`${left} ${operator} ${toggled}`);
}

// ===============================
// Utilities
// ===============================
function getText() {
  return equationText.innerText;
}

function setText(text) {
  equationText.innerText = text;
  if (text.length > MAX_LENGTH_BEFORE_SCROLL) {
    autoScrollEquation();
  }
}

function parseEquation() {
  const text = getText().trim();

  for (let i = 0; i < text.length; i++) {
    if (isOperator(text[i], i)) {
      return {
        left: text.slice(0, i).trim(),
        operator: text[i],
        right: text.slice(i + 1).trim(),
        operatorIndex: i,
      };
    }
  }

  // If we don't find an operator, we only have a left
  return {
    left: text,
    operator: "",
    right: "",
    operatorIndex: -1,
  };
}

function hasOperator() {
  return parseEquation().operator !== "";
}

function isOperator(char, index = -1) {
  return (
    char === "%" ||
    char === "÷" ||
    char === "×" ||
    char === "+" ||
    (char === "-" && index !== 0)
  );
}

function autoScrollEquation() {
  equationText.scrollLeft = equationText.scrollWidth;
}

function isValidOperation() {
  const text = getText();
  const lastChar = text[text.length - 1];

  return !(lastChar === "." || isOperator(lastChar));
}

// ===============================
// Formatting
// ===============================
function formatNumber(number) {
  // Make sure the number is a valid number
  number = Number(number);
  if (isNaN(number)) {
    return number;
  }

  if (!Number.isInteger(number)) {
    return limitDecimalLength(number, MAX_LENGTH_DECIMAL);
  }

  const string = number.toString();
  if (string.length > MAX_LENGTH_DECIMAL) {
    return number.toExponential(MAX_EXPONENTIAL);
  }

  return string;
}

function limitDecimalLength(number, maxLength) {
  let string = number.toString();

  if (!string.includes(".")) return number;
  if (string.length <= maxLength) return number;

  const integerLength = string.split(".")[0].length;
  const allowedDecimals = Math.max(maxLength - integerLength - 1, 0);

  return Number(number.toFixed(allowedDecimals));
}
