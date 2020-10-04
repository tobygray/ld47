import Track from './track';

const sound = require('pixi-sound').default;

class TrackScreen {
  constructor(app, raceOverCallback, raceConfig) {
    this.app = app;
    this.raceOverCallback = raceOverCallback;
    this.raceConfig = raceConfig;
    this.controllers = raceConfig.controllers;

    this.raceConfig.controllerHandler.disablePolling();

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
    this.raceConfig.controllerHandler.poll();
    this.track.leftCar.power = this.controllers[0] ? this.controllers[0].value : 0.5;
    this.track.rightCar.power = this.controllers[1] ? this.controllers[1].value : 0.5;
    if (this.controllers[0]) {
      this.controllers[0].setDangerValue(this.track.leftCar.dangerLevel);
    }
    if (this.controllers[1]) {
      this.controllers[1].setDangerValue(this.track.rightCar.dangerLevel);
    }
    this.track.updateCars(delta);
  }
}

function setupTackEvent(_app, _raceOverCallback, raceConfig) {
  const screen = new TrackScreen(_app, _raceOverCallback, raceConfig);
  sound.play('assets/audio/sfx/321go.mp3');
  return screen;
}

setupTackEvent.resources = [
  'assets/cars/car1.png',
  'assets/tracks/Pieces/R1.png',
  'assets/tracks/Pieces/R2.png',
  'assets/tracks/Pieces/SHO.png',
  'assets/tracks/Pieces/SSHO.png',
  // Audio samples for race sfx
  'assets/audio/sfx/idle_engine.mp3',
  'assets/audio/sfx/321go.mp3',
];

export default setupTackEvent;
