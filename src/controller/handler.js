import GamepadEventHandler from './gamepad_event_handler';
import KeyboardEventHandler from './keyboard_event_handler';

class ControllerHandler {
  constructor() {
    this.keyboardEventHandler = new KeyboardEventHandler();
    this.gamepadEventHandler = new GamepadEventHandler();
  }

  enablePolling() {
    this.gamepadEventHandler.enablePolling();
  }

  disablePolling() {
    this.gamepadEventHandler.disablePolling();
  }

  poll() {
    this.gamepadEventHandler.scanGamepads();
  }
}

export default ControllerHandler;
