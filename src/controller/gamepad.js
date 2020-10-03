import ControllerBase from './controllerbase';

const DEAD_ZONE = 0.09;
const XBOX_LEFT_TRIGGER_BUTTON = 6;

class GamepadController extends ControllerBase {
  constructor(factory, index) {
    super(factory, `Gamepad-${index}`, 'controller.png');
    this.index = index;

    const gp = navigator.getGamepads()[this.index];
    this.isXbox = gp.id.includes('Xbox');
    this.hasActuators = (
      ('vibrationActuator' in gp) && ('playEffect' in gp.vibrationActuator)
    );

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

  setDangerValue(newValue) {
    if (!this.hasActuators) {
      return;
    }
    if (newValue === 0) {
      return;
    }
    const gp = navigator.getGamepads()[this.index];
    // From https://docs.google.com/document/d/1jPKzVRNzzU4dUsvLpSXm1VXPQZ8FP-0lKMT-R_p-s6g/edit
    gp.vibrationActuator.playEffect('dual-rumble', {
      duration: 50,
      strongMagnitude: newValue,
      weakMagnitude: newValue,
    });
  }
}

export default GamepadController;
