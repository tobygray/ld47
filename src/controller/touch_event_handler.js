import TouchController from './touch';

// Attempt a pseuod-DPI scale by picking at least 100 pixels, but favour 20% of the screen height.
const PIXEL_RANGE = Math.max(100, window.screen.height / 5);

class TouchEventHandler {
  constructor() {
    this.touchController = new TouchController(this);
    this._downPos = null;
    this._moveListener = (event) => { this.onTouchMove(event); };
    window.addEventListener('touchstart', (event) => { this.onTouchStart(event); });
    window.addEventListener('touchend', (event) => { this.onTouchEnd(event); });
    window.addEventListener('touchcancel', (event) => { this.onTouchEnd(event); });
  }

  onTouchStart(event) {
    this.touchController.setValue(0.0);
    this._downPos = event.touches[0].screenY;
    window.addEventListener('touchmove', this._moveListener);
  }

  onTouchMove(event) {
    if (!this._downPos) {
      return;
    }
    const deltaPixels = this._downPos - event.touches[0].screenY;
    let newValue = deltaPixels / PIXEL_RANGE;
    newValue = Math.max(0.0, newValue);
    newValue = Math.min(1.0, newValue);
    this.touchController.setValue(newValue);
  }

  onTouchEnd(_event) {
    this.touchController.setValue(0.0);
    window.removeEventListener('touchmove', this._moveListener);
    this._downPos = null;
  }

  static supported() {
    return 'ontouchstart' in window;
  }
}

export default TouchEventHandler;
