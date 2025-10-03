import DXCalc from '../../node_modules/dx-calc/dxCalc.js'

export default class Calculator {
  #numberStack = [''];
  #operatorStack = [];
  // numberStackClone = Calculator.#numberStack;
  // operatorStackClone = Calculator.#operatorStack;

  static #binaryOperations = {
    '+': (x, y) => DXCalc.number(x).add(y).value,
    '-': (x, y) => DXCalc.number(x).subtract(y).value,
    '*': (x, y) => DXCalc.number(x).multiply(y).value,
    '/': (x, y) => DXCalc.number(x).divide(y).value,
  }

  static #unaryOperations = {
    '√': x => DXCalc.number(x).sqrt().value,
    'negate': x => DXCalc.number(x).multiply('-1'),
  }

  resetAll() {
    this.#numberStack = [''];
    this.#operatorStack = [];
  }

  removeLastDigit() {
    this.#numberStack.push(this.#numberStack.pop().slice(0, -1));
  }

  // cannot implement get result because UI needs to display creating

  conditionalAddDecimalSign() {
    const hasDecimalSign = this.currentNumber.includes('.');

    if (!hasDecimalSign) {
      this.#numberStack.push(this.#numberStack.pop().concat('.'));
    }
  }

  get currentOperator() {
    return this.#operatorStack.at(-1);
  }

  get currentNumber() {
    return this.#numberStack.at(-1);
  }

  get previousNumber() {
    return this.#numberStack.at(-2);
  }

  get #previousOperator() {
   return this.#operatorStack.at(-2);
  }

  static #isUnary(operator) {
    return Calculator.#unaryOperations.hasOwnProperty(operator);
  }

  static #isBinary(operator) {
    return Calculator.#binaryOperations.hasOwnProperty(operator);
  }

  addNumber(stringNumber) {
    const lastNumber = this.#numberStack.pop();
    const newNumber = lastNumber + stringNumber;
    this.#numberStack.push(newNumber);
  }

  #canAddOperator(newOperator) {
    const currentOperatorSameGroup = Calculator.#isUnary(this.currentOperator) && Calculator.#isUnary(newOperator) || Calculator.#isBinary(this.currentOperator) && Calculator.#isBinary(newOperator);

    if (newOperator === '-'
        && this.#numberStack.length === 1
        && this.#numberStack[0] === ''
        || this.#numberStack[0] === '-') {
      return 'negate';
    }

    if (this.currentNumber === '') {
      if (currentOperatorSameGroup) {
        return 'sameGroup';
      } else {
        return false;
      }
    }

    return true;
  }

  addOperator(newOperator) {
    let sameGroup = false;

    switch (this.#canAddOperator(newOperator)) {
      case true:
        this.#operatorStack.push(newOperator);
        break;
      case false:
        // ignore, don't add / do anything
        break;
      case 'negate':
        if (this.currentNumber !== '-') {
          this.#numberStack.pop();
          this.#numberStack.push('-');
        }

        break;
      case 'sameGroup':
        sameGroup = true;
        this.#operatorStack.pop();
        this.#operatorStack.push(newOperator);
        break;
    }

    if (Calculator.#isUnary(this.currentOperator)
        && this.currentNumber !== '') {
      let tempCurrentOperator = this.#operatorStack.pop();

      this.#operatorStack.push('*');
      this.#operatorStack.push(tempCurrentOperator);
      this.#breakNumber();

      tempCurrentOperator = null;
    }

    if (this.#previousOperator !== undefined) {
      this.#makeCalculation();
    }

    if (!Calculator.#isUnary(this.currentOperator)
        && !sameGroup
        && this.#numberStack[0] !== '-') {
      this.#breakNumber();
    }
  }

  calculate() {
    this.#operatorStack.push('non-existant operator');
    this.#makeCalculation();
    this.#operatorStack.pop();
  }

  #breakNumber() {
    this.#numberStack.push('');
  }

  #pushCalculation(result) {
    this.#numberStack.push(result);
    this.#operatorStack.splice(-2, 1);
  }

  #unaryCalculate(operator) {
    const poppedNumber = this.#numberStack.pop();
    const calculation = Calculator.#unaryOperations[operator];
    const result = calculation(poppedNumber);
    this.#pushCalculation(result);
  }

  #binaryCalculate (operator) {
    const poppedNumbers = this.#numberStack.splice(-2, 2);
    const calculation = Calculator.#binaryOperations[operator];
    const result = calculation(...poppedNumbers);
    this.#pushCalculation(result);
  }

  #makeCalculation() {
    if (Calculator.#isUnary(this.#previousOperator)) {
        this.#unaryCalculate(this.#previousOperator);
    } else if (!Calculator.#isUnary(this.currentOperator)
        && Calculator.#isBinary(this.#previousOperator)) {
        this.#binaryCalculate(this.#previousOperator);
    }

    if (this.#operatorStack.length > 1 && !Calculator.#isUnary(this.currentOperator)) {
      this.#makeCalculation();
    }
  }
}
