class KeyboardEventHandler {
  constructor() {
    this.listeners = {};
    window.addEventListener('keydown', (event) => { this.keyDownListener(event); }, true);
    window.addEventListener('keyup', (event) => { this.keyUpListener(event); }, true);
  }

  addHandler(listener, key) {
    this.listeners[key] = listener;
  }

  removeHandler(listener, key) {
    if (this.listeners[key] === listener) {
      delete this.listeners[key];
    }
  }

  keyDownListener(event) {
    if (event.key in this.listeners) {
      this.listeners[event.key].keyDownEvent(event);
      event.preventDefault();
    }
  }

  keyUpListener(event) {
    if (event.key in this.listeners) {
      this.listeners[event.key].keyUpEvent(event);
      event.preventDefault();
    }
  }
}

export default KeyboardEventHandler;
