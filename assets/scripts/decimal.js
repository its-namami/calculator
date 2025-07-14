class Decimal {
  #isNegative;
  #absDigits;
  #decimalLen;
  #rawDigits;

  constructor (number) {
    if (!Number.isFinite(+number)) return Decimal.#error('badNum', number);

    let numberString = number.toString();
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

  add(secondDecimal) {
    const firstDecimal = this.#getCopy();

    if (secondDecimal instanceof Decimal === false) secondDecimal = new Decimal(secondDecimal);

    const maxLen = Math.max(firstDecimal.#absDigits.length, secondDecimal.#absDigits.length);
    const maxDecimalLen = Math.max(firstDecimal.#decimalLen, secondDecimal.#decimalLen);
    const firstDecimalValue = BigInt(firstDecimal.#growDecimal(maxDecimalLen));
    const secondDecimalValue = BigInt(secondDecimal.#growDecimal(maxDecimalLen));
    const numberResult = firstDecimalValue + secondDecimalValue;

    return new Decimal(Decimal.#normalize(numberResult, maxDecimalLen));
  }

  multiply(secondDecimal) {
    const firstDecimal = this.#getCopy();

    if (secondDecimal instanceof Decimal === false) secondDecimal = new Decimal(secondDecimal);

    const sumLen = firstDecimal.#decimalLen + secondDecimal.#decimalLen;
    const numberResult = BigInt(firstDecimal.#rawDigits) * BigInt(secondDecimal.#rawDigits);

    return new Decimal(Decimal.#normalize(numberResult, sumLen));
  }

  divide(secondDecimal) {
    const firstDecimal = this.#getCopy();

    if (secondDecimal instanceof Decimal === false) secondDecimal = new Decimal(secondDecimal);

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

    return new Decimal(Decimal.#normalize(result, decimals));
  }

  #getCopy() {
    return new Decimal(this.value);
  }

  #growDecimal(scale) {
    const decimalsNeeded = scale - this.#decimalLen;

    if (decimalsNeeded < 0) return Decimal.#error('badScale', decimalsNeeded);

    return this.#rawDigits + '0'.repeat(decimalsNeeded);
  }

  static #error(error = 'default', info = undefined) {
    switch (error) {
      case 'badNum':
        throw new Error (`Incorrect number: ${info}!`);
      case 'badScale':
        throw new Error (`Cannot have less than 0 decimals: (${info})!`);
      case 'divideZero':
        throw new Error ('Cannot divide by zero!');
      case 'default':
        throw new Error ('Fatal error, that\'s all we know...');
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
