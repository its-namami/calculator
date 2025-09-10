class Mafs {
  #isNegative;
  #absDigits;
  #decimalLength;
  #rawDigits;

  constructor(number) {
    if (!Number.isFinite(Number(number))) return Mafs.#error('badNum', number);

    let numberString = number.toString();

    if (numberString.indexOf('e') !== -1) {
      console.log(numberString, numberString.indexOf('e'));
      Mafs.#warning('inputScientificNotation', numberString);
      numberString = Number(numberString).toString();
    }

    let decimalPointPosition = numberString.indexOf('.') + 1;

    this.#absDigits = numberString.replace(/-|\./g, '');
    this.#isNegative = numberString[0] === '-';
    this.#rawDigits = (this.#isNegative ? '-' + this.#absDigits : this.#absDigits);

    if (decimalPointPosition === 0) {
      this.#decimalLength = 0;
    } else {
      this.#decimalLength = numberString.length - decimalPointPosition;
    }
  }

  get value() {
    return Mafs.#normalize(this.#rawDigits, this.#decimalLength);
  }

  sqrtNewton(number = undefined) {
    number ??= this.value;

    if (number instanceof Mafs === false) number = Mafs.number(number);

    // newton's method for sqrt:
    // x2 = x1 - f(x1)/f'(x1)
    // f(x1) = x1*x1 - (number)
    // f'(x1) = 2x;

    // devtools
    const precision = BigInt(15);
    let x1 = BigInt(1) * BigInt(10) ** precision;

    // const num = { value: 5 };
    const fn = () => x1*x1 - BigInt(number.value) * BigInt(10) ** precision;
    console.log(x1);
    console.log(BigInt(number.value) * BigInt(10) ** precision);
    console.log(fn())
    const dfn = () => x1 * 2;

    let x2 = () => {
      x1 = x1 - fn()/dfn();
      return x1;
    }

    for (let i = 0; i < 5; i++) {
      console.log(x2());
    }
  }

  sqrt(number = undefined) {
    number ??= this.value;

    if (number instanceof Mafs === false) number = Mafs.number(number);

    const precision = BigInt(17);
    let seeking = BigInt(number.#rawDigits) * BigInt(10) ** precision;
    let lowerLimit = BigInt(1) * BigInt(10) ** (precision);
    let upperLimit = BigInt(number.#rawDigits) * BigInt(10) ** (precision);
    let tolerance = BigInt(10) ** BigInt(number.#rawDigits.length);

    const calculate = {
      get average() {
        return (lowerLimit + upperLimit) / BigInt(2);
      },
      get averageSquared() {
        return (this.average ** BigInt(2)) / BigInt(10) ** precision;
      }
    };

    if (number.#absDigits === '0' || number.#absDigits === '') return 0;

    if (number.value[0] !== '0' && !number.#isNegative) {
      let i = 0;

      while (i < 500) {
        i++;

        if (calculate.averageSquared >= seeking && calculate.averageSquared - tolerance < seeking) {
          break;
        } else {
          if (calculate.averageSquared > seeking) {
            upperLimit = calculate.average;
          } else {
            lowerLimit = calculate.average;
          }
        }
      }

      if (i === 500) Mafs.#warning('sqrtOverItterated');
      return Mafs.number(Mafs.#normalize(calculate.average, calculate.average.toString().length - Math.round(number.#absDigits.length / 2)));

    } else if (!number.#isNegative) {
      seeking = seeking * BigInt(10) ** BigInt(number.#decimalLength);
      upperLimit = seeking;
      let i = 0;

      while (i < 500) {
        i++;

        if (calculate.averageSquared >= seeking && calculate.averageSquared - tolerance < seeking) {
          break;
        } else {
          if (calculate.averageSquared > seeking) {
            upperLimit = calculate.average;
          } else {
            lowerLimit = calculate.average;
          }
        }
      }

      if (i === 500) Mafs.#warning('sqrtOverItterated');
      return Mafs.number(Mafs.#normalize(calculate.average, calculate.average.toString().length + number.#absDigits.length / 2 - 1));
    } else {
      return Mafs.#error('negSqrt');
    }
  }

  add(secondNumber) {
    const firstNumber = this.#getCopy();

    if (secondNumber instanceof Mafs === false) secondNumber = Mafs.number(secondNumber);

    const maxLen = Math.max(firstNumber.#absDigits.length, secondNumber.#absDigits.length);
    const maxDecimalLen = Math.max(firstNumber.#decimalLength, secondNumber.#decimalLength);
    const firstNumberValue = firstNumber.#growDecimal(maxDecimalLen);
    const secondNumberValue = secondNumber.#growDecimal(maxDecimalLen);
    const numberResult = firstNumberValue + secondNumberValue;

    return Mafs.number(Mafs.#normalize(numberResult, maxDecimalLen));
  }

  multiply(secondNumber) {
    const firstNumber = this.#getCopy();

    if (secondNumber instanceof Mafs === false) secondNumber = Mafs.number(secondNumber);

    const sumLen = firstNumber.#decimalLength + secondNumber.#decimalLength;
    const numberResult = BigInt(firstNumber.#rawDigits) * BigInt(secondNumber.#rawDigits);

    return Mafs.number(Mafs.#normalize(numberResult, sumLen));
  }

  divide(secondNumber) {
    const firstNumber = this.#getCopy();

    if (secondNumber instanceof Mafs === false) secondNumber = Mafs.number(secondNumber);

    const maxLen = Math.max(firstNumber.#absDigits.length, secondNumber.#absDigits.length);
    const maxDecimalLen = Math.max(firstNumber.#decimalLength, secondNumber.#decimalLength);
    let firstNumberValue = firstNumber.#growDecimal(maxDecimalLen);
    const secondNumberValue = secondNumber.#growDecimal(maxDecimalLen);

    if (secondNumberValue === BigInt(0)) return Mafs.#error('divideZero');

    let decimals = 0;

    for (let i = 0; i < 15; i++) {
      if (firstNumberValue % secondNumberValue !== BigInt(0)) {
        firstNumberValue *= BigInt(10);
        decimals++;
      } else {
        break;
      }
    }

    const result = (firstNumberValue / secondNumberValue).toString();

    return Mafs.number(Mafs.#normalize(result, decimals));
  }

  static number(input) {
    if (typeof input === "number") {
      Mafs.#warning('inputNumber');
      return new Mafs(input.toString());
    } else {
      return new Mafs(input);
    }
  }

  #getCopy() {
    return Mafs.number(this.value);
  }

  #growDecimal(scale) {
    const decimalsNeeded = scale - this.#decimalLength;

    if (decimalsNeeded < 0) return Mafs.#error('badScale', decimalsNeeded);

    // return this.#rawDigits + '0'.repeat(decimalsNeeded);
    return BigInt(this.#rawDigits) * BigInt(10) ** BigInt(decimalsNeeded);
  }

  static #error(error = 'default', info = undefined) {
    switch (error) {
      case 'badNum':
        throw new Error (`\nIncorrect number: ${info}!`);
      case 'badScale':
        throw new Error (`\nCannot have less than 0 decimals: (${info})!`);
      case 'divideZero':
        throw new Error ('\nCannot divide by zero!');
      case 'negSqrt':
        throw new Error ('\nSquare root of a negative number is imaginary!');
      case 'default':
        throw new Error ("\nFatal error, that's all we know...");
    }
  }

  static #warning(warning = 'default', info = undefined) {
    switch (warning) {
      case 'sqrtIsOverItterated':
        console.warn(`Sqrt calculation went above planned iterations: forcefully returning current close-enough sqrt`);
        break;
      case 'inputNumber':
        console.warn(`Don't use numbers: please pass as string or bigint instead.`);
        break;
      case 'inputScientificNotation':
        console.warn(`Loss of precision: the number was parsed in the scientific notation ${info}\nPlease pass as string or bigint instead.`);
        break;
      case 'default':
        console.warn("There's some warning, that's all we know...");
    }
  }

  static #normalize(digits, decimals) {
    const negativeSign = (digits.toString()[0] === '-' ? '-' : '');
    digits = (negativeSign === '-' ? digits.toString().slice(1) : digits.toString());
    const digitsLength = digits.length - (digits[0] === '-' ? 1 : 0);

    if (decimals === 0 || decimals === undefined) {
      return negativeSign + digits;
    } else if (digitsLength > decimals) {
      return negativeSign + digits.slice(0, digits.length - decimals) + '.' + digits.slice(digits.length - decimals);
    } else {
      return negativeSign + '0.' + '0'.repeat(decimals - digitsLength) + digits;
    }
  }
}

export default Mafs;
