import KeyboardFactory from './keyboardfactory';
import GamepadFactory from './gamepadfactory';

class NewControllerListener {
  constructor(newControllerCallback) {
    this.newControllerCallback = newControllerCallback;
    this.reported = {};
    this.keyboardFactory = new KeyboardFactory();
    this.keyboardFactory.setNewControllerListener((controller) => {
      this.newControllerReported(controller);
    });
    this.gamepadFactory = new GamepadFactory();
    this.gamepadFactory.setNewControllerListener((controller) => {
      this.newControllerReported(controller);
    });
    this.gamepadFactory.setRemovedControllerListener((controller) => {
      this.removedControllerReported(controller);
    });
  }

  reset() {
    // Reset any listening state
    this.reported = {};
  }

  newControllerReported(controller) {
    if (!(controller.name in this.reported)) {
      this.newControllerCallback(controller);
      this.reported[controller.name] = controller;
    } else {
      controller.remove();
    }
  }

  removedControllerReported(controller) {
    if (controller.name in this.reported) {
      delete this.reported[controller.name];
    }
  }
}

export default NewControllerListener;
