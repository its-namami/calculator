import DXCalc from '../../node_modules/dx-calc/dxCalc.js'


//////////
// Remove this later!!!
window.DXCalc = DXCalc;
//////////

export default class Calculator {
  static #numberStack = [''];
  static #operatorStack = [];

  static #binaryOperations = {
    '+': (x, y) => DXCalc.number(x).add(y).value,
    '-': (x, y) => DXCalc.number(x).subtract(y).value,
    '*': (x, y) => DXCalc.number(x).multiply(y).value,
    '/': (x, y) => DXCalc.number(x).divide(y).value,
  }

  static #unaryOperations = {
    '√': x => DXCalc.number(x).sqrt().value,
  }

  static resetAll() {
    Calculator.#numberStack = [''];
    Calculator.#operatorStack = [];
  }

  static removeLastDigit() {
    Calculator.#numberStack.push(Calculator.#numberStack.pop().slice(0, -1));
  }

  static conditionalAddDecimalSign() {
    const hasDecimalSign = Calculator.#numberStack.at(-1).includes('.');

    if (!hasDecimalSign) {
      Calculator.#numberStack.push(Calculator.#numberStack.pop().concat('.'));
    }
  }

  static addNumber(stringNumber) {
    const lastNumber = Calculator.#numberStack.pop();
    const newNumber = lastNumber + stringNumber;
    Calculator.#numberStack.push(newNumber);
  }

  static addOperator(operator) {
    console.log(`All operators: ${Calculator.#operatorStack}`);
    console.log(`All numbers: ${Calculator.#numberStack}`);
    Calculator.#operatorStack.push(operator);
    console.log(`Pushed new operator ${Calculator.#operatorStack.at(-1)}`);
    Calculator.#makeCalculation();

    if (!Calculator.#isUnary(Calculator.#currentOperator)) {
      Calculator.#breakNumber();
    }
  }

  static calculate() {
    Calculator.#operatorStack.push('completely useless string to just make calculation believe there is something');
    Calculator.#makeCalculation();
    Calculator.#operatorStack.pop();
  }

  static get #currentOperator() {
    return Calculator.#operatorStack.at(-1);
  }

  static get #previousOperator() {
   return Calculator.#operatorStack.at(-2);
  }

  static #breakNumber() {
    Calculator.#numberStack.push('');
  }

  static #pushCalculation(result) {
    Calculator.#numberStack.push(result);
    Calculator.#operatorStack.splice(-2, 1);
  }

  static #getUnaryCalculation() {
    const poppedNumber = Calculator.#numberStack.pop();
    const calculation = Calculator.#unaryOperations[Calculator.#previousOperator];
    return calculation(poppedNumber);
  }

  static #getBinaryCalculation () {
    const poppedNumbers = Calculator.#numberStack.splice(-2, 2);
    const calculation = Calculator.#binaryOperations[Calculator.#previousOperator];
    return calculation(...poppedNumbers);
  }

  static #isUnary(operator) {
    return Calculator.#unaryOperations.hasOwnProperty(operator);
  }

  static #isBinary(operator) {
    return Calculator.#binaryOperations.hasOwnProperty(operator);
  }

  static #makeCalculation() {
    let result = false;

    if (Calculator.#isUnary(Calculator.#previousOperator)) {
      result = Calculator.#getUnaryCalculation();
      console.log('performed unary');
    }

    if (!Calculator.#isUnary(Calculator.#currentOperator)
        && Calculator.#isBinary(Calculator.#previousOperator)) {
      result = Calculator.#getBinaryCalculation();
      console.log('performed binary');
    }

    if (result !== false) {
      Calculator.#pushCalculation(result);
    }

    console.log(`Result: ${Calculator.#numberStack.at(-1)}`)
  }
}
