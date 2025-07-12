import calculator from './calculator.js';
// Here is better Idea: 
// Have in each Keybind-Object (for each number or whatever)
// the Object "key", "shiftDown", "ctrlDown"
// and in the loop specify if hasOwnProperty shiftDown and is true
// then bla bla bla. If fore some reason that property is false,
// when setting in the bindings to prevent unaccuracy and ambiguity
// make that key only work when shiftDown or something is false.
const keyBindings = {
  numbers: {
    // function: function(arg) {
    //   calculator.addNumber(arg);
    // },
    0: [
      {
	key: '0',
      },

      {
	key: 'o',
      },
    ],
    1: [
      {
	key: '1',
      },
    ],
    2: [
      {
	key: '2',
      },
    ],
    3: [
      {
	key: '3',
      },
    ],
    4: [
      {
	key: '4',
      },
    ],
    5: [
      {
	key: '5',
      },
    ],
    6: [
      {
	key: '6',
      },
    ],
    7: [
      {
	key: '7',
      },
    ],
    8: [
      {
	key: '8',
      },
    ],
    9: [
      {
	key: '9',
      },
    ],
  },

  operators: {
    // function: function(arg) {
    //   calculator.addOperator(arg);
    // },
    'oper-minus': [
      {
	key: '-',
      },

      {
	key: 's',
      },
    ],
    'oper-plus': [
      {
	key: '+',
      },

      {
	key: 'p',
      },
    ],
    'oper-divide': [
      {
	key: '/',
      },

      {
	key: 'd',
      },
    ],
    'oper-multiply': [
      {
	key: '*',
      },

      {
	key: 'x',
      },

      {
	key: 'm',
      },
    ],
    'oper-exponent': [
      {
	key: '^',
      },

      {
	key: 'e',
      },
    ],
  },

  special: {
    'deleteDigit': [
      {
	'ctrlKey': false,
	'shiftKey': false,
	key: 'Backspace',
      },
    ],
    'clearEntry': [
      {
	'ctrlKey': false,
	'shiftKey': true,
	key: 'Backspace',
      },
    ],
    'clearAll': [
      {
	'ctrlKey': true,
	'shiftKey': true,
	key: 'Backspace',
      },
    ],
  },

  other: {
    'decimalSign': [
      {
	key: '.',
      },
    ],
    'equalSign': [
      {
	key: '=',
      },

      {
	key: 'Enter',
      },

      {
	key: 'c',
	ctrlKey: true,
      },
    ],
  },
}

const keyCheck = (event, keybindings = keyBindings) => {
  // console.log(keyBindings);
  Object.entries(keybindings).forEach(property => {
    const keyCategory = property[0];
    Object.entries(property[1]).forEach(eliteProperty => {
      const numberOutput = eliteProperty[0];
      eliteProperty[1].forEach(keyBinding => {
	let allCorrectKeysPressed = true;

	Object.entries(keyBinding).forEach(keyDown => {
	  const keyName = keyDown[0];
	  const keyValue = keyDown[1];

	  if (keyName === 'shiftKey') {
	    if (event.shiftKey !== keyValue) allCorrectKeysPressed = false;
	  } else if (keyName === 'ctrlKey') {
	    if (event.ctrlKey !== keyValue) allCorrectKeysPressed = false;
	  } else if (keyName === 'key') {
	    if (event.key !== keyValue) allCorrectKeysPressed = false;
	  }
	});
	if (keyCategory === 'numbers') {
	  if (allCorrectKeysPressed) {
	    calculator.addNumber(numberOutput)
	  }
	} else if (keyCategory === 'operators') {
	  if (allCorrectKeysPressed) {
	    if (calculator.operator === undefined) {
	      if (calculator.number1 === '' && numberOutput === 'oper-minus') calculator.addNumber('-');
	      else calculator.addOperator(numberOutput);
	    } else {
	      calculator.calculate();
	      calculator.addOperator(numberOutput);
	    }
	  }
	} else if (keyCategory === 'special') {
	  if (allCorrectKeysPressed) {
	    if (numberOutput === 'deleteDigit') calculator.deleteLastDigit();
	    if (numberOutput === 'clearEntry') calculator.reset();
	  }
	} else if (keyCategory === 'other') {
	  if (allCorrectKeysPressed) {
	    if (numberOutput === 'decimalSign') calculator.addDecimalSign();
	    if (numberOutput === 'equalSign') calculator.calculate();
	  }
	}
      });
    });
  });
};

export { keyBindings, keyCheck };
