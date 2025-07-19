class Decimal {
  #isNegative;
  #absDigits;
  #decimalLen;
  #rawDigits;

  constructor (number) {
    if (!Number.isFinite(Number(number))) return Decimal.#error('badNum', number);

    let numberString = number.toString();

    if (numberString.indexOf('e') !== -1) {
      console.log(numberString, numberString.indexOf('e'));
      Decimal.#warning('inputScientificNotation', numberString);
      numberString = Number(numberString).toString();
    }

    let decimalPointPosition = numberString.indexOf('.') + 1;

    this.#absDigits = numberString.replace(/-|\./g, '');
    this.#isNegative = numberString[0] === '-';
    this.#rawDigits = (this.#isNegative ? '-' + this.#absDigits : this.#absDigits);

    if (decimalPointPosition === 0) {
      this.#decimalLen = 0;
    } else {
      this.#decimalLen = numberString.length - decimalPointPosition;
    }
  }

  get value() {
    return Decimal.#normalize(this.#rawDigits, this.#decimalLen);
  }
  // Due to the binary search algorithm, the square root's
  // value's last digits are almost certainly wrong,
  // thus this high precision
  sqrt() {
    const firstDecimal = this.#getCopy();

    const precision = BigInt(17);
    console.log(firstDecimal);
    let seeking = BigInt(firstDecimal.#rawDigits) * BigInt(10) ** precision;
    let lowerBound = BigInt(1) * BigInt(10) ** (precision);
    let upperBound = BigInt(firstDecimal.#rawDigits) * BigInt(10) ** (precision);
    let tolerance = BigInt(10) ** BigInt(firstDecimal.#rawDigits.length);

    const calc = {
      get avg() {
        return (lowerBound + upperBound) / BigInt(2);
      },
      get avgsq() {
        return (this.avg ** BigInt(2)) / BigInt(10) ** precision;
      }
    };

    if (firstDecimal.#absDigits === '0' || firstDecimal.#absDigits === '') return 0;

    if (firstDecimal.value[0] !== '0' && !firstDecimal.#isNegative) {
      let i = 0;

      while (i < 500) {
        i++;

        if (calc.avgsq >= seeking && calc.avgsq - tolerance < seeking) {
          break;
        } else {
          if (calc.avgsq > seeking) {
            upperBound = calc.avg;
          } else {
            lowerBound = calc.avg;
          }
        }
      }

      if (i === 500) Decimal.#warning('sqrtOverItterated');
      return Decimal.from(Decimal.#normalize(calc.avg, calc.avg.toString().length - Math.round(firstDecimal.#absDigits.length / 2)));

    } else if (!firstDecimal.#isNegative) {
      seeking = seeking * BigInt(10) ** BigInt(firstDecimal.#decimalLen);
      upperBound = seeking;
      let i = 0;

      while (i < 500) {
        i++;

        if (calc.avgsq >= seeking && calc.avgsq - tolerance < seeking) {
          break;
        } else {
          if (calc.avgsq > seeking) {
            upperBound = calc.avg;
          } else {
            lowerBound = calc.avg;
          }
        }
      }

      if (i === 500) Decimal.#warning('sqrtOverItterated');
      return Decimal.from(Decimal.#normalize(calc.avg, calc.avg.toString().length + firstDecimal.#absDigits.length / 2 - 1));
    } else {
      return Decimal.#error('negSqrt');
    }
  }

  add(secondDecimal) {
    const firstDecimal = this.#getCopy();

    if (secondDecimal instanceof Decimal === false) secondDecimal = Decimal.from(secondDecimal);

    const maxLen = Math.max(firstDecimal.#absDigits.length, secondDecimal.#absDigits.length);
    const maxDecimalLen = Math.max(firstDecimal.#decimalLen, secondDecimal.#decimalLen);
    const firstDecimalValue = BigInt(firstDecimal.#growDecimal(maxDecimalLen));
    const secondDecimalValue = BigInt(secondDecimal.#growDecimal(maxDecimalLen));
    const numberResult = firstDecimalValue + secondDecimalValue;

    return Decimal.from(Decimal.#normalize(numberResult, maxDecimalLen));
  }

  multiply(secondDecimal) {
    const firstDecimal = this.#getCopy();

    if (secondDecimal instanceof Decimal === false) secondDecimal = Decimal.from(secondDecimal);

    const sumLen = firstDecimal.#decimalLen + secondDecimal.#decimalLen;
    const numberResult = BigInt(firstDecimal.#rawDigits) * BigInt(secondDecimal.#rawDigits);

    return Decimal.from(Decimal.#normalize(numberResult, sumLen));
  }

  divide(secondDecimal) {
    const firstDecimal = this.#getCopy();

    if (secondDecimal instanceof Decimal === false) secondDecimal = Decimal.from(secondDecimal);

    const maxLen = Math.max(firstDecimal.#absDigits.length, secondDecimal.#absDigits.length);
    const maxDecimalLen = Math.max(firstDecimal.#decimalLen, secondDecimal.#decimalLen);
    const firstDecimalValue = BigInt(firstDecimal.#growDecimal(maxDecimalLen));
    const secondDecimalValue = BigInt(secondDecimal.#growDecimal(maxDecimalLen));

    if (secondDecimalValue === BigInt(0)) return Decimal.#error('divideZero');

    let newFirstDecimalValue = firstDecimalValue;
    let decimals = 0;

    for (let i = 0; i < 15; i++) {
      if (newFirstDecimalValue % secondDecimalValue !== BigInt(0)) {
        newFirstDecimalValue *= BigInt(10);
        decimals++;
      } else {
        break;
      }
    }

    const result = (newFirstDecimalValue / secondDecimalValue).toString();

    return Decimal.from(Decimal.#normalize(result, decimals));
  }

  static from(input) {
    if (typeof input === "number") {
      Decimal.#warning('inputNumber');
      return new Decimal(input.toString());
    } else {
      return new Decimal(input);
    }
  }

  #getCopy() {
    return Decimal.from(this.value);
  }

  #growDecimal(scale) {
    const decimalsNeeded = scale - this.#decimalLen;

    if (decimalsNeeded < 0) return Decimal.#error('badScale', decimalsNeeded);

    return this.#rawDigits + '0'.repeat(decimalsNeeded);
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

export default Decimal;
