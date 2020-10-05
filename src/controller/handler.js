import GamepadEventHandler from './gamepad_event_handler';
import KeyboardEventHandler from './keyboard_event_handler';
import MouseEventHandler from './mouse_event_handler';
import TouchEventHandler from './touch_event_handler';

class ControllerHandler {
  constructor(app) {
    this.keyboardEventHandler = new KeyboardEventHandler();
    this.gamepadEventHandler = new GamepadEventHandler();
    if (TouchEventHandler.supported()) {
      this.touchEventHandler = new TouchEventHandler(app);
    } else {
      this.touchEventHandler = null;
    }
    if (MouseEventHandler.supported()) {
      this.mouseEventHandler = new MouseEventHandler(app);
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

  reAdd() {
    if (this.touchEventHandler) {
      this.touchEventHandler.reAdd();
    }
    if (this.mouseEventHandler) {
      this.mouseEventHandler.reAdd();
    }
  }
}

export default ControllerHandler;
