import * as PIXI from 'pixi.js';

import Track from './track';
import RaceResults from './race_results';
import createRaceLights from './race_start_lights';
import { getBrakingDistance, getStablePower } from './physics';
import TimerDisplay from './race_timer';

class TrackScreen {
  constructor(app, raceConfig, raceState) {
    this.app = app;
    this.raceConfig = raceConfig;
    this.controllers = raceConfig.players.map((value) => value.controller);

    this.raceConfig.controllerHandler.disablePolling();

    this.track = new Track(raceConfig.track.pieces);
    this.container = this.track.container;
    // TODO work out the scaling factors here properly
    this.container.scale.x = raceConfig.track.scale;
    this.container.scale.y = raceConfig.track.scale;
    this.container.x = raceConfig.track.x;
    this.container.y = raceConfig.track.y;

    this.raceState = raceState;

    this.elapsedTimer = new TimerDisplay();
    this.elapsedTimer.container.position.set((app.renderer.width / 2) - 150, 10);
    this.elapsedTimer.container.scale.set(0.25, 0.25);

    this.carATimer = new TimerDisplay();
    this.carATimer.container.position.set(10, app.renderer.height / 4);
    this.carATimer.container.scale.set(0.25, 0.25);

    this.carAbest = new TimerDisplay();
    this.carAbest.container.position.set(10, (app.renderer.height / 4) + 60);
    this.carAbest.container.scale.set(0.25, 0.25);

    this.carBTimer = new TimerDisplay();
    this.carBTimer.container.position.set(app.renderer.width - 150, app.renderer.height / 4);
    this.carBTimer.container.scale.set(0.25, 0.25);

    this.carBbest = new TimerDisplay();
    this.carBbest.container.position.set(app.renderer.width - 150, (app.renderer.height / 4) + 60);
    this.carBbest.container.scale.set(0.25, 0.25);
  }

  ai(car, delta) {
    let trackIdx = car.currentTrack;
    let track = this.track.track[trackIdx];
    const { side } = car;
    let maxSpeed = track.getMaxSafeSpeed(side);
    // add the car's speed to work out if we need to start braking this tick
    let distance = track.getLength(side) - car.distance + delta * car.speed;
    // arbitrary lookahead of 10 track segments - might be edge cases where this isn't enough
    for (let i = 0; i < 10; i += 1) {
      trackIdx = (trackIdx + 1) % this.track.track.length;
      track = this.track.track[trackIdx];
      const speed = track.getMaxSafeSpeed(side);
      if (speed < maxSpeed) {
        // will need to slow down at some point
        const brakingDistance = getBrakingDistance(car.speed, speed);
        if (brakingDistance < distance) {
          // need to start slowing down now
          maxSpeed = speed;
        }
      }
      distance += track.getLength(side);
    }

    let power;
    if (car.speed > maxSpeed) {
      // need to brake
      power = 0;
    } else if (car.speed < 0.95 * maxSpeed) {
      // need to accelerate
      power = 1;
    } else {
      // stay at constant speed
      power = getStablePower(car);
    }
    return power;
  }

  gameLoop(delta) {
    this.elapsedTimer.updateValue(this.raceState.elapsedTime());
    this.carATimer.updateValue(this.raceState.currentLap(0));
    this.carBTimer.updateValue(this.raceState.currentLap(1));

    // TODO: trigger this in the completed laps code instead
    this.carAbest.updateValue(this.raceState.bestLap(0));
    this.carBbest.updateValue(this.raceState.bestLap(1));

    this.raceConfig.controllerHandler.poll();
    this.track.carA.power = this.controllers[0]
      ? this.controllers[0].value
      : this.ai(this.track.carA, delta);
    this.track.carB.power = this.controllers[1]
      ? this.controllers[1].value
      : this.ai(this.track.carB, delta);
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

  const raceState = new RaceResults(raceConfig, () => {
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
  container.addChild(screen.elapsedTimer.container);
  container.addChild(screen.carATimer.container);
  container.addChild(screen.carAbest.container);
  container.addChild(screen.carBTimer.container);
  container.addChild(screen.carBbest.container);

  return container;
}

setupTackEvent.resources = [
  'assets/cars/car1.png',
  'assets/cars/car2.png',

  'assets/cars/smoke.png',

  'assets/tracks/Pieces/R1.png',
  'assets/tracks/Pieces/R2.png',
  'assets/tracks/Pieces/R3.png',
  'assets/tracks/Pieces/R4.png',
  'assets/tracks/Pieces/SHO.png',
  'assets/tracks/Pieces/SHO0.png',
  'assets/tracks/Pieces/SSHO.png',
  'assets/tracks/Pieces/STR.png',
  // Audio samples for race sfx
  'assets/audio/sfx/idle_engine.mp3',
  'assets/audio/sfx/321go.mp3',
  ...createRaceLights.resources,
  ...TimerDisplay.getImages(),
];

export default setupTackEvent;
