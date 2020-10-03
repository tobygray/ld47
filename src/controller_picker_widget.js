import * as PIXI from 'pixi.js';
import NewControllerListener from './controller/newcontrollerlistener';
import ControllerSelection from './controller_selection';

const MAX_PLAYERS = 4;

class ControllerPicker extends PIXI.Container {
  constructor(app, raceState) {
    super();
    this.app = app;
    this.controller_selections = [];
    this.controllers = raceState.controllers;
    this.newControllerListener = new NewControllerListener((controller) => {
      this.handleNewController(controller);
    });
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

function createControllerPicker(app, raceState) {
  const picker = new ControllerPicker(app, raceState);

  return picker;
}

export default createControllerPicker;
