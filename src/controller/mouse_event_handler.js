import MouseController from './mouse';

class MouseEventHandler {
  constructor() {
    this.mouseController = new MouseController(this);
  }

  static supported() {
    return 'onmousedown' in window;
  }
}

export default MouseEventHandler;
