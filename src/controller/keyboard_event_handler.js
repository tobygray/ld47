class KeyboardEventHandler {
  constructor() {
    this.listeners = {};
    window.addEventListener(
      'keydown',
      (event) => { this.keyDownListener(event); },
      { passive: true },
    );
    window.addEventListener(
      'keyup',
      (event) => { this.keyUpListener(event); },
      { passive: true },
    );
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
    if (document.activeElement.tagName === 'INPUT') {
      return;
    }
    if (event.code in this.listeners) {
      this.listeners[event.code].keyDownEvent(event);
    }
  }

  keyUpListener(event) {
    if (document.activeElement.tagName === 'INPUT') {
      return;
    }
    if (event.code in this.listeners) {
      this.listeners[event.code].keyUpEvent(event);
    }
  }
}

export default KeyboardEventHandler;
