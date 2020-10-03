import ControllerBase from './controllerbase';

class KeyboardController extends ControllerBase {
  constructor(factory, key) {
    super('Keyboard');
    this.key = key;
    this.factory = factory;

    // Register for notifications.
    this.factory.addHandler(this, key);
  }

  remove() {
    super.remove();

    this.factory.removeHandler(this, this.key);
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
