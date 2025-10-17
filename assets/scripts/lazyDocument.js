export default class LazyDocument {
  #node;

  constructor(node) {
    this.#node = node;
  }

  node(selector) {
    return this.#node.querySelector(selector);
  }

  nodes(selector) {
    return this.#node.querySelectorAll(selector);
  }

  nodesArray(selector) {
    return Array.from(this.#node.querySelectorAll(selector));
  }

  event(event, callable) {
    return this.#node.addEventListener(event, callable);
  }

  get() {
    return this.#node;
  }
}
