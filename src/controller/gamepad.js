import ControllerBase from './controllerbase';

const DEAD_ZONE = 0.09;

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

  scan() {
    const gp = navigator.getGamepads()[this.index];
    let value = Math.abs(gp.axes[1]);
    if (value < DEAD_ZONE) {
      value = 0.0;
    }
    this.setValue(value);
  }
}

export default GamepadController;
