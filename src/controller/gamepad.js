import ControllerBase from './controllerbase';

const DEAD_ZONE = 0.09;
const XBOX_LEFT_TRIGGER_BUTTON = 6;

class GamepadController extends ControllerBase {
  constructor(factory, index) {
    super(`Gamepad-${index}`);
    this.index = index;
    this.factory = factory;

    const gp = navigator.getGamepads()[this.index];
    this.isXbox = gp.id.includes('Xbox');

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
    if (this.isXbox) {
      const triggerValue = gp.buttons[XBOX_LEFT_TRIGGER_BUTTON].value;
      if (triggerValue > value) {
        value = triggerValue;
      }
    }
    this.setValue(value);
  }
}

export default GamepadController;
