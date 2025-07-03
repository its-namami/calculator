const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.operator');
const decimalSign = document.querySelector('#decimal-sign');
const equalSign = document.querySelector('#equal-sign');
const deleteDigit = document.querySelector('#delete-digit');
const clearEntry = document.querySelector('#clear-entry');
const clearAll = document.querySelector('#clear-all');
const resultElement = document.querySelector('#result');

class Decimal {
  constructor (value) {
    this.number = value.toString();

    if (this.number.indexOf('.') !== -1) {
      const parts = this.number.split('.')
      this.integerPart = parts[0];
      this.decimalPart = parts[1];
      if (+this.decimalPart === 0) this.decimalPart = '';
    } else {
      this.integerPart = this.number;
      this.decimalPart = '';
    }

    +this.decimalPart === 0 ? this.decimalLength = 0 : this.decimalLength = this.decimalPart.length;
    this.leadingZeroes = this.decimalPart.toString().length - (+(this.decimalPart)).toString().length;
    this.processedDecimals = +(this.decimalPart); // Decimals with no leading zeroes
    this.processedDecimals === 0 ? this.processedDecimalsLength = 0 : this.processedDecimalsLength = this.processedDecimals.toString().length;
  };

  getLengthDecimal(length) {
    length -= this.leadingZeroes;
    if (length === this.processedDecimalsLength) {
      this.increasedLengthDecimal = +this.processedDecimals;
      return this.increasedLengthDecimal;
    } else if (length > this.processedDecimalsLength) {
      const endZeroesNeeded = length - this.processedDecimalsLength;
      this.increasedLengthDecimal = +(this.processedDecimals.toString() + '0'.repeat(endZeroesNeeded));
      return this.increasedLengthDecimal;
    } else {
      throw new Error(`Length: ${length} is outside of the ratio to decimals without leading-zeroes length: ${this.processedDecimalsLength}`);
    }
  }

  getDivisionReady(length) {
    // TO-DO, haven't worked at all
    length -= this.leadingZeroes;
    if (length === this.processedDecimalsLength) {
      this.increasedLengthDecimal = +this.processedDecimals;
      return this.increasedLengthDecimal;
    } else if (length > this.processedDecimalsLength) {
      const endZeroesNeeded = length - this.processedDecimalsLength;
      this.increasedLengthDecimal = +(this.processedDecimals.toString() + '0'.repeat(endZeroesNeeded));
      return this.increasedLengthDecimal;
    } else {
      throw new Error(`Length: ${length} is outside of the ratio to decimals without leading-zeroes length: ${this.processedDecimalsLength}`);
    }
  }
}

