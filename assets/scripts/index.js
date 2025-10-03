// To-Do: add BigInt support (or at least do something with scientific notation!)
// Current Problem: when a number gets large enough, and a user tries to add
// Number to this scientific notation, it gets broken (2+e10 and user adds 2
// -> becomes 2+e102)
///////////
// Idea: Make vim keyboard with changable layout by using A or I as input
// It should look like normal calculator tile but with focus on current
// tile you moved with H, J, K or L. Maybe also add arrow keys.
///////////
// Idea: when a user presses '?' a helper window comes up with current
// keybinds. Should also be accessible through an icon on the website.
// Or navigation, whatever sounds more fun.
import Keybindings from './keybindings.js';
// Add keyBindings global registry of used keys
// And don't allow to add new values at low level - through using const
import Calculator from './calculator.js';
// Separate the UI-Displaying logic from the actual calculator
// Maybe even dynamically create new calculator directly in JS
import regionalSymbols from './symbols.js';
// I want to convert numbers to real words 
// This should be done by having "verbose" and "normal" mode
// and obviously auto insert the regional symbols
import UI_Class from './ui.js';
//////////
const UI = new UI_Class(...(Array.from(document.querySelector('#results-wrap').children)));
const calculator = new Calculator();
// Remove this later!!!
window.ui = UI;
window.calculator = calculator;
//////////
const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.operator');
const decimalSign = document.querySelector('#decimal-sign');
const equalSign = document.querySelector('#equal-sign');
const deleteDigit = document.querySelector('#delete-digit');
const clearEntry = document.querySelector('#clear-entry');
const clearAll = document.querySelector('#clear-all');
const getNumberFromID = {
  'num-1': '1',
  'num-2': '2',
  'num-3': '3',
  'num-4': '4',
  'num-5': '5',
  'num-6': '6',
  'num-7': '7',
  'num-8': '8',
  'num-9': '9',
  'num-0': '0',
}

const getOperatorFromID = {
  'equal-sign': '=',
  'oper-plus': '+',
  'oper-minus': '-',
  'oper-multiply': '*',
  'oper-divide': '/',
  'oper-sqrt': '√',
}

const addOperator = function(operator) {
    calculator.addOperator(operator);
}

numbers.forEach(number => {
  number.addEventListener('click', () => {
    calculator.addNumber(getNumberFromID[number.id]);
    UI.updateNumber(calculator.currentNumber);
  });
});

operators.forEach(operator => {
  operator.addEventListener('click', () => {
    addOperator(getOperatorFromID[operator.id]);
    UI.updateOperator(calculator.currentOperator);
  });
});

decimalSign.addEventListener('click', () => {
  calculator.conditionalAddDecimalSign();
});

equalSign.addEventListener('click', () => {
  calculator.calculate();
  UI.updateNumber(calculator.currentNumber);
  UI.updateOperator(calculator.currentOperator);
});

deleteDigit.addEventListener('click', () => {
  calculator.removeLastDigit();
});

clearEntry.addEventListener('click', () => {
  calculator.resetAll();
});

const processKeyResponse = () => { // keymap to controller interface
  // TO-DO: implement
}

// TO-DO: fix keybindings module and implement interface
// document.addEventListener('keydown', e => {
//   const response = keyCheck(e);
//   processKeyResponse(response);
// });
