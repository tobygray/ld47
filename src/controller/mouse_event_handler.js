import MouseController from './mouse';

// Attempt a pseuod-DPI scale by picking at least 100 pixels, but favour 10% of the screen height.
const PIXEL_RANGE = Math.max(100, window.screen.height / 10);

class MouseEventHandler {
  constructor() {
    this.mouseController = new MouseController(this);
    this._downPos = null;
    this._moveListener = (event) => { this.onMouseMove(event); };
    window.addEventListener(
      'mousedown',
      (event) => { this.onMouseDown(event); },
      { passive: true },
    );
    window.addEventListener(
      'mouseup',
      (event) => { this.onMouseUp(event); },
      { passive: true },
    );
  }

  onMouseDown(event) {
    this.mouseController.setValue(0.0);
    this._downPos = event.screenY;
    window.addEventListener('mousemove', this._moveListener);
  }

  onMouseMove(event) {
    if (!this._downPos) {
      return;
    }
    const deltaPixels = this._downPos - event.screenY;
    let newValue = deltaPixels / PIXEL_RANGE;
    newValue = Math.max(0.0, newValue);
    newValue = Math.min(1.0, newValue);
    this.mouseController.setValue(newValue);
  }

  onMouseUp(_event) {
    this.mouseController.setValue(0.0);
    window.removeEventListener('mousemove', this._moveListener);
    this._downPos = null;
  }

  static supported() {
    return 'onmousedown' in window;
  }
}

export default MouseEventHandler;
