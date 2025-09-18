import DXCalc from '../../node_modules/dx-calc/dxCalc.js'

export default class Calculator {
  static #numberStack = [''];
  static #operatorStack = [];
  static numberStackClone = Calculator.#numberStack;
  static operatorStackClone = Calculator.#operatorStack;

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

  // cannot implement get result because UI needs to display creating

  static conditionalAddDecimalSign() {
    const hasDecimalSign = Calculator.#numberStack.at(-1).includes('.');

    if (!hasDecimalSign) {
      Calculator.#numberStack.push(Calculator.#numberStack.pop().concat('.'));
    }
  }

  static get #currentOperator() {
    return Calculator.#operatorStack.at(-1);
  }

  static get #previousOperator() {
   return Calculator.#operatorStack.at(-2);
  }

  static #isUnary(operator) {
    return Calculator.#unaryOperations.hasOwnProperty(operator);
  }

  static #isBinary(operator) {
    return Calculator.#binaryOperations.hasOwnProperty(operator);
  }

  static addNumber(stringNumber) {
    const lastNumber = Calculator.#numberStack.pop();
    const newNumber = lastNumber + stringNumber;
    Calculator.#numberStack.push(newNumber);
  }

  static #canAddOperator(newOperator) {
    const currentOperatorSameGroup = Calculator.#isUnary(Calculator.#currentOperator) && Calculator.#isUnary(newOperator) || Calculator.#isBinary(Calculator.#currentOperator) && Calculator.#isBinary(newOperator);

    if (Calculator.#numberStack.at(-1) === ''
        && !Calculator.#isUnary(newOperator)) {
      if (currentOperatorSameGroup) {
        return 'sameGroup';
      } else {
        return false;
      }
    }

    return true;
  }

  static addOperator(newOperator) {
    let sameGroup = false;

    switch (Calculator.#canAddOperator(newOperator)) {
      case true:
        Calculator.#operatorStack.push(newOperator);
        break;
      case false:
        throw new Error(`Cannot add <${newOperator}> operator`);
        break;
      case 'sameGroup':
        sameGroup = true;
        Calculator.#operatorStack.pop();
        Calculator.#operatorStack.push(newOperator);
        break;
    }

    if (Calculator.#isUnary(Calculator.#currentOperator)
        && Calculator.#numberStack.at(-1) !== '') {
      let tempCurrentOperator = Calculator.#operatorStack.pop();

      Calculator.#operatorStack.push('*');
      Calculator.#operatorStack.push(tempCurrentOperator);
      Calculator.#breakNumber();

      tempCurrentOperator = null;
    }

    if (Calculator.#previousOperator !== undefined) {
      Calculator.#makeCalculation();
    }

    if (!Calculator.#isUnary(Calculator.#currentOperator)
        && !sameGroup) {
      Calculator.#breakNumber();
    }
  }

  static calculate() {
    Calculator.#operatorStack.push('non-existant operator');
    Calculator.#makeCalculation();
    Calculator.#operatorStack.pop();
  }

  static #breakNumber() {
    Calculator.#numberStack.push('');
  }

  static #pushCalculation(result) {
    Calculator.#numberStack.push(result);
    Calculator.#operatorStack.splice(-2, 1);
  }

  static #unaryCalculate(operator) {
    const poppedNumber = Calculator.#numberStack.pop();
    const calculation = Calculator.#unaryOperations[operator];
    const result = calculation(poppedNumber);
    Calculator.#pushCalculation(result);
  }

  static #binaryCalculate (operator) {
    const poppedNumbers = Calculator.#numberStack.splice(-2, 2);
    const calculation = Calculator.#binaryOperations[operator];
    const result = calculation(...poppedNumbers);
    Calculator.#pushCalculation(result);
  }

  static #makeCalculation() {
    if (Calculator.#isUnary(Calculator.#previousOperator)) {
        Calculator.#unaryCalculate(Calculator.#previousOperator);
    } else if (!Calculator.#isUnary(Calculator.#currentOperator)
        && Calculator.#isBinary(Calculator.#previousOperator)) {
        Calculator.#binaryCalculate(Calculator.#previousOperator);
    }

    if (Calculator.#operatorStack.length > 1 && !Calculator.#isUnary(Calculator.#currentOperator)) {
      Calculator.#makeCalculation();
    }
  }
}
