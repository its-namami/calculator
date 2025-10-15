export default class CalculatorProcessor {
  #UI;
  #calculator;

  constructor(UI, calculator) {
    this.#UI = UI;
    this.#calculator = calculator;
  }

  stdUpdateUI() {
    this.#UI.updateNumber(this.#calculator.currentNumber ?? '');
    this.#UI.updateOperator(this.#calculator.currentOperator ?? '');
    this.#UI.updateAlternateNumbers(this.#calculator.publicNumberStack);
  }

  number(number) {
    this.#calculator.addNumber(number);
    this.#UI.updateNumber(this.#calculator.currentNumber);
    this.#UI.updateAlternateNumbers(this.#calculator.publicNumberStack);
  }

  operator(operator) {
    this.#calculator.addOperator(operator);
    this.#UI.updateNumber(this.#calculator.previousNumber ?? this.#calculator.currentNumber);
    this.#UI.updateOperator(this.#calculator.currentOperator);
    this.#UI.updateAlternateNumbers(this.#calculator.publicNumberStack);
  }

  decimal() {
    this.#calculator.conditionalAddDecimalSign();
    this.#UI.updateNumber(this.#calculator.currentNumber);
    this.#UI.updateAlternateNumbers(this.#calculator.publicNumberStack);
  }

  equal() {
    this.#calculator.calculate();
    this.stdUpdateUI()
    this.#UI.updateActiveAlternateNumber();
  }

  delete() {
    this.#calculator.deleteCharacter();
    this.stdUpdateUI()
  }

  clear() {
    this.#calculator.clear();
    this.#UI.updateNumber(this.#calculator.currentNumber);
    this.#UI.updateAlternateNumbers(this.#calculator.publicNumberStack);
  }

  allClear() {
    this.#calculator.allClear();
    this.stdUpdateUI();
  }

}
