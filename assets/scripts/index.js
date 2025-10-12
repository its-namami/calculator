import keys from './keybindings.js';
import Calculator from './calculator.js';
import UiUpdater from './uiUpdater.js';
import LazyDoc from './lazyDocument.js';

const doc = new LazyDoc(document); // move near other "new" objects.
const numberDisplay = doc.node('#number-display');
const numberDisplayText = new LazyDoc(numberDisplay).node('p');
const initNumberFontSize = window.getComputedStyle(numberDisplayText).fontSize.split('px')[0];

const decreaseFont = () => {
  const scale = numberDisplay.scrollWidth / numberDisplay.clientWidth;
  const fontSize = (numberDisplayText.style?.fontSize?.split('px')[0]) || initNumberFontSize;
  const newFontSize = Math.max(fontSize / scale, initNumberFontSize / 3);
  numberDisplayText.style.fontSize = newFontSize + 'px';
}

const increaseFont = () => {
  const scale = numberDisplay.clientWidth / numberDisplayText.clientWidth;
  const fontSize = numberDisplayText.style.fontSize?.split('px')[0] || initNumberFontSize;
  const newFontSize = Math.min(fontSize * scale, initNumberFontSize);
  numberDisplayText.style.fontSize = newFontSize + 'px';
}

new ResizeObserver(() => {
  const difference = numberDisplay.scrollWidth - numberDisplay.clientWidth;
  const scale = numberDisplay.scrollWidth / numberDisplay.clientWidth;

  if (difference > 0) {
    decreaseFont();
  } else if (difference === 0) {
    increaseFont();
  }
}).observe(numberDisplayText);

const operatorDisplay = doc.node('#operator-display');
const numberElements = doc.nodes('[id^="num-"].number');
const operatorElements = doc.nodes('[id^="oper-"].operator');
const decimalSign = doc.node('#decimal-sign');
const equalSign = doc.node('#equal-sign');
const deleteDigit = doc.node('#delete-digit');
const clearEntry = doc.node('#clear-entry');
const calculator = new Calculator();
const UI = new UiUpdater(numberDisplayText, operatorDisplay, keys.getKeyMap());

const numberIdToDigit = {
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

const operatorIdToSign = {
  'equal-sign': '=',
  'oper-plus': '+',
  'oper-minus': '-',
  'oper-multiply': '*',
  'oper-divide': '/',
  'oper-sqrt': '√',
}

const digits = Object.values(numberIdToDigit);
const operators = Object.values(operatorIdToSign);

const stdUpdateUI = () => {
    UI.updateNumber(calculator.currentNumber ?? '');
    UI.updateOperator(calculator.currentOperator ?? '');
}

const addUpdateNumber = number => {
    calculator.addNumber(number);
    UI.updateNumber(calculator.currentNumber);
}

const addUpdateOperator = operator => {
    calculator.addOperator(operator);
    UI.updateNumber(calculator.previousNumber);
    UI.updateOperator(calculator.currentOperator);
}

const addUpdateDecimal = () => {
  calculator.conditionalAddDecimalSign();
  UI.updateNumber(calculator.currentNumber);
}

const addUpdateEqual = () => {
  calculator.calculate();
  stdUpdateUI()
}

const addUpdateDelete = () => {
  calculator.deleteCharacter();
  stdUpdateUI()
}

const addUpdateClear = () => {
  calculator.resetAll();
  stdUpdateUI()
}

numberElements.forEach(number => {
  number.addEventListener('click', () => {
    addUpdateNumber(numberIdToDigit[number.id]);
  });
});

operatorElements.forEach(operator => {
  operator.addEventListener('click', () => {
    addUpdateOperator(operatorIdToSign[operator.id]);
  });
});

decimalSign.addEventListener('click', () => {
  addUpdateDecimal();
});

equalSign.addEventListener('click', () => {
  addUpdateEqual();
});

deleteDigit.addEventListener('click', () => {
  addUpdateDelete();
});

clearEntry.addEventListener('click', () => {
  addUpdateClear();
});

const handleUniqueResponse = response => {
  switch (response) {
    case '=':
      addUpdateEqual();
      break;
    case '.':
      addUpdateDecimal();
      break;
    case 'delete':
      addUpdateDelete();
      break;
    case 'clear':
      addUpdateClear();
      break;
    default:
      throw new Error(`The ${response} is not a handled case!`);
      break;
  }
}

const processKey = response => {
  if (digits.includes(response)) {
    addUpdateNumber(response);
  } else if (operators.includes(response)) {
    addUpdateOperator(response);
  } else {
    handleUniqueResponse(response);
  }
}

doc.event('keydown', e => {
  const keyResponse = keys.keyProcessor(e.key, e.shiftKey, e.ctrlKey);

  keyResponse !== undefined && processKey(keyResponse);
});
