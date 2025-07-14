class Decimal {
  #isNegative;
  #digitsString;
  #decimalLen;
  #isDecimal;
  #negativeSignDigits;

  constructor (number) {
    let numberString = number.toString();
    let decimalPointPosition = numberString.indexOf('.') + 1;

    this.#digitsString = numberString.replace(/-|\./g, '');
    this.#isNegative = numberString[0] === '-';
    this.#negativeSignDigits = (this.#isNegative ? '-' + this.#digitsString : this.#digitsString);

    if (decimalPointPosition === 0) {
      this.#decimalLen = 0;
      this.#isDecimal = false;
    } else {
      this.#decimalLen = numberString.length - decimalPointPosition;
      this.#isDecimal = true;
    }
  }

  appendDigit(number) {
    this.#digitsString(this.#digitsString + number.toString());
    if (this.#isDecimal) this.#decimalLen++;
  }

  deleteFromEnd(digitCount = 1) {
    if (this.#digitsString === '' && this.#isNegative) this.#isNegative = false;
    this.#digitsString = (this.#digitsString.toString().slice(0, this.#digitsString.length - digitCount));
    if (this.#decimalLen > 0) this.#decimalLen--;
  }

  #getNumberString() {
    return (
      this.#digitsString.slice(0,this.#digitsString.length - this.#decimalLen)
      + '.'
      + this.#digitsString.slice(this.#digitsString.length - this.#decimalLen)
    );
  }

  #copy() {
    let objectCopy = '';

    if (this.#isNegative) objectCopy += '-';

    objectCopy += this.#getNumberString();

    return new Decimal(objectCopy);
  }

  static #getSumLen(val1, val2) {
    return val1.toString().length + val2.toString().length;
  }

  static #getMaxLen(val1, val2) {
    let val1Len = val1.toString().length;
    let val2Len = val2.toString().length;

    return val1Len > val2Len ? val1Len : val2Len;
  }

  #getRelativeValue(element) {
    return this.#isNegative ? '-' + this.#digitsString : this.#digitsString;
  }

  #growDecimal(scale) {
    const decimalsNeeded = scale - this.#decimalLen;

    if (decimalsNeeded < 0) throw new Error (`Cannot have less than 0 decimals: (${decimalsNeeded})`);

    return this.#negativeSignDigits + '0'.repeat(decimalsNeeded);
  }

  static #normalize(digits, decimals) {
    const negativeSign = (digits.toString()[0] === '-' ? '-' : '');
    digits = (negativeSign === '-' ? digits.toString().slice(1) : digits.toString());
    const digitsLength = digits.length - (digits[0] === '-' ? 1 : 0);

    if (decimals === 0) {
      return digits;
    } else if (digitsLength > decimals) {
      return negativeSign + digits.slice(0, digits.length - decimals) + '.' + digits.slice(digits.length - decimals);
    } else {
      return negativeSign + '0.' + '0'.repeat(decimals - digitsLength) + digits;
    }
  }

  add(number2) {
    const number1 = this.#copy();

    if (number2 instanceof Decimal === false) number2 = new Decimal(number2);

    const maxLen = Decimal.#getMaxLen(number1.#digitsString, number2.#digitsString);
    const maxDecimalLen = Math.max(number1.#decimalLen, number2.#decimalLen);
    const number1Value = BigInt(number1.#growDecimal(maxDecimalLen));
    const number2Value = BigInt(number2.#growDecimal(maxDecimalLen));
    const numberResult = number1Value + number2Value;


    return Decimal.#normalize(numberResult, maxDecimalLen);
  }

}

export default Decimal;
