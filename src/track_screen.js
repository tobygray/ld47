import * as PIXI from 'pixi.js';

import Track from './track';
import RaceResults from './race_results';
import createRaceLights from './race_start_lights';

class TrackScreen {
  constructor(app, raceConfig, raceState) {
    this.app = app;
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

    this.raceState = raceState;

    // TODO: Writ actual code to render track here
    // const bgImage = new PIXI.Sprite(
    //   PIXI.utils.TextureCache['ui/race-setup-background.png'],
    // );
    // bgImage.position.set(0, 0);
    // container.addChild(bgImage);
  }

  gameLoop(delta) {
    this.raceConfig.controllerHandler.poll();
    this.track.carA.power = this.controllers[0] ? this.controllers[0].value : 0.5;
    this.track.carB.power = this.controllers[1] ? this.controllers[1].value : 0.5;
    if (this.controllers[0]) {
      this.controllers[0].setDangerValue(this.track.carA.dangerLevel);
    }
    if (this.controllers[1]) {
      this.controllers[1].setDangerValue(this.track.carB.dangerLevel);
    }
    this.track.updateCars(delta, this.raceState);
  }
}

function setupTackEvent(app, raceOverCallback, raceConfig) {
  let screen;

  function ticker(delta) {
    screen.gameLoop(delta);
  }

  const raceState = new RaceResults(() => {
    // Our race result object needs a callback to end the race when it sees fit.
    // Our callback needs to remove the ticker *and* call the original callback we
    // were provided with.
    app.ticker.remove(ticker);
    raceOverCallback(raceConfig, raceState);
  });
  screen = new TrackScreen(app, raceConfig, raceState);
  app.ticker.add(ticker);

  raceState.initCars([screen.track.carA, screen.track.carB]);
  raceState.start(app, screen.container);

  const bgImage = new PIXI.Sprite(PIXI.utils.TextureCache[raceConfig.track.background]);
  bgImage.position.set(0, 0);
  bgImage.anchor.set(0, 0);

  const container = new PIXI.Container();
  container.addChild(bgImage);
  container.addChild(screen.container);

  return container;
}

setupTackEvent.resources = [
  'assets/cars/car1.png',
  'assets/cars/car2.png',

  'assets/tracks/Pieces/R1.png',
  'assets/tracks/Pieces/R2.png',
  'assets/tracks/Pieces/R3.png',
  'assets/tracks/Pieces/R4.png',
  'assets/tracks/Pieces/SHO.png',
  'assets/tracks/Pieces/SSHO.png',
  // Audio samples for race sfx
  'assets/audio/sfx/idle_engine.mp3',
  'assets/audio/sfx/321go.mp3',
  ...createRaceLights.resources,
];

export default setupTackEvent;
