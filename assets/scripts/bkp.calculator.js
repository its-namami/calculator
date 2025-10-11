import DXCalc from '../../node_modules/dx-calc/dxCalc.js'

//////////
// Remove this later!!!
window.DXCalc = DXCalc;
//////////

const resultElement = document.querySelector('#result');

const calculator = {
  number1: '',
  operator: undefined,
  number2: '',
  decimalSignAdded: false,
  result: '',
  pressedZeroInt: false,

  error: function() {
    this.reset();
    resultElement.textContent = 'ERROR';
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
      } else {
	this.number1 = BigInt(this.number1) * BigInt(10) + BigInt(number);
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

  calculate: function() {
    if (this.operator === '+') {
      return DXCalc.number(this.number1).add(this.number2).value;
    }

    if (this.operator === '-') {
      return DXCalc.number(this.number1).subtract(this.number2).value;
    }

    if (this.operator === '*') {
      return DXCalc.number(this.number1).multiply(this.number2).value;
    }

    if (this.operator === '/') {
      return DXCalc.number(this.number1).divide(this.number2).value;
    }

    if (this.operator === '√') {
      return DXCalc.number(this.number1).sqrt(this.number2).value;
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
