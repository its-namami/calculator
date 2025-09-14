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
import { keyBindings, keyCheck } from './keybindings.js';
// Add keyBindings global registry of used keys
// And don't allow to add new values at low level - through using const
import Calculator from './calculator.js';
// Separate the UI-Displaying logic from the actual calculator
// Maybe even dynamically create new calculator directly in JS
import regionalSymbols from './symbols.js';
// I want to convert numbers to real words 
// This should be done by having "verbose" and "normal" mode
// and obviously auto insert the regional symbols
//////////
// Remove this later!!!
window.Calculator = Calculator;
//////////
const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.operator');
const decimalSign = document.querySelector('#decimal-sign');
const equalSign = document.querySelector('#equal-sign');
const deleteDigit = document.querySelector('#delete-digit');
const clearEntry = document.querySelector('#clear-entry');
const clearAll = document.querySelector('#clear-all');
const numberSymbol = {
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

const calculatorOperator = {
  'equal-sign': '=',
  'oper-plus': '+',
  'oper-minus': '-',
  'oper-multiply': '*',
  'oper-divide': '/',
  'oper-sqrt': '√',
}

const addOperator = function(operatorID) {
  // TODO: implement NEGATE - here or in calculator?
  // if (Calculator.operator === '' && Calculator.numberOne.replace('-', '') === '') {
  //   if (operatorID === 'oper-minus') {
  //     Calculator.numberOne = '-';
  //   }
  // } else {
    Calculator.addOperator(calculatorOperator[operatorID]);
  // }
}

numbers.forEach(number => {
  number.addEventListener('click', () => {
    Calculator.addNumber(numberSymbol[number.id]);
  });
});

operators.forEach(operator => {
  operator.addEventListener('click', () => {
    addOperator(operator.id);
  });
});

decimalSign.addEventListener('click', () => {
  Calculator.conditionalAddDecimalSign();
});

equalSign.addEventListener('click', () => {
  Calculator.calculate();
});

deleteDigit.addEventListener('click', () => {
  Calculator.removeLastDigit();
});

clearEntry.addEventListener('click', () => {
  Calculator.resetAll();
});

// TO-DO:
// clearAll - once I got history


document.addEventListener('keydown', e => {
  keyCheck(e)
});
