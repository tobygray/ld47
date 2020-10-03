import * as PIXI from 'pixi.js';
import NewControllerListener from './controller/newcontrollerlistener';
import ControllerSelection from './controller_selection';

const MAX_PLAYERS = 4;

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
    this.newControllerListener = new NewControllerListener(controllerHandler, (controller) => {
      this.handleNewController(controller);
    },
    (controller) => {
      this.handleRemovedController(controller);
    });

    const instructionText = new PIXI.Text('Press space or a button on a controller to add a player', style);
    instructionText.anchor.set(0.5, 0.5);
    instructionText.position.set(this.app.renderer.width / 2, 600);
    this.addChild(instructionText);
  }

  handleNewController(controller) {
    const { controllers } = this.raceConfig;
    if (controllers.length >= MAX_PLAYERS) {
      console.log('Ignoring new controller as at maximum players', controller);
      return;
    }
    console.log('New controller', controller);
    const idx = controllers.length;
    this.controllerSelection[controller.name] = new ControllerSelection(
      this.app, this, controller, idx, MAX_PLAYERS,
    );
    this.raceConfig.addController(controller);
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
    super.destroy();
    this.newControllerListener.destroy();
    this.newControllerListener = null;
  }
}

function createControllerPicker(app, controllerHandler, raceConfig) {
  return new ControllerPicker(app, controllerHandler, raceConfig);
}

export default createControllerPicker;
