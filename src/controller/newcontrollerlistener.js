import KeyboardFactory from './keyboardfactory';
import GamepadFactory from './gamepadfactory';

class NewControllerListener {
  constructor(eventHandler, newControllerCallback, removedControllerCallback) {
    this.newControllerCallback = newControllerCallback;
    this.removedControllerCallback = removedControllerCallback;
    this.reported = {};
    this.keyboardFactory = new KeyboardFactory(eventHandler.keyboardEventHandler);
    this.keyboardFactory.setNewControllerListener((controller) => {
      this.newControllerReported(controller);
    });
    this.gamepadEventHandler = new GamepadFactory(eventHandler.gamepadEventHandler);
    this.gamepadEventHandler.setNewControllerListener((controller) => {
      this.newControllerReported(controller);
    });
    this.gamepadEventHandler.setRemovedControllerListener((controller) => {
      this.removedControllerReported(controller);
    });
  }

  destroy() {
    this.reset();
    this.newControllerCallback = null;
    this.keyboardFactory.destroy();
    this.keyboardFactory = null;
    this.gamepadFactory.destroy();
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
    this.removedControllerCallback(controller);
  }
}

export default NewControllerListener;
