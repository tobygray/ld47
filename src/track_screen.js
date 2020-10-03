// import * as PIXI from 'pixi.js';

import Track from './track';

class TrackScreen {
  constructor(app, raceOverCallback, raceConfig) {
    this.app = app;
    this.raceOverCallback = raceOverCallback;
    this.raceConfig = raceConfig;
    this.controllers = raceConfig.controllers;

    this.track = new Track(raceConfig.track.pieces);
    this.container = this.track.container;
    // TODO work out the scaling factors here properly
    this.container.scale.x = 0.5;
    this.container.scale.y = 0.5;
    this.container.x = 300;
    this.container.y = 400;

    // TODO: Writ actual code to render track here
    // const bgImage = new PIXI.Sprite(
    //   PIXI.utils.TextureCache['ui/race-setup-background.png'],
    // );
    // bgImage.position.set(0, 0);
    // container.addChild(bgImage);
  }

  gameLoop(delta) {
    // HACK until controller input is integrated
    this.track.leftCar.speed = this.controllers[0] ? this.controllers[0].value : 1;
    this.track.rightCar.speed = this.controllers[1] ? this.controllers[1].value : 1;
    this.track.moveCars(delta);
    this.track.positionCars();
  }
}

function setupTackEvent(_app, _raceOverCallback, raceConfig) {
  const screen = new TrackScreen(_app, _raceOverCallback, raceConfig);
  return screen;
}

setupTackEvent.resources = [
  'assets/cars/car1.png',
];

export default setupTackEvent;
