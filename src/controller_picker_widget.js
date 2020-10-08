import * as PIXI from 'pixi.js';
import NewControllerListener from './controller/new_controller_listener';
import ControllerSelection from './controller_selection';
import Player from './player';

const MAX_PLAYERS = 2;

const style = new PIXI.TextStyle({
  fontFamily: 'Arial',
  fontSize: 32,
  fill: ['#ffffff', '#00ff99'],
  stroke: '#4a1850',
  strokeThickness: 3,
  lineJoin: 'round',
});

class ControllerPicker extends PIXI.Container {
  constructor(app, controllerHandler, raceConfig) {
    super();
    this.app = app;
    this.controllerSelection = {};
    this.raceConfig = raceConfig;
    this.newControllerListener = new NewControllerListener(controllerHandler,
      (controller) => this.handleNewController(controller),
      (controller) => {
        this.handleRemovedController(controller);
      },
      raceConfig.players);

    if (controllerHandler.touchEventHandler) {
      const addTouchSprite = new PIXI.Sprite(
        PIXI.utils.TextureCache['ui/icons/add-touch.png'],
      );

      addTouchSprite.anchor.set(1, 0.5);
      addTouchSprite.position.set(
        app.renderer.width,
        700,
      );

      addTouchSprite.buttonMode = true;
      addTouchSprite.interactive = true;

      addTouchSprite.on('tap', (_evt) => {
        if (this.newControllerListener.reportTouch()) {
          addTouchSprite.visible = false;
        }
      });
      this.newControllerListener.setOfferTouchListener(() => {
        addTouchSprite.visible = true;
      });
      this.addChild(addTouchSprite);
    }

    if (controllerHandler.mouseEventHandler) {
      const addMouseSprite = new PIXI.Sprite(
        PIXI.utils.TextureCache['ui/icons/add-mouse.png'],
      );

      addMouseSprite.anchor.set(0.5, 1);
      addMouseSprite.position.set(
        app.renderer.width / 2,
        app.renderer.height,
      );

      addMouseSprite.buttonMode = true;
      addMouseSprite.interactive = true;

      addMouseSprite.on('click', (_evt) => {
        if (this.newControllerListener.reportMouse()) {
          addMouseSprite.visible = false;
        }
      });
      this.newControllerListener.setOfferMouseListener(() => {
        addMouseSprite.visible = true;
      });
      this.addChild(addMouseSprite);
    }

    const instructionText = new PIXI.Text('Press space, up, w or a button on a controller to add a player', style);
    instructionText.anchor.set(0.5, 0.5);
    instructionText.position.set(this.app.renderer.width / 2, 600);
    this.addChild(instructionText);

    // Add any pre-existing controllers.
    raceConfig.players.forEach((player, idx) => {
      console.log('Adding player from previous config', player);
      this.controllerSelection[player.controller.name] = new ControllerSelection(
        this.app, this, player, idx, MAX_PLAYERS,
      );
    });
  }

  handleNewController(controller) {
    const { players } = this.raceConfig;
    if (players.length >= MAX_PLAYERS) {
      console.log('Ignoring new controller as at maximum players', controller);
      return false;
    }
    console.log('New controller', controller);
    const idx = players.length;
    const playerName = window.localStorage.getItem(`player-${idx}`);
    const player = new Player(playerName, controller);
    this.controllerSelection[controller.name] = new ControllerSelection(
      this.app, this, player, idx, MAX_PLAYERS,
    );
    this.raceConfig.addPlayer(player);
    return true;
  }

  userRequestedRemoveController(controller) {
    this.newControllerListener.userRequestedRemoveController(controller);
  }

  handleRemovedController(controller) {
    this.raceConfig.removeController(controller);
    this.controllerSelection[controller.name].destroy();

    delete this.controllerSelection[controller.name];
    Object.values(this.controllerSelection).forEach((item, idx) => {
      item.setIndex(idx);
    });
  }

  destroy() {
    this._persistPlayerNames();

    super.destroy();
    Object.values(this.controllerSelection).forEach((item) => {
      item.destroy();
    });
    this.controllerSelection = {};
    this.newControllerListener.destroy();
    this.newControllerListener = null;
  }

  _persistPlayerNames() {
    this.raceConfig.players.forEach((player, index) => {
      if (player.name) {
        window.localStorage.setItem(`player-${index}`, player.name);
      }
    });
  }
}

function createControllerPicker(app, controllerHandler, raceConfig) {
  return new ControllerPicker(app, controllerHandler, raceConfig);
}

export default createControllerPicker;
