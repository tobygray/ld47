import createRaceLights from './race_start_lights';

const sound = require('pixi-sound').default;

const LAP_TARGET = 3;

export default class RaceResults {
  constructor(raceOverCallback) {
    // During the race this is absolute time stamps.
    // After the race we go through and calculate actual lap times.
    this.laptimes = [[], []];
    this.lapcounts = [0, 0];
    this.crashcounts = [0, 0];
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
    };
  }

  onCarMovedPiece(car) {
    if (car.currentTrack === 0) {
      // Just started a new lap
      this.laptimes[car.playerIndex].push(Date.now());
      this.lapcounts[car.playerIndex] += 1; // We could just compute this from laptimes array length
      console.log('Car completed a lap: ', car);
    }

    this.checkEndConditions();
  }

  /* eslint-disable class-methods-use-this */
  onCarFallOut(car) {
    console.log('Car fell out:', car);
    this.crashcounts[car.playerIndex] += 1;
  }

  // TODO: subclass this an then let other people implement other rules...
  shouldEndRace() {
    return !this.lapcounts.every((count) => count < LAP_TARGET);
  }

  computeRealLaptimes() {
    // At the end of a race our laptimes array is a collection of times when we crossed
    // the line. This re-computes those to be the times of each actual lap!
    this.laptimes = this.laptimes.map((times) => {
      const arr = [];
      let lastTime = this.startTime;
      times.forEach((t) => {
        arr.push(t - lastTime);
        lastTime = t;
      });
      return arr;
    });
  }

  checkEndConditions() {
    if (this.shouldEndRace()) {
      this.computeRealLaptimes();
      console.log(this.laptimes);
      // TODO: let 2nd place finish?
      // TODO: pause before calling this so people can see end before insta hitting results screen?
      this.endRace();
    }
  }
}
