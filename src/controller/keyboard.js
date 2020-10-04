import ControllerBase from './controllerbase';

class KeyboardController extends ControllerBase {
  constructor(factory, code) {
    super(factory, `Keyboard-${code}`, 'keyboard.png');
    this.code = code;

    this.register();
  }

  register() {
    // Register for notifications.
    this.factory.addHandler(this, this.code);
  }

  remove() {
    super.remove();

    this.factory.removeHandler(this, this.code);
  }

  keyUpEvent(event) {
    if (event.code !== this.code) {
      // Not for us so do nothing.
      return;
    }
    this.setValue(0.0);
  }

  keyDownEvent(event) {
    if (event.code !== this.code) {
      // Not for us so do nothing.
      return;
    }
    this.setValue(1.0);
  }
}

export default KeyboardController;
