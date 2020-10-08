import * as PIXI from 'pixi.js';

// 800 height in total, 100 margin, 80 at end.
const MARGIN = 100;
const RANGE = 620;

class ThrottleHandle {
  constructor(app, pixelRange) {
    this.app = app;
    this._scale = pixelRange / RANGE;
    this._panel = new PIXI.Sprite(
      PIXI.utils.TextureCache['ui/icons/throttle.png'],
    );
    this._panel.anchor.set(0.5, 0);
    this._panel.visible = false;
    this._panel.scale.set(this._scale, this._scale);
    this._panel.zIndex = 500;

    this._handle = new PIXI.Sprite(
      PIXI.utils.TextureCache['ui/icons/throttle-handle.png'],
    );
    this._handle.anchor.set(0.5, 0.5);
    this._handle.visible = false;
    this._handle.scale.set(this._scale, this._scale);
    this._handle.zIndex = 501;
    this.reAdd();
  }

  set visible(isVisible) {
    this._panel.visible = isVisible;
    this._handle.visible = isVisible;
  }

  setPosition(x, y) {
    const offsetY = y - (MARGIN * this._scale);
    this._panel.position.set(x, offsetY);
    this.setValue(1.0);
  }

  setValue(newValue) {
    const yOffset = (MARGIN + ((1 - newValue) * RANGE)) * this._scale;
    const y = this._panel.position.y + yOffset;
    this._handle.position.set(this._panel.position.x, y);
  }

  reAdd() {
    this.app.stage.addChild(this._panel);
    this.app.stage.addChild(this._handle);
  }
}

export default ThrottleHandle;
