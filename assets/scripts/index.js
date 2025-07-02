const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.operator');
const decimalSign = document.querySelector('#decimal-sign');
const equalSign = document.querySelector('#equal-sign');
const deleteDigit = document.querySelector('#delete-digit');
const clearEntry = document.querySelector('#clear-entry');
const clearAll = document.querySelector('#clear-all');

const calculator = {
  number1: '',
  number2: '',
  operator: undefined,

  validate: function() {
    return Number.isFinite(+this.number1) && Number.isFinite(+this.number2);
  },

  error: function() {
    // TO-DO
  },

  add: function() {
    return +this.number1 + +this.number2;
  },

  subtract: function() {
    return +this.number1 - +this.number2;
  },

  multiply: function() {
    return +this.number1 * +this.number2;
  },

  divide: function() {
    return +this.number1 / +this.number2;
  },

  calculate: function() {
    switch (this.operator) {
      case '+':
	this.number1 = this.add();
	break;
      case '-':
	this.number1 = this.subtract();
	break;
      case '*':
	this.number1 = this.multiply();
	break;
      case '/':
	this.number1 = this.divide();
	break;
    }

    this.number2 = '';
    this.operator = undefined;
    console.log(calculator)

    return this.number1;
  },

  addNumber: function(number) {
    if (this.operator == null) this.number1 += number.toString();
    else this.number2 += number.toString();
  },

  addDecimalSign: function() {
    this.addNumber('.');
  },

  addOperator: function(operatorID) {
    if (this.operator != null) this.calculate();

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

  clearEntry: function() {
    // TO-DO
  },

  clearAll: function() {
    // TO-DO
  },

  history: {
    // TO-DO (history as in logs, keeps (5?) last entries)
  },
};

numbers.forEach(number => {
  number.addEventListener('click', () => {
    calculator.addNumber(number.textContent);
  });
});

operators.forEach(operator => {
  operator.addEventListener('click', () => {
    calculator.addOperator(operator.id);
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

// TO-DO:
// clearAll and clearEntry event listeners
