class KeyboardEventHandler {
  constructor() {
    this.listeners = {};
    this.factoryListeners = {};
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

  addFactoryHandler(listener, code) {
    this.factoryListeners[code] = listener;
  }

  removeFactoryHandler(listener, code) {
    if (this.factoryListeners[code] === listener) {
      delete this.factoryListeners[code];
    }
  }

  keyDownListener(event) {
    if (document.activeElement.tagName === 'INPUT') {
      return;
    }
    if (event.code in this.listeners) {
      this.listeners[event.code].keyDownEvent(event);
    } else if (event.code in this.factoryListeners) {
      this.factoryListeners[event.code].keyDownEvent(event);
    }
  }

  keyUpListener(event) {
    if (document.activeElement.tagName === 'INPUT') {
      return;
    }
    if (event.code in this.listeners) {
      this.listeners[event.code].keyUpEvent(event);
    } else if (event.code in this.factoryListeners) {
      this.factoryListeners[event.code].keyUpEvent(event);
    }
  }
}

export default KeyboardEventHandler;
