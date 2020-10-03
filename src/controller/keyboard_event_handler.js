class KeyboardEventHandler {
  constructor() {
    this.listeners = {};
    window.addEventListener('keydown', (event) => { this.keyDownListener(event); }, true);
    window.addEventListener('keyup', (event) => { this.keyUpListener(event); }, true);
  }

  addHandler(listener, code) {
    this.listeners[code] = listener;
  }

  removeHandler(listener, code) {
    if (this.listeners[code] === listener) {
      delete this.listeners[code];
    }
  }

  keyDownListener(event) {
    if (event.code in this.listeners) {
      this.listeners[event.code].keyDownEvent(event);
      event.preventDefault();
    }
  }

  keyUpListener(event) {
    if (event.code in this.listeners) {
      this.listeners[event.code].keyUpEvent(event);
      event.preventDefault();
    }
  }
}

export default KeyboardEventHandler;
