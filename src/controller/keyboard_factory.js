import KeyboardController from './keyboard';

const START_KEYS = {
  Space: null,
  KeyW: null,
  ArrowUp: null,
};

class KeyboardFactory {
  constructor(keyboardEventHandler) {
    this.keyboardEventHandler = keyboardEventHandler;
    this.newControllerListener = null;

    Object.keys(START_KEYS).forEach((code) => {
      this.keyboardEventHandler.addFactoryHandler(this, code);
    });
  }

  setNewControllerListener(listener) {
    this.newControllerListener = listener;
  }

  destroy() {
    Object.keys(START_KEYS).forEach((code) => {
      this.keyboardEventHandler.removeFactoryHandler(this, code);
    });
  }

  keyDownEvent(event) {
    if (event.code in START_KEYS) {
      if (this.newControllerListener) {
        if (!START_KEYS[event.code]) {
          START_KEYS[event.code] = new KeyboardController(this.keyboardEventHandler, event.code);
        } else {
          START_KEYS[event.code].register();
        }
        this.newControllerListener(START_KEYS[event.code]);
      }
    }
  }

  /* eslint-disable class-methods-use-this */
  keyUpEvent(_event) {
  }

  reportAgain(controller) {
    if (Object.values(START_KEYS).includes(controller)) {
      this.keyboardEventHandler.addHandler(this, controller.code);
    }
  }
}

export default KeyboardFactory;
