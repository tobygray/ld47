import GamepadEventHandler from './gamepad_event_handler';
import KeyboardEventHandler from './keyboard_event_handler';

class ControllerHandler {
  constructor() {
    this.keyboardEventHandler = new KeyboardEventHandler();
    this.gamepadEventHandler = new GamepadEventHandler();
  }
}

export default ControllerHandler;
