import KeyboardFactory from './keyboardfactory';
import GamepadFactory from './gamepadfactory';

class NewControllerListener {
  constructor(eventHandler, newControllerCallback) {
    this.newControllerCallback = newControllerCallback;
    this.reported = {};
    this.keyboardFactory = new KeyboardFactory(eventHandler.keyboardEventHandler);
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

  destroy() {
    this.reset();
    this.newControllerCallback = null;
    this.keyboardFactory.setNewControllerListener(null);
    this.keyboardFactory = null;
    this.gamepadFactory.setNewControllerListener(null);
    this.gamepadFactory.setRemovedControllerListener(null);
    this.gamepadFactory = null;
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
