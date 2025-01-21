let currentInput = "";

function appendNumber(num) {
  currentInput += num;
  updateResult();
}

function appendOperator(operator) {
  if (currentInput && !isNaN(currentInput.slice(-1))) {
    currentInput += operator;
    updateResult();
  }
}

function appendDot() {
  if (!currentInput.includes(".") || /[+\-*/%]$/.test(currentInput)) {
    currentInput += ".";
    updateResult();
  }
}

function clearResult() {
  currentInput = "";
  updateResult();
}

function calculateResult() {
  try {
    currentInput = eval(currentInput.replace(/×/g, '*').replace(/÷/g, '/')).toString();
    updateResult();
  } catch (error) {
    currentInput = "Error";
    updateResult();
    setTimeout(() => {
      clearResult();
    }, 1500);
  }
}

function updateResult() {
  document.getElementById("result").value = currentInput;
}
