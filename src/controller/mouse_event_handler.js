import MouseController from './mouse';
import ThrottleHandle from './throttle_handle';

// Attempt a pseuod-DPI scale by picking at least some pixels, but favour % of the screen height.
const PIXEL_RANGE = Math.max(200, window.screen.height / 5);

class MouseEventHandler {
  constructor(app) {
    this.app = app;
    this.mouseController = new MouseController(this);
    this._downPos = null;
    this._moveListener = (event) => { this.onMouseMove(event); };
    this.showHandle = false;
    app.renderer.plugins.interaction.on(
      'mousedown',
      (event) => { this.onMouseDown(event); },
      { passive: true },
    );
    app.renderer.plugins.interaction.on(
      'mouseup',
      (event) => { this.onMouseUp(event); },
      { passive: true },
    );

    this._handle = new ThrottleHandle(app, PIXEL_RANGE);
  }

  onMouseDown(event) {
    this.mouseController.setValue(1.0);
    this._downPos = event.data.global.y + PIXEL_RANGE;
    this.app.renderer.plugins.interaction.on('mousemove', this._moveListener);
    if (this.showHandle) {
      this._handle.visible = true;
      this._handle.setPosition(event.data.global.x, event.data.global.y);
      this._handle.setValue(1.0);
    }
  }

  onMouseMove(event) {
    if (!this._downPos) {
      return;
    }
    const deltaPixels = this._downPos - event.data.global.y;
    let newValue = deltaPixels / PIXEL_RANGE;
    newValue = Math.max(0.0, newValue);
    newValue = Math.min(1.0, newValue);
    this.mouseController.setValue(newValue);
    this._handle.setValue(newValue);
  }

  onMouseUp(_event) {
    this.mouseController.setValue(0.0);
    this.app.renderer.plugins.interaction.off('mousemove', this._moveListener);
    this._downPos = null;
    this._handle.visible = false;
  }

  reAdd() {
    this._handle.reAdd();
  }

  static supported() {
    return 'onmousedown' in window;
  }
}

export default MouseEventHandler;
