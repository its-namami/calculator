export default class UiUpdater {
  #numberElement;
  #operatorElement;
  #keymap;

  constructor(numberElement, operatorElement, keymap) {
    this.#numberElement = numberElement;
    this.#operatorElement = operatorElement;
    this.#keymap = keymap;
  }

  updateNumber(number) {
    this.#numberElement.textContent = number;
  }

  updateOperator(operator) {
    this.#operatorElement.textContent = operator;
  }
}
