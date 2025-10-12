export default class LazyDocument {
  static node(selector) {
    return document.querySelector(selector);
  }

  static nodes(selector) {
    return document.querySelectorAll(selector);
  }

  static event(event, callable) {
    return document.addEventListener(event, callable);
  }
}
