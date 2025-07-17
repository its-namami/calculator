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
import calculator from './calculator.js';
// Separate the UI-Displaying logic from the actual calculator
// Maybe even dynamically create new calculator directly in JS
import regionalSymbols from './symbols.js';
// I want to convert numbers to real words 
// This should be done by having "verbose" and "normal" mode
// and obviously auto insert the regional symbols
//////////
// Remove this later!!!
window.calculator = calculator;
//////////
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


document.addEventListener('keydown', e => {
  // old
  // keyCheck(e, keyBindings)
  // new
  keyCheck(e)
});
