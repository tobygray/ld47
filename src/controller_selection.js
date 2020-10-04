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
    this.controllerSprite.anchor.set(0.5, 0.5);
    this.container.addChild(this.controllerSprite);

    this._deleteSprite = new PIXI.Sprite(
      PIXI.utils.TextureCache['ui/icons/close-cross.png'],
    );
    this._deleteSprite.anchor.set(0.5, 0.5);
    this._deleteSprite.buttonMode = true;
    this._deleteSprite.interactive = true;
    this._deleteSprite.on('pointertap', (_ev) => {
      this.container.userRequestedRemoveController(this.controller);
    });
    this.container.addChild(this._deleteSprite);

    this._playerText = new PIXI.Text('', style);
    this._playerText.anchor.set(0.5, 0.5);
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
    this.container.removeChild(this._deleteSprite);
    this.controllerSprite = null;
    this._playerText = null;
  }

  setIndex(idx) {
    this.idx = idx;

    const xPos = (this.app.renderer.width * (idx + 1)) / (this._maxPlayers + 1);
    const yPos = 700;
    this.controllerSprite.position.set(xPos, yPos);

    this._deleteSprite.position.set(
      xPos + (this.controllerSprite.width / 2),
      yPos - (this.controllerSprite.height / 2),
    );

    this._playerText.text = `Player ${idx + 1}`;
    this._playerText.x = xPos;
    this._playerText.y = yPos + this.controllerSprite.height + 10;
  }
}

export default ControllerSelection;
