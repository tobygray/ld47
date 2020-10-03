import * as PIXI from 'pixi.js';

class ControllerSelection {
  constructor(app, container, controller, idx, maxPlayers) {
    this.app = app;
    this.container = container;
    this.controller = controller;
    this.idx = idx;

    this.controllerSprite = new PIXI.Sprite(
      PIXI.utils.TextureCache[controller.icon],
    );

    this.controllerSprite.anchor.set(0.5, 0.5);
    this.controllerSprite.position.set(
      (this.app.renderer.width * (idx + 1)) / (maxPlayers + 1),
      700,
    );

    this.container.addChild(this.controllerSprite);

    this.controller.setChangeListener(() => {
      this.controllerSprite.rotation = (Math.PI * this.controller.value) / 2;
    });
  }
}

export default ControllerSelection;
