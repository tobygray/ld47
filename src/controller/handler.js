import GamepadEventHandler from './gamepad_event_handler';
import KeyboardEventHandler from './keyboard_event_handler';
import MouseEventHandler from './mouse_event_handler';
import TouchEventHandler from './touch_event_handler';

class ControllerHandler {
  constructor() {
    this.keyboardEventHandler = new KeyboardEventHandler();
    this.gamepadEventHandler = new GamepadEventHandler();
    if (TouchEventHandler.supported()) {
      this.touchEventHandler = new TouchEventHandler();
    } else {
      this.touchEventHandler = null;
    }
    if (MouseEventHandler.supported()) {
      this.mouseEventHandler = new MouseEventHandler();
    } else {
      this.mouseEventHandler = null;
    }
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
