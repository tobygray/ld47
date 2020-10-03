import KeyboardController from './keyboard';

const START_KEY = ' ';
const ENABLE_DEBUG_KEY = 'd';
let PLAYER_1_CONTROLLER;

class KeyboardFactory {
  constructor(keyboardEventHandler) {
    this.keyboardEventHandler = keyboardEventHandler;
    this.newControllerListener = null;

    this.keyboardEventHandler.addHandler(this, START_KEY);
    this.keyboardEventHandler.addHandler(this, ENABLE_DEBUG_KEY);
  }

  setNewControllerListener(listener) {
    this.newControllerListener = listener;
  }

  destroy() {
    this.keyboardEventHandler.removeHandler(this, START_KEY);
    this.keyboardEventHandler.removeHandler(this, ENABLE_DEBUG_KEY);
  }

  keyDownEvent(event) {
    if (event.key === START_KEY) {
      if (this.newControllerListener) {
        if (!PLAYER_1_CONTROLLER) {
          PLAYER_1_CONTROLLER = new KeyboardController(this.keyboardEventHandler, event.key);
        } else {
          PLAYER_1_CONTROLLER.register();
        }
        this.newControllerListener(PLAYER_1_CONTROLLER);
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
