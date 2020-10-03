import KeyboardController from './keyboard';

const START_KEYS = {
  ' ': null,
  w: null,
  ArrowUp: null,
};

const ENABLE_DEBUG_KEY = 'd';

class KeyboardFactory {
  constructor(keyboardEventHandler) {
    this.keyboardEventHandler = keyboardEventHandler;
    this.newControllerListener = null;

    Object.keys(START_KEYS).forEach((key) => {
      this.keyboardEventHandler.addHandler(this, key);
    });
    this.keyboardEventHandler.addHandler(this, ENABLE_DEBUG_KEY);
  }

  setNewControllerListener(listener) {
    this.newControllerListener = listener;
  }

  destroy() {
    Object.keys(START_KEYS).forEach((key) => {
      this.keyboardEventHandler.removeHandler(this, key);
    });
    this.keyboardEventHandler.removeHandler(this, ENABLE_DEBUG_KEY);
  }

  keyDownEvent(event) {
    if (event.key in START_KEYS) {
      if (this.newControllerListener) {
        if (!START_KEYS[event.key]) {
          START_KEYS[event.key] = new KeyboardController(this.keyboardEventHandler, event.key);
        } else {
          START_KEYS[event.key].register();
        }
        this.newControllerListener(START_KEYS[event.key]);
      }
    } else if (event.key === ENABLE_DEBUG_KEY) {
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
}

export default KeyboardFactory;
