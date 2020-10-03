import KeyboardFactory from './keyboardfactory';

class NewControllerListener {
  constructor(newControllerCallback) {
    this.newControllerCallback = newControllerCallback;
    this.reported = {};
    this.keyboardFactory = new KeyboardFactory();
    this.keyboardFactory.setNewControllerListener((controller) => {
      if (!(controller.name in this.reported)) {
        this.newControllerCallback(controller);
        this.reported[controller.name] = controller;
      } else {
        controller.remove();
      }
    });
  }

  reset() {
    // Reset any listening state
    this.reported = {};
  }
}

export default NewControllerListener;
