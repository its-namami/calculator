import keyBinds from './keybinds.js';
// Add keyBinds global registry of used keys
// And don't allow to add new values at low level - through using const
import calculator from './calculator.js';
// Separate the UI-Displaying logic from the actual calculator
// Maybe even dynamically create new calculator directly in JS
const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.operator');
const decimalSign = document.querySelector('#decimal-sign');
const equalSign = document.querySelector('#equal-sign');
const deleteDigit = document.querySelector('#delete-digit');
const clearEntry = document.querySelector('#clear-entry');
const clearAll = document.querySelector('#clear-all');

numbers.forEach(number => {
  number.addEventListener('click', () => {
    calculator.addNumber(number.textContent);
  });
});

operators.forEach(operator => {
  operator.addEventListener('click', () => {
    if (calculator.operator === undefined) {
      if (calculator.number1 === '' && operator.id === 'oper-minus') calculator.addNumber('-');
      else calculator.addOperator(operator.id);
    } else {
      calculator.calculate();
      calculator.addOperator(operator.id);
    }
  });
});

decimalSign.addEventListener('click', () => {
  calculator.addDecimalSign();
});

equalSign.addEventListener('click', () => {
  calculator.calculate();
});

deleteDigit.addEventListener('click', () => {
  calculator.deleteLastDigit();
});

clearEntry.addEventListener('click', () => {
  calculator.reset();
});

// TO-DO:
// clearAll - once I got history
