import keys from './keyBindings.js';
import KeyProcessor from './keyProcessor.js';
import Calculator from './calculator.js';
import CalculatorProcessor from './calculatorProcessor.js';
import UiUpdater from './uiUpdater.js';
import LazyDoc from './lazyDocument.js';
import NumberScale from './numberDisplayScale.js';
import Templater from './templater.js';

const doc = new LazyDoc(document);
const calc = new LazyDoc(doc.node('#calculator'));
const numberDisplay = calc.node('#number-display');
const operatorDisplay = calc.node('#operator-display');
const alternateNumbers = calc.node('#alternate-numbers');
const numberDisplayText = new LazyDoc(numberDisplay).node('p');
const initNumberFontSize = window.getComputedStyle(numberDisplayText).fontSize.split('px')[0];
const calculator = new Calculator();
const UI = new UiUpdater(numberDisplayText, operatorDisplay, alternateNumbers, new Templater('div').addClass('alternate-number').node, keys.getKeyMap(), calculator);
const calculatorState = new CalculatorProcessor(UI, calculator);
const numberElements = calc.nodes('[id^="num-"].number');
const operatorElements = calc.nodes('[id^="oper-"].operator');
const decimalSign = calc.node('#decimal-sign');
const equalSign = calc.node('#equal-sign');
const deleteDigit = calc.node('#delete-digit');
const clearEntry = calc.node('#clear-entry');
const allClearEntry = calc.node('#all-clear-entry');
const copyClipboard = calc.node('#copy-clipboard');
const hideAlternateNumbers = calc.node('#hide-alternate-numbers');
const settings = doc.node('#settings');

const digitMap = {
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

const operatorMap = {
  'oper-plus': '+',
  'oper-minus': '-',
  'oper-multiply': '*',
  'oper-divide': '/',
  'oper-sqrt': '√',
}

const keyProcessor = new KeyProcessor(Object.values(digitMap), Object.values(operatorMap), calculatorState);

numberElements.forEach(number => {
  new LazyDoc(number).event('click', () => calculatorState.number(digitMap[number.id]));
});

operatorElements.forEach(operator => {
  new LazyDoc(operator).event('click', () => calculatorState.operator(operatorMap[operator.id]));
});

new LazyDoc(decimalSign).event('click', () => calculatorState.decimal());

new LazyDoc(equalSign).event('click', () => calculatorState.equal());

new LazyDoc(deleteDigit).event('click', () => calculatorState.delete());

new LazyDoc(clearEntry).event('click', () => calculatorState.clear());

new LazyDoc(allClearEntry).event('click', () => calculatorState.allClear());

let copying = false;
const showIcon = '';
const hideIcon = '';

new LazyDoc(hideAlternateNumbers).event('click', () => {
  if (hideAlternateNumbers.textContent === showIcon) {
    hideAlternateNumbers.textContent = hideIcon;
    alternateNumbers.classList.add('hide-alternate-numbers');
  } else {
    hideAlternateNumbers.textContent = showIcon;
    alternateNumbers.classList.remove('hide-alternate-numbers');
  }
});

new LazyDoc(copyClipboard).event('click', () => {
  const clipboardIcon = copyClipboard.textContent;
  navigator.clipboard.writeText(numberDisplayText.textContent);
  copyClipboard.replaceChildren('');

  if (!copying) {
    copying = true;

    setTimeout(() => {
      copying = false;
      copyClipboard.replaceChildren(clipboardIcon);
    }, 1500);
  }
});

const toggleDisabledAttribute = element => {
  if (element.getAttribute('disabled') !== null) {
    element.removeAttribute('disabled');
  } else {
    element.setAttribute('disabled', '');
  }
}

new LazyDoc(alternateNumbers).event('click', e => {
  const target = e.target.closest('.alternate-number');
  if (!target) return;

  const numberIndex = Array.prototype.indexOf.call(alternateNumbers.children, target);
  UI.updateActiveAlternateNumber(numberIndex);
  UI.updateAlternateNumbers(calculator.publicNumberStack);

  const editing = calculator.getEditMode();
  const shouldBeEditing = numberIndex !== 0;
  if (editing !== shouldBeEditing) {
    calculator.toggleEditMode();
    toggleDisabledAttribute(equalSign);
    toggleDisabledAttribute(allClearEntry);
    calc.get().classList.toggle('edit-mode');
  }

  calculator.setEditIndex(numberIndex);
  calculatorState.stdUpdateUI();
});

const decimalSettingsNode = new Templater('dialog').addClass('all-settings-container').addChild(new Templater('form').setAttribute('method', 'dialog').addChild(new Templater('h1').addText('Settings').node).addChild(new Templater('dl').addChild(new Templater('dt').addClass('settings-label').addText('How many decimals do you want?').node).addChild(new Templater('dd').addClass('settings-value').addChild(new Templater('input').setAttribute('type', 'number').setAttribute('id', 'decimal-places-input').setAttribute('min', '1').setAttribute('max', '100').setAttribute('value', '9').node).node).node).addChild(new Templater('button').addClass('submit-dialog-form').setAttribute('type', 'submit').addText('Submit').node).addChild(new Templater('div').addClass('close-dialog').addText('×').node).node).node;

let decimalSettingsAppended = false;
let setUpDecimalClose = false;
let setUpDecimalSubmit = false;

new LazyDoc(settings).event('click', () => {
  if (!decimalSettingsAppended) {
    decimalSettingsAppended = true;
    doc.get().body.appendChild(decimalSettingsNode);
  }

  decimalSettingsNode.showModal();

  if (!setUpDecimalClose && decimalSettingsAppended) {
    setUpDecimalClose = true;

    new LazyDoc(new LazyDoc(decimalSettingsNode).node('.close-dialog')).event('click', () => decimalSettingsNode.close());
  }
  if (!setUpDecimalSubmit && decimalSettingsAppended) {
    setUpDecimalSubmit = true;

    const submitButton = new LazyDoc(new LazyDoc(decimalSettingsNode).node('.submit-dialog-form'));
    submitButton.event('click', () => calculator.setScale(new LazyDoc(decimalSettingsNode).node('input#decimal-places-input').value));

  }
});


doc.event('keydown', e => {
  const keyResponse = keys.processKey(e.key, e.shiftKey, e.ctrlKey);

  keyResponse !== undefined && keyProcessor.process(keyResponse);
});

new NumberScale(numberDisplay, numberDisplayText, initNumberFontSize).start();
