export default class UiUpdater {
  #numberElement;
  #operatorElement;

  constructor(numberElement, operatorElement) {
    this.#numberElement = numberElement;
    this.#operatorElement = operatorElement;
  }

  updateNumber(number) {
    this.#numberElement.textContent = number;
  }

  updateOperator(operator) {
    this.#operatorElement.textContent = operator;
  }
}
