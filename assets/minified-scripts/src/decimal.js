class Decimal {
  constructor (value) {
    this.number = +value;
    this.numberString = this.number.toString();
    this.decimalIndex = this.numberString.indexOf('.');

    if (this.decimalIndex !== -1) this.decimalLen = this.numberString.split('.')[1].toString().length
    else this.decimalLen = 0;

    this.numNoDecimal = this.number.toString().replace('.', '');
    this.numNoDecimalLen = this.numNoDecimal.length;
    this.customLenNumber = this.numNoDecimal;
  }

  growToSizeDecimal (value) {
    // const endZeroesNeeded = value - this.numNoDecimalLen;
    this.addedEndZeroes = value - this.decimalLen;

    if (this.addedEndZeroes === 0) this.customLenNumber;
    else if (this.addedEndZeroes > 0) this.customLenNumber = (this.numNoDecimal.toString() + '0'.repeat(this.addedEndZeroes)).toString();
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
