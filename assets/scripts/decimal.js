// To-Do
// Make everything BigInt,
// Add "toNegative" function
class Decimal {
  constructor (number) {
    let numberString = number.toString();
    let decimalPointPosition = numberString.indexOf('.') + 1;

    this.noDecimalNumber = numberString.replace('.', '');
    this.customLenNumber = this.noDecimalNumber;

    if (decimalPointPosition === 0) {
      this.decimalLen = 0;
    } else {
      this.decimalLen = numberString.length - decimalPointPosition;
    }
  }

  changeNumbers(changeToValue) {
    this.noDecimalNumber = changeToValue;
    this.customLenNumber = changeToValue;
  }

  makeNegative() {
    if (this.noDecimalNumber[0] !== '-') this.changeNumbers('-' + this.noDecimalNumber);
  }

  makePositive() {
    if (this.noDecimalNumber[0] === '-') this.changeNumbers(this.noDecimalNumber.slice(1));
  }

  appendDigit(number) {
    this.changeNumbers(this.noDecimalNumber + number.toString());
  }

  deleteLastDigit() {
    this.changeNumbers(this.noDecimalNumber.toString().slice(0, -1));
  }

  growToSizeAtDecimal (value) {
    this.addedEndZeroes = value - this.decimalLen;

    if (this.addedEndZeroes === 0) this.customLenNumber;
    else if (this.addedEndZeroes > 0) this.customLenNumber = (this.noDecimalNumber.toString() + '0'.repeat(this.addedEndZeroes)).toString();
    else {
      console.error(`Error: Impossible state - endZeroesNeeded cannot be less than zero (${this.addedEndZeroes}).`);
      throw new Error('Invalid calculation result: \'endZeroesNeeded\' is negative.');
    }
  }

  moveDecimalToRight (places) {
    const someCalculationIdk = this.decimalLen - places;
    this.customLenNumber = this.customLenNumber.replace('.', '');
    if (places < 0) {
      return this.moveDecimalToLeft(-places);
    } else if (someCalculationIdk > 0) {
      this.decimalLen = someCalculationIdk;
      return this.customLenNumber = this.moveDecimalToLeft(someCalculationIdk);
    }
    else {
      this.decimalLen = 0;

      if (someCalculationIdk < 0) this.customLenNumber = this.customLenNumber + '0'.repeat(-someCalculationIdk);

      if (someCalculationIdk === 0) this.customLenNumber;

      return this.customLenNumber = (+this.customLenNumber).toString();
    }
  }

  moveDecimalToLeft (places) {
    this.customLenNumber = this.customLenNumber.replace('.', '');

    if (places < 0) {
      return this.moveDecimalToRight(-places);
    } else if (places < this.customLenNumber.length) {
      places = this.customLenNumber.length - places;
      this.decimalLen += places;
      this.customLenNumber = this.customLenNumber.slice(0, places) + '.' + this.customLenNumber.slice(places);
      // return HAVE TO SEE DECIMAL LEN VS WHOLE NUM LEN (+this.customLenNumber).toString()
      return (+this.customLenNumber).toString()
    } else {
      places -= this.customLenNumber.length;
      return this.customLenNumber = (+(this.customLenNumber = '0.' + '0'.repeat(places) + this.customLenNumber)).toString();
    }
  }
}

export default Decimal
