// import * as PIXI from 'pixi.js';

import Track from './track';

class TrackScreen {
  constructor(app, raceOverCallback) {
    this.app = app;
    this.raceOverCallback = raceOverCallback;

    this.track = Track.makeOval();
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
    this.track.leftCar.speed = 1;
    this.track.rightCar.speed = 1;
    this.track.moveCars(delta);
    this.track.positionCars();
  }
}

function setupTackEvent(_app, _raceOverCallback) {
  const screen = new TrackScreen(_app, _raceOverCallback);
  return screen;
}

setupTackEvent.resources = [];

export default setupTackEvent;
