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


  static addNumber(stringNumber) {
    const lastNumber = Calculator.#numberStack.pop();
    const newNumber = lastNumber + stringNumber;
    Calculator.#numberStack.push(newNumber);
  }

  static addOperator(operator) {
    Calculator.#operatorStack.push(operator);
    Calculator.#makeCalculation();
  }

  static #makeCalculation() {
    const latestOperator = () => Calculator.#operatorStack.at(-1);
    const previousOperator = () => Calculator.#operatorStack.at(-2);
    const isUnary = (operator) => Calculator.#unaryOperations.hasOwnProperty(operator);
    const isBinary = (operator) => Calculator.#binaryOperations.hasOwnProperty(operator);

    console.log(`All operators: ${Calculator.#operatorStack}`);
    console.log(`All numbers: ${Calculator.#numberStack}`);
    // calculate immediately
    if (isUnary(previousOperator())) {
      const poppedNumber = Calculator.#numberStack.pop();
      const calculation = Calculator.#unaryOperations[previousOperator()];
      const result = calculation(poppedNumber);
      Calculator.#numberStack.push(result);
      Calculator.#operatorStack.splice(-2, 1);
      console.log('performed unary');
    }

    if (!isUnary(latestOperator()) && isBinary(previousOperator())) {
      // pops 2 last numbers, calculates them and pushes back result
      const poppedLastNumbers = Calculator.#numberStack.splice(-2, 2);
      const calculation = Calculator.#binaryOperations[previousOperator()];
      const result = calculation(...poppedLastNumbers);
      Calculator.#numberStack.push(result);
      Calculator.#operatorStack.splice(-2, 1);
      console.log('performed binary');
    }

    console.log(`Result: ${Calculator.#numberStack.at(-1)}`)

    if (!isUnary(latestOperator())) {
      Calculator.#breakNumber();
    }
  }

  static #breakNumber() {
    Calculator.#numberStack.push('');
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
}
