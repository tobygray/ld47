class GamepadFactory {
  constructor(gamepadEventHandler) {
    this.gamepadEventHandler = gamepadEventHandler;
    this.newControllerListener = null;
    this.removedControllerListener = null;
    this.gamepadEventHandler.setNewControllerListener((controller) => {
      this.newController(controller);
    });
    this.gamepadEventHandler.setRemovedControllerListener((controller) => {
      this.removedController(controller);
    });
    // Also detect any pre-existing controllers that change as new.
    this.gamepadEventHandler.forAllGamepads((controller) => {
      controller.setChangeListener(() => {
        controller.setChangeListener(null);
        this.newController(controller);
      });
    });
  }

  destroy() {
    this.gamepadEventHandler.forAllGamepads((controller) => {
      controller.setChangeListener(null);
    });
    this.gamepadEventHandler.setNewControllerListener(null);
    this.gamepadEventHandler.setRemovedControllerListener(null);
    this.newControllerListener = null;
    this.removedControllerListener = null;
    this.gamepadEventHandler = null;
  }

  newController(controller) {
    if (this.newControllerListener) {
      this.newControllerListener(controller);
    }
  }

  removedController(controller) {
    if (this.removedControllerListener) {
      this.removedControllerListener(controller);
    }
  }

  setNewControllerListener(listener) {
    this.newControllerListener = listener;
  }

  setRemovedControllerListener(listener) {
    this.removedControllerListener = listener;
  }
}

export default GamepadFactory;
