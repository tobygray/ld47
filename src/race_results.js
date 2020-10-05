import createRaceLights from './race_start_lights';

const sound = require('pixi-sound').default;
const { DriverResult } = require('./api/driver_result.js');

export default class RaceResults {
  constructor(raceConfig, raceOverCallback) {
    // During the race this is absolute time stamps.
    // After the race we go through and calculate actual lap times.
    this.driverResults = [
      new DriverResult(0, raceConfig.track.name),
      new DriverResult(1, raceConfig.track.name),
    ];
    raceConfig.players.forEach((player, index) => {
      this.driverResults[index].name = player.name;
    });
    this.startTime = 0;
    this.endTime = undefined;
    this.endRace = raceOverCallback;
    this.lightsContainer = createRaceLights(0.75, raceConfig.track.lightsPosition);
    this.musicPath = raceConfig.track.music;
    this.lapTarget = raceConfig.track.laps;
  }

  start(app, container) {
    sound.play('assets/audio/sfx/321go.mp3', {
      speed: 1,
      complete: () => {
        this.enableCars();
        sound.play(this.musicPath, { loop: true, volume: 0.5, speed: 1 });
      },
    }).speed = 1;

    /* TODO: use duration from sound to sync better */
    container.addChild(this.lightsContainer);
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
    }

    this.checkEndConditions();
  }

  /* eslint-disable class-methods-use-this */
  onCarFallOut(car) {
    this.driverResults[car.playerIndex].crashed();
  }

  // TODO: subclass this an then let other people implement other rules...
  shouldEndRace() {
    return !this.driverResults.every((result) => result.lapCount < this.lapTarget);
  }

  checkEndConditions() {
    if (this.shouldEndRace()) {
      // TODO: let 2nd place finish?
      // TODO: pause before calling this so people can see end before insta hitting results screen?

      // Set any driver who hit the lap count as having finished the race.
      this.driverResults.forEach((result) => {
        if (result.lapCount >= this.lapTarget) {
          result.finished();
        }
      });
      this.endRace();
    }
  }
}
