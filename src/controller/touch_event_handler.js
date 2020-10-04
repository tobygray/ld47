import TouchController from './touch';

class TouchEventHandler {
  constructor() {
    this.touchController = new TouchController(this);
  }

  static supported() {
    return 'ontouchstart' in window;
  }
}

export default TouchEventHandler;
