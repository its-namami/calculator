const keyBinds = {
  numbers: {
    0: [
      {
	'0': true,
      },
      // if user creates another binding, this is what it would look like
      {
	'o': true,
      },
    ],
    1: [
      {
	'1': true,
      },
    ],
    2: [
      {
	'2': true,
      },
    ],
    3: [
      {
	'3': true,
      },
    ],
    4: [
      {
	'4': true,
      },
    ],
    5: [
      {
	'5': true,
      },
    ],
    6: [
      {
	'6': true,
      },
    ],
    7: [
      {
	'7': true,
      },
    ],
    8: [
      {
	'8': true,
      },
    ],
    9: [
      {
	'9': true,
      },
    ],
  },

  operators: {
    'oper-minus': [
      {
	'-': true,
      },
    ],
    'oper-plus': [
      {
	'+': true,
      },
    ],
    'oper-divide': [
      {
	'/': true,
      },
    ],
    'oper-multiply': [
      {
	'*': true,
      },
    ],
  },

  special: {
    'deleteDigit': [
      {
	'ctrlKey': false,
	'shiftKey': false,
	'Backspace': true,
      },
    ],
    'clearEntry': [
      {
	'ctrlKey': false,
	'shiftKey': true,
	'Backspace': true,
      },
    ],
    'clearAll': [
      {
	'ctrlKey': true,
	'shiftKey': true,
	'Backspace': true,
      },
    ],
  },

  other: {
    'decimalSign': [
      {
	'.': true,
      },
    ],
    'equalSign': [
      {
	'=': true,
      },

      {
	'Enter': true,
      },
    ],
  },
}

export default keyBinds;
