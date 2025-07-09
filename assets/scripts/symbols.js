const regionalSymbols = {
  numbers: {
    0: {
      // if something is not mentioned, it's defaulted to 0
      arabic: '0',
      chinese: '零',
      devanagari: '०',
    },

    1: {
      arabic: '1',
      chinese: '一',
      devanagari: '१',
    },

    2: {
      arabic: '2',
      chinese: '二',
      devanagari: '२',
    },

    3: {
      arabic: '3',
      chinese: '三',
      devanagari: '३',
    },

    4: {
      arabic: '4',
      chinese: '四',
      devanagari: '४',
    },

    5: {
      arabic: '5',
      chinese: '五',
      devanagari: '५',
    },

    6: {
      arabic: '6',
      chinese: '六',
      devanagari: '६',
    },

    7: {
      arabic: '7',
      chinese: '七',
      devanagari: '७',
    },

    8: {
      arabic: '8',
      chinese: '八',
      devanagari: '८',
    },

    9: {
      arabic: '9',
      chinese: '九',
      devanagari: '९',
    },
  },

  operators: {
    'oper-plus': {
      arabic: '﹢',
      chinese: '＋',
      default: '+',
      // hypothetically it could be default: '+',
      // my programm should look for default,
      // then american, if default not found (like here),
      // then european if american not found
      // else return oper-plus if nuthin found :(
    },

    'oper-minus': {
      arabic: '﹣',
      chinese: '－',
      default: '-',
    },

    'oper-multiply': {
      american: '*',
      arabic: '٭',
      default: '×',
    },

    'oper-divide': {
      european: '÷',
      american: '∕',
      arabic: '÷',
      chinese: '／',
      devanagari: '÷',
    },

    'oper-exponent': {
      arabic: '٭٭',
      default: '^',
    }
  },

  special: {
    'delete-digit': {
      european: 'DEL',
      american: '⌫',
      arabic: 'حذف',
      chinese: '删除',
      devanagari: 'हटाएं',
    },

    'clear-entry': {
      european: 'C',
      american: 'CE',
      arabic: 'مسح',
      chinese: '清除',
      devanagari: 'साफ़',
    },

    'clear-all': {
      arabic: 'مسح الكل',
      chinese: '全部清除',
      devanagari: 'सब साफ़',
      default: 'AC',
    },
  },

  other: {
    'decimal-sign': {
      european: ',',
      american: '.',
      arabic: '٫',
      chinese: '．',
      devanagari: '॰',
    },

    'equal-sign': {
      chinese: '＝',
      default: '='
    },

    'thousands-separator': {
      european: '.',
      american: ',',
      arabic: '٬',
      chinese: '，',
      devanagari: '٬',
    }
  },
}

export default regionalSymbols;
