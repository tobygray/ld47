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
  }

  destroy() {
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
