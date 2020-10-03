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
  constructor(app, controllerHandler, raceState) {
    super();
    this.app = app;
    this.controller_selections = [];
    this.controllers = raceState.controllers;
    this.newControllerListener = new NewControllerListener(controllerHandler, (controller) => {
      this.handleNewController(controller);
    });

    const instructionText = new PIXI.Text('Press space or a button on a controller to add a player', style);
    instructionText.anchor.set(0.5, 0.5);
    instructionText.position.set(this.app.renderer.width / 2, 600);
    this.addChild(instructionText);
  }

  handleNewController(controller) {
    if (this.controllers.length >= MAX_PLAYERS) {
      console.log('Ignoring new controller as at maximum players', controller);
      return;
    }
    console.log('New controller', controller);
    const idx = this.controllers.length;
    this.controller_selections.push(
      new ControllerSelection(this.app, this, controller, idx, MAX_PLAYERS),
    );
    this.controllers.push(controller);
  }

  destroy() {
    super.destroy();
    this.newControllerListener.destroy();
    this.newControllerListener = null;
  }
}

function createControllerPicker(app, controllerHandler, raceState) {
  return new ControllerPicker(app, controllerHandler, raceState);
}

export default createControllerPicker;
