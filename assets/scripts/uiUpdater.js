import Doc from './lazyDocument.js';

export default class UiUpdater {
  #numberElement;
  #operatorElement;
  #alternateNumbers;
  #alternateNumbersSelector
  #alternateNumberTemplate;
  #activeAlternateNumber;
  #keymap;
  #operatorMap = {
    '/': '÷',
    '*': '×',
  };

  constructor(numberElement, operatorElement, alternateNumbers, alternateNumberTemplate, keymap) {
    this.#numberElement = numberElement;
    this.#operatorElement = operatorElement;
    this.#alternateNumbers = alternateNumbers;
    this.#alternateNumberTemplate = alternateNumberTemplate.cloneNode(true);
    this.#keymap = keymap;

    this.#alternateNumbersSelector = new Doc(this.#alternateNumbers);
    alternateNumberTemplate.remove();
  }

  makeAlternateNumber(number = '', active = false) {
    const newNumber = this.#alternateNumberTemplate.cloneNode(true);
    newNumber.textContent = number.toString();
    if (active) newNumber.classList.add('active');

    return newNumber;
  }

  updateActiveAlternateNumber(number = 0) {
    this.#activeAlternateNumber = number;
  }

  updateAlternateNumbers(numbersArray) {
    const alternateNumbers = numbersArray.filter(number => number !== '').map(number => this.makeAlternateNumber(number));

    if (alternateNumbers.length > 1) {
      alternateNumbers.reverse();
      alternateNumbers[this.#activeAlternateNumber ?? 0].classList.add('active');
      this.#alternateNumbers.replaceChildren(...alternateNumbers);
    } else {
      this.#alternateNumbers.replaceChildren();
    }
  }

  updateNumber(number) {
      this.#numberElement.textContent = number === '' ? '__' : number;
  }

  updateOperator(operator) {
    if (operator in this.#operatorMap) {
      this.#operatorElement.textContent = this.#operatorMap[operator];
    } else {
      this.#operatorElement.textContent = operator;
    }
  }

  static addNewChild(parentNode, newNode) {
    parentNode.appendChild(newNode);
  }
}
