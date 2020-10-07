import TouchController from './touch';
import ThrottleHandle from './throttle_handle';

// Attempt a pseuod-DPI scale by picking at least some pixels, but favour % of the screen height.
const PIXEL_RANGE = Math.max(400, window.screen.height / 2);

class TouchEventHandler {
  constructor(app) {
    this.app = app;
    this.touchController = new TouchController(this);
    this._downPos = null;
    this._moveListener = (event) => { this.onTouchMove(event); };
    this.showHandle = false;
    app.renderer.plugins.interaction.on('touchstart', (event) => { this.onTouchStart(event); });
    app.renderer.plugins.interaction.on('touchend', (event) => { this.onTouchEnd(event); });
    app.renderer.plugins.interaction.on('touchcancel', (event) => { this.onTouchEnd(event); });
    this._handle = new ThrottleHandle(app, PIXEL_RANGE);
  }

  onTouchStart(event) {
    this.touchController.setValue(1.0);
    this._downPos = event.data.global.y + PIXEL_RANGE;
    this.app.renderer.plugins.interaction.on('touchmove', this._moveListener);
    if (this.showHandle) {
      this._handle.visible = true;
      this._handle.setPosition(event.data.global.x, event.data.global.y);
      this._handle.setValue(1.0);
    }
  }

  onTouchMove(event) {
    if (!this._downPos) {
      return;
    }
    const deltaPixels = this._downPos - event.data.global.y;
    let newValue = deltaPixels / PIXEL_RANGE;
    newValue = Math.max(0.0, newValue);
    newValue = Math.min(1.0, newValue);
    this.touchController.setValue(newValue);
    this._handle.setValue(newValue);
  }

  onTouchEnd(_event) {
    this.touchController.setValue(0.0);
    this.app.renderer.plugins.interaction.off('touchmove', this._moveListener);
    this._downPos = null;
    this._handle.visible = false;
  }

  reAdd() {
    this._handle.reAdd();
  }

  static supported() {
    return 'ontouchstart' in window;
  }
}

export default TouchEventHandler;
