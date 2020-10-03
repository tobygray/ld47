import ControllerBase from './controllerbase';

class GamepadController extends ControllerBase {
  constructor(factory, index) {
    super(`Gamepad-${index}`);
    this.index = index;
    this.factory = factory;

    // Register for notifications.
    this.factory.addController(this);
  }

  remove() {
    super.remove();
    this.factory.removeController(this);
  }
}

export default GamepadController;
