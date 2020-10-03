import ControllerBase from './controllerbase';

class KeyboardController extends ControllerBase {
  constructor(document, listeners, key) {
    super(document, 'Keyboard');
    this.key = key;
    this.listeners = listeners;

    // Register for notifications.
    this.listeners[key] = this;
  }

  remove() {
    super.remove();

    if (this.listeners[this.key] === this) {
      delete this.listeners[this.key];
    }
  }

  keyUpEvent(event) {
    if (event.key !== this.key) {
      // Not for us so do nothing.
      return;
    }
    this.setValue(0.0);
  }

  keyDownEvent(event) {
    if (event.key !== this.key) {
      // Not for us so do nothing.
      return;
    }
    this.setValue(1.0);
  }
}

export default KeyboardController;
