import Decimal from './decimal.js';

const resultElement = document.querySelector('#result');
const calculator = {
  number1: '',
  operator: undefined,
  number2: '',
  decimalSignAdded: false,
  result: '',
  pressedZeroInt: false,

  validate: function() {
    return Number.isFinite(+this.number1) && Number.isFinite(+this.number2);
  },

  error: function() {
    this.reset();
    resultElement.textContent = 'ERROR';
  },

  decimalMaxLen: function(decimal1, decimal2) {
    return Math.max(decimal1.decimalLen, decimal2.decimalLen)
  },

  decimalSumLen: function(decimal1, decimal2) {
    return decimal1.decimalLen + decimal2.decimalLen;
  },

  add: function(num1 = this.number1, num2 = this.number2) {
    // const decimal1 = new Decimal(num1);
    // const decimal2 = new Decimal(num2);
    // const maxLen = this.decimalMaxLen(decimal1, decimal2);
    // decimal1.growToSizeDecimal(maxLen);
    // decimal2.growToSizeDecimal(maxLen);
    // return (+decimal1.customLenNumber + +decimal2.customLenNumber) / 10 ** maxLen;
  },

  subtract: function(num1 = this.number1, num2 = this.number2) {
    return this.add(num1, -num2);
  },

  multiply: function(num1 = this.number1, num2 = this.number2) {
    const decimal1 = new Decimal(num1);
    const decimal2 = new Decimal(num2);
    const maxLen = this.decimalMaxLen(decimal1, decimal2);
    const sumLen = this.decimalSumLen(decimal1, decimal2);
    return (+decimal1.customLenNumber * +decimal2.customLenNumber) / 10 ** sumLen;
  },

  divide: function(num1 = this.number1, num2 = this.number2) {
    if (num2 === 0) return this.error();
    const decimal1 = new Decimal(num1);
    const decimal2 = new Decimal(num2);
    const maxLen = this.decimalMaxLen(decimal1, decimal2);
    console.log(decimal1, decimal2)
    return decimal1.moveDecimalToRight(maxLen) / decimal2.moveDecimalToRight(maxLen);
  },

  exponent: function(number = this.number1, power = this.number2) {
    if (power === 0) return 1;
    

    let value = number;

    for (let i = 1; i < Math.abs(power); i++) {
      value = this.multiply(value, number);
    }
    
    if (power < 0) return 1 / value;

    return value;
  },

  calculate: function() {
    if (!this.validate()) return this.error();
    if (this.number2 === '0' && this.operator === '/') {
      this.reset();
      this.result = 'Cannot divide through 0';
    } else if (this.number2 !== '') {
      switch (this.operator) {
	case '+':
	  this.result = this.add();
	  break;
	case '-':
	  this.result = this.subtract();
	  break;
	case '*':
	  this.result = this.multiply();
	  break;
	case '/':
	  this.result = this.divide();
	  break;
	case '^':
	  this.result = this.exponent();
	  break;
      }

      this.number1 = this.result;
    } else {
      this.result = this.number1;
    }

    this.number2 = '';
    this.operator = undefined;

    resultElement.textContent = this.result;

    if (this.result.toString().indexOf('.') !== -1) this.decimalSignAdded = true;

    this.result = '';
  },

  addNumber: function(number) {
    console.log(this.decimalSignAdded);

    if (number === '.') {
      if (this.operator === undefined) this.number1 += '.';
      else this.number2 += '.';
      this.decimalSignAdded = true;
    } else if (this.operator === undefined) {
      if (this.number1 === '' && number === '-') {
	this.number1 += number;
	this.updateUI(this.number1);
      } else if (this.decimalSignAdded) {
	// To-Do: probs just use Decimal class and grab the decimal
      } else if (!this.decimalSignAdded) {
	this.number1 = BigInt(this.number1) * BigInt(10) + BigInt(number);
	this.number1 = new Decimal(this.number1);
	console.log(this.number1)
      }
	//      } else {
	// this.number1 += number.toString();
	// if (!this.decimalSignAdded) this.number1 = (+this.number1).toString();
	// this.updateUI(this.number1);
	//      }
    }
    else {
      this.number2 += number.toString();
      if (!this.decimalSignAdded) this.number2 = (+this.number2).toString();
      this.updateUI(this.number2);
    }
  },

  addDecimalSign: function() {
    // ignore decimal signs after the first one set
    if (!this.decimalSignAdded) {
      this.decimalSignAdded = true;
      this.addNumber('.');
      this.operator === undefined ? this.updateUI(this.number1) : this.updateUI(this.number2);
    }
  },

  addOperator: function(operatorID) {
    this.decimalSignAdded = false;
    this.pressedZeroInt = false;

    switch (operatorID) {
      case 'oper-plus':
	this.operator = '+';
	break;
      case 'oper-minus':
	this.operator = '-';
	break;
      case 'oper-multiply':
	this.operator = '*';
	break;
      case 'oper-divide':
	this.operator = '/';
	break;
      case 'oper-exponent':
	this.operator = '^';
	break;
    }
  },

  deleteLastDigit: function() {
    if (this.number1 !== '') {
      if (this.operator === undefined) {
	if (this.number1.toString().at(-1) === '.') this.decimalSignAdded = false;
	this.number1 = this.number1.toString().substring(0, this.number1.length - 1);
	this.updateUI(this.number1);
      } else {
	if (this.number2.toString().at(-1) === '.') this.decimalSignAdded = false;
	this.number2 = this.number2.toString().substring(0, this.number2.length - 1);
	this.updateUI(this.number2);
      }
    }
  },

  clearAll: function() {
    // TO-DO
  },

  reset: function() {
    this.number1 = '',
    this.number2 = '',
    this.result = '',
    this.operator = undefined
    this.decimalSignAdded = false;
    this.updateUI(0);
  },

  history: {
    // TO-DO (history as in logs, keeps (5?) last entries)
  },

  updateUI: function(element) {
    resultElement.textContent = element;
  },
};

export default calculator;
