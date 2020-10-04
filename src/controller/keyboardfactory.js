import KeyboardController from './keyboard';

const START_KEYS = {
  Space: null,
  KeyW: null,
  ArrowUp: null,
};

const ENABLE_DEBUG_KEY = 'KeyD';

class KeyboardFactory {
  constructor(keyboardEventHandler) {
    this.keyboardEventHandler = keyboardEventHandler;
    this.newControllerListener = null;

    Object.keys(START_KEYS).forEach((code) => {
      this.keyboardEventHandler.addHandler(this, code);
    });
    this.keyboardEventHandler.addHandler(this, ENABLE_DEBUG_KEY);
  }

  setNewControllerListener(listener) {
    this.newControllerListener = listener;
  }

  destroy() {
    Object.keys(START_KEYS).forEach((code) => {
      this.keyboardEventHandler.removeHandler(this, code);
    });
    this.keyboardEventHandler.removeHandler(this, ENABLE_DEBUG_KEY);
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
    } else if (event.code === ENABLE_DEBUG_KEY) {
      const controllers = document.getElementById('controllers');
      if (controllers.style.visibility === 'visible') {
        controllers.style.visibility = 'hidden';
      } else {
        controllers.style.visibility = 'visible';
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
