export default class NumberDisplayScale {
  #numberDisplay;
  #numberDisplayText;
  #initFontSize;

  constructor(numberElement, numberTextElement, fontSize) {
    this.#numberDisplay = numberElement;
    this.#numberDisplayText = numberTextElement;
    this.#initFontSize = fontSize;
  }

  #clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
  }

  #handleFontSize() {
    const scale = this.#numberDisplay.clientWidth / this.#numberDisplayText.clientWidth;
    const fontSize = this.#numberDisplayText.style.fontSize?.split('px')[0] || this.#initFontSize;
    const newFontSize = this.#clamp(fontSize * scale, +this.#initFontSize / 3, +this.#initFontSize);
    this.#numberDisplayText.style.fontSize = newFontSize + 'px';
  }

  start() {
    new ResizeObserver(() => {
      this.#handleFontSize();
    }).observe(this.#numberDisplayText);
  }
}
