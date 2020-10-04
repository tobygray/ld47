import * as PIXI from 'pixi.js';

const TextInput = require('pixi-text-input');

class ControllerSelection {
  constructor(app, container, player, idx, maxPlayers) {
    this.app = app;
    this.container = container;
    this.player = player;
    this.controller = player.controller;
    this._maxPlayers = maxPlayers;

    this.controllerSprite = new PIXI.Sprite(
      PIXI.utils.TextureCache[this.controller.icon],
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

    this._playerNameInput = new TextInput({
      input: {
        fontSize: '48px',
        fontFamily: 'Arial',
        color: '#4a1850',
        width: `${this.controllerSprite.width * 3}px`,
      },
      box: {
        default: { fill: 0xE8E9F3, rounded: 12, stroke: { color: 0xCBCEE0, width: 3 } },
        focused: { fill: 0xE1E3EE, rounded: 12, stroke: { color: 0xABAFC6, width: 3 } },
        disabled: { fill: 0xDBDBDB, rounded: 12 },
      },
    });
    this._playerNameInput.pivot.x = this._playerNameInput.width / 2;
    this._playerNameInput.pivot.y = this._playerNameInput.height / 2;
    this._playerNameInput.htmlInput.onkeydown = (event) => {
      if (event.code === 'Enter') {
        this._playerNameInput.htmlInput.blur();
      }
    };
    this._playerNameInput.htmlInput.onchange = (_event) => {
      this.player.name = this._playerNameInput.text;
    };
    this.container.addChild(this._playerNameInput);

    this.setIndex(idx);

    if (this.player.name) {
      this._playerNameInput.text = this.player.name;
    }

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

    this._playerNameInput.placeholder = `Player ${idx + 1}`;
    this._playerNameInput.x = xPos;
    this._playerNameInput.y = yPos + this.controllerSprite.height + 10;
  }
}

export default ControllerSelection;
