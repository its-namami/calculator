export default class KeyProcessor {
  #digits;
  #operators;
  #calculatorState;

  constructor(digits, operators, calculatorState) {
    this.#digits = digits;
    this.#operators = operators;
    this.#calculatorState = calculatorState;
  }

  #handleUniqueResponse (response) {
    switch (response) {
      case '=':
        this.#calculatorState.equal();
        break;
      case '.':
        this.#calculatorState.decimal();
        break;
      case 'delete':
        this.#calculatorState.delete();
        break;
      case 'clear':
        this.#calculatorState.clear();
        break;
      case 'allClear':
        this.#calculatorState.allClear();
        break;
      default:
        throw new Error(`The ${response} is not a handled case!`);
        break;
    }
  }

  process(response) {
    if (this.#digits.includes(response)) {
      this.#calculatorState.number(response);
    } else if (this.#operators.includes(response)) {
      this.#calculatorState.operator(response);
    } else {
      this.#handleUniqueResponse(response);
    }
  }
}
