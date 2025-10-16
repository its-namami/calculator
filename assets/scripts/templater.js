export default class Templater {
  get node() {
    return this.element;
  }

  constructor(element) {
    this.element = document.createElement(element);
  }

  addClass(newClass) {
    this.element.classList.add(newClass);
    return this;
  }

  removeClass(oldClass) {
    this.element.classList.remove(oldClass);
    return this;
  }

  addText(text) {
    this.element.textContent = text;
    return this;
  }

  addChild(node) {
    this.element.appendChild(node);
    return this;
  }

  setAttribute(attr, val) {
    this.element.setAttribute(attr, val);
    return this;
  }
}
