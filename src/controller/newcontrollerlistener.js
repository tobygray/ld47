import KeyboardFactory from './keyboardfactory';
import GamepadFactory from './gamepadfactory';

class NewControllerListener {
  constructor(eventHandler, newControllerCallback, removedControllerCallback,
    alreadyReported = null) {
    this.eventHandler = eventHandler;
    this.newControllerCallback = newControllerCallback;
    this.removedControllerCallback = removedControllerCallback;
    this.reported = {};
    this.offerMouseListener = null;
    this.offerTouchListener = null;
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
    if (alreadyReported) {
      alreadyReported.forEach((player) => {
        const { controller } = player;
        this.reported[controller.name] = controller;
        controller.register();
      });
    }
  }

  destroy() {
    this.keyboardFactory.setNewControllerListener(null);
    this.gamepadEventHandler.setNewControllerListener(null);
    this.gamepadEventHandler.setRemovedControllerListener(null);
    this.setOfferMouseListener(null);
    this.setOfferTouchListener(null);
    this.reset();
    this.newControllerCallback = null;
    if (this.keyboardFactory) {
      this.keyboardFactory.destroy();
      this.keyboardFactory = null;
    }
    if (this.gamepadFactory) {
      this.gamepadFactory.destroy();
      this.gamepadFactory = null;
    }
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

  userRequestedRemoveController(controller) {
    this.removedControllerReported(controller);
    this.keyboardFactory.reportAgain(controller);
    this.gamepadEventHandler.reportAgain(controller);
    if (this.eventHandler.mouseEventHandler) {
      if (controller === this.eventHandler.mouseEventHandler.mouseController) {
        if (this.offerMouseListener) {
          this.offerMouseListener();
        }
      }
    }
    if (this.eventHandler.touchEventHandler) {
      if (controller === this.eventHandler.touchEventHandler.touchController) {
        if (this.offerTouchListener) {
          this.offerTouchListener();
        }
      }
    }
  }

  reportMouse() {
    this.newControllerReported(this.eventHandler.mouseEventHandler.mouseController);
  }

  reportTouch() {
    this.newControllerReported(this.eventHandler.touchEventHandler.touchController);
  }

  setOfferMouseListener(listener) {
    this.offerMouseListener = listener;
  }

  setOfferTouchListener(listener) {
    this.offerTouchListener = listener;
  }
}

export default NewControllerListener;
