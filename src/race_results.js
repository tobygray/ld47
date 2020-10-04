import createRaceLights from './race_start_lights';

const sound = require('pixi-sound').default;
const { DriverResult } = require('./api/driver_result.js');

const LAP_TARGET = 3;

export default class RaceResults {
  constructor(raceConfig, raceOverCallback) {
    // During the race this is absolute time stamps.
    // After the race we go through and calculate actual lap times.
    this.driverResults = [new DriverResult(0), new DriverResult(1)];
    raceConfig.players.forEach((player, index) => {
      this.driverResults[index].name = player.name;
    });
    this.startTime = 0;
    this.endTime = undefined;
    this.endRace = raceOverCallback;
  }

  start(app, container) {
    sound.play('assets/audio/sfx/321go.mp3', {
      complete: () => {
        this.enableCars();
      },
    });

    /* TODO: use duration from sound to sync better */
    const lightsContainer = createRaceLights(3, app);
    container.addChild(lightsContainer);
  }

  initCars(carArray) {
    carArray.forEach((car) => {
      car.enabled = false;
    });

    this.enableCars = () => {
      carArray.forEach((car) => {
        car.enabled = true;
      });
      this.startTime = Date.now();
      this.driverResults.forEach((result) => { result.startTime = this.startTime; });
      this.enableCars = undefined; // one shot
    };
  }

  elapsedTime() {
    if (this.startTime === 0) {
      return 0;
    }
    if (this.endTime) {
      return this.endTime - this.startTime;
    }
    return Date.now() - this.startTime;
  }

  currentLap(playerIndex) {
    if (this.startTime) {
      return this.driverResults[playerIndex].currentLapElapsed;
    }
    return 0;
  }

  bestLap(playerIndex) {
    return this.driverResults[playerIndex].bestLap;
  }

  onCarMovedPiece(car) {
    if (car.currentTrack === 0) {
      // Just started a new lap
      this.driverResults[car.playerIndex].startLap();
      console.log('Car completed a lap: ', car);
    }

    this.checkEndConditions();
  }

  /* eslint-disable class-methods-use-this */
  onCarFallOut(car) {
    console.log('Car fell out:', car);
    this.driverResults[car.playerIndex].crashed();
  }

  // TODO: subclass this an then let other people implement other rules...
  shouldEndRace() {
    return !this.driverResults.every((result) => result.lapCount < LAP_TARGET);
  }

  checkEndConditions() {
    if (this.shouldEndRace()) {
      // TODO: let 2nd place finish?
      // TODO: pause before calling this so people can see end before insta hitting results screen?
      this.endRace();
    }
  }
}
