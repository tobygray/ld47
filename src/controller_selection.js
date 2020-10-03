import * as PIXI from 'pixi.js';

const style = new PIXI.TextStyle({
  fontFamily: 'Arial',
  fontSize: 48,
  fontStyle: 'italic',
  fontWeight: 'bold',
  fill: ['#ffffff', '#00ff99'], // gradient
  stroke: '#4a1850',
  strokeThickness: 5,
  dropShadow: true,
  dropShadowColor: '#000000',
  dropShadowBlur: 4,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 6,
  lineJoin: 'round',
});

class ControllerSelection {
  constructor(app, container, controller, idx, maxPlayers) {
    this.app = app;
    this.container = container;
    this.controller = controller;
    this._maxPlayers = maxPlayers;

    this.controllerSprite = new PIXI.Sprite(
      PIXI.utils.TextureCache[controller.icon],
    );
    this.container.addChild(this.controllerSprite);

    this._playerText = new PIXI.Text('', style);
    this.container.addChild(this._playerText);

    this.setIndex(idx);

    this.controller.setChangeListener(() => {
      this.controllerSprite.rotation = (Math.PI * this.controller.value) / 2;
    });
  }

  destroy() {
    this.controller.setChangeListener(null);
    this.container.removeChild(this.controllerSprite);
    this.container.removeChild(this._playerText);
    this.controllerSprite = null;
    this._playerText = null;
  }

  setIndex(idx) {
    this.idx = idx;

    const xPos = (this.app.renderer.width * (idx + 1)) / (this._maxPlayers + 1);
    const yPos = 700;
    this.controllerSprite.anchor.set(0.5, 0.5);
    this.controllerSprite.position.set(xPos, yPos);

    this._playerText.text = `Player ${idx + 1}`;
    this._playerText.anchor.set(0.5, 0.5);
    this._playerText.x = xPos;
    this._playerText.y = yPos + this.controllerSprite.height + 10;
  }
}

export default ControllerSelection;
