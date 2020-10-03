import KeyboardController from './keyboard';

const START_KEY = ' ';
const ENABLE_DEBUG_KEY = 'd';

class KeyboardFactory {
  constructor() {
    this.listeners = {};
    this.newControllerListener = null;

    window.addEventListener('keydown', (event) => { this.keyDownListener(event); }, true);
    window.addEventListener('keyup', (event) => { this.keyUpListener(event); }, true);
  }

  setNewControllerListener(listener) {
    this.newControllerListener = listener;
  }

  addHandler(listener, key) {
    this.listeners[key] = listener;
  }

  removeHandler(listener, key) {
    if (this.listeners[key] === listener) {
      delete this.listeners[key];
    }
  }

  keyDownListener(event) {
    let consume = true;
    if (event.key in this.listeners) {
      this.listeners[event.key].keyDownEvent(event);
    } else if (event.key === START_KEY) {
      if (this.newControllerListener) {
        this.newControllerListener(this.createController(START_KEY));
      }
    } else if (event.key === ENABLE_DEBUG_KEY) {
      const controllers = document.getElementById('controllers');
      if (controllers.style.visibility === 'visible') {
        controllers.style.visibility = 'hidden';
      } else {
        controllers.style.visibility = 'visible';
      }
    } else {
      consume = false;
    }
    if (consume) {
      event.preventDefault();
    }
  }

  keyUpListener(event) {
    if (event.key in this.listeners) {
      this.listeners[event.key].keyUpEvent(event);
    }
  }

  createController(key) {
    return new KeyboardController(this, key);
  }
}

export default KeyboardFactory;
