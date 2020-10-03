import KeyboardController from './keyboard';

class KeyboardFactory {
  constructor() {
    this.listeners = {};

    window.addEventListener('keydown', (event) => { this.keyDownListener(event); }, false);
    window.addEventListener('keyup', (event) => { this.keyUpListener(event); }, false);
  }

  keyDownListener(event) {
    if (event.key in this.listeners) {
      this.listeners[event.key].keyDownEvent(event);
    }
  }

  keyUpListener(event) {
    if (event.key in this.listeners) {
      this.listeners[event.key].keyUpEvent(event);
    }
  }

  createController(document, key) {
    return new KeyboardController(document, this.listeners, key);
  }
}

export default KeyboardFactory;
