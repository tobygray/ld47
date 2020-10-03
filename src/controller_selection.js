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
    this.idx = idx;

    this.controllerSprite = new PIXI.Sprite(
      PIXI.utils.TextureCache[controller.icon],
    );

    const xPos = (this.app.renderer.width * (idx + 1)) / (maxPlayers + 1);
    const yPos = 700;
    this.controllerSprite.anchor.set(0.5, 0.5);
    this.controllerSprite.position.set(xPos, yPos);
    this.container.addChild(this.controllerSprite);

    const playerText = new PIXI.Text(`Player ${idx + 1}`, style);
    playerText.anchor.set(0.5, 0.5);
    playerText.x = xPos;
    playerText.y = yPos + this.controllerSprite.height + 10;
    this.container.addChild(playerText);

    this.controller.setChangeListener(() => {
      this.controllerSprite.rotation = (Math.PI * this.controller.value) / 2;
    });
  }
}

export default ControllerSelection;