const calculator = {
  number1: '',
  operator: undefined,
  number2: '',
  decimalAdded: false,
  result: '',
  pressedZeroInt: false,

  validate: function() {
    return Number.isFinite(+this.number1) && Number.isFinite(+this.number2);
  },

  error: function() {
    // TO-DO
  },

  decimalMaxLen: function(decimal1, decimal2) {
    return Math.max(decimal1.decimalLength, decimal2.decimalLength)
  },

  decimalSumLen: function(decimal1, decimal2) {
    return decimal1.decimalLength + decimal2.decimalLength;
  },


  add: function(num1 = this.number1, num2 = this.number2) {
    const decimal1 = new Decimal(num1);
    const decimal2 = new Decimal(num2);
    const maxLen = this.decimalMaxLen(decimal1, decimal2);
    decimal1.getLengthDecimal(maxLen);
    decimal2.getLengthDecimal(maxLen);
    return +decimal1.integerPart + +decimal2.integerPart + +(decimal1.getLengthDecimal(maxLen) + decimal2.getLengthDecimal(maxLen)) / 10 ** this.decimalMaxLen(decimal1, decimal2);
  },

  subtract: function(num1 = this.number1, num2 = this.number2) {
    num2 = +('-' + num2);
    const decimal1 = new Decimal(num1);
    const decimal2 = new Decimal(num2);
    console.log(decimal2)
    const maxLen = this.decimalMaxLen(decimal1, decimal2);
    decimal1.getLengthDecimal(maxLen);
    decimal2.getLengthDecimal(maxLen);
    return +decimal1.integerPart + +decimal2.integerPart + +(decimal1.getLengthDecimal(maxLen) + decimal2.getLengthDecimal(maxLen)) / 10 ** this.decimalMaxLen(decimal1, decimal2);
  },

  multiply: function(num1 = this.number1, num2 = this.number2) {
    const decimal1 = new Decimal(num1);
    const decimal2 = new Decimal(num2);
    const maxLen = this.decimalMaxLen(decimal1, decimal2);
    decimal1.getLengthDecimal(maxLen);
    decimal2.getLengthDecimal(maxLen);
    return +decimal1.integerPart + +decimal2.integerPart * +(decimal1.getLengthDecimal(maxLen) + decimal2.getLengthDecimal(maxLen)) / 10 ** this.decimalSumLen(decimal1, decimal2);
  },

  divide: function(num1 = this.number1, num2 = this.number2) {
    const decimal1 = new Decimal(num1);
    const decimal2 = new Decimal(num2);
    const maxLen = this.decimalMaxLen(decimal1, decimal2);
    decimal1.getLengthDecimal(maxLen);
    decimal2.getLengthDecimal(maxLen);
    return +decimal1.integerPart + +decimal2.integerPart / +(decimal1.getLengthDecimal(maxLen) + decimal2.getLengthDecimal(maxLen)) / 10 ** this.decimalSumLen(decimal1, decimal2);
  },

  calculate: function() {
    if (!this.validate()) return this.error();

    if (this.number2 === '0' && this.operator === '/') {
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
      }

      this.number1 = this.result;
    } else {
      this.result = this.number1;
    }

    this.number2 = '';
    this.operator = undefined;
    
    resultElement.textContent = this.result;

    console.log(calculator)
  },

  addNumber: function(number) {
    if (number == 0) {
      if (this.pressedZeroInt === false) {
	if (this.decimalAdded === true) this.pressedZeroInt = false;
	else this.pressedZeroInt = true;
	this.number1 += '0';
      }
    } else {
      if (this.operator == null) this.number1 += number.toString();
      else this.number2 += number.toString();
    }
  },

  addDecimalSign: function() {
    this.pressedZeroInt = false;
    // ignore decimal signs after the first one set
    if (!this.decimalAdded) {
      this.addNumber('.');
      this.decimalAdded = true;
    }
  },

  addOperator: function(operatorID) {
    this.decimalAdded = false;
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
    }
  },

  deleteLastDigit: function() {
    if (this.operator == null) {
      this.number1 = this.number1.toString().substring(0, this.number1.length - 1);
    } else {
      this.number2 = this.number2.toString().substring(0, this.number2.length - 1);
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
  },

  history: {
    // TO-DO (history as in logs, keeps (5?) last entries)
  },

  updateUI: function() {
    // TO-DO (update the input of current number or result or operator)
  },
};

numbers.forEach(number => {
  number.addEventListener('click', () => {
    calculator.addNumber(number.textContent);
    console.log(calculator)
  });
});

operators.forEach(operator => {
  operator.addEventListener('click', () => {
    if (calculator.number1 === '' && operator.id === 'oper-minus') calculator.addNumber('-');
    else calculator.addOperator(operator.id);
    console.log(calculator)
  });
});

decimalSign.addEventListener('click', () => {
  calculator.addDecimalSign();
});

equalSign.addEventListener('click', () => {
  calculator.calculate();
});

deleteDigit.addEventListener('click', () => {
  calculator.deleteLastDigit();
});

clearEntry.addEventListener('click', () => {
  calculator.reset();
});

// TO-DO:
// clearAll
