const sound = require('pixi-sound').default;

const LAP_TARGET = 3;

export default class RaceResults {
  constructor(raceOverCallback) {
    this.laptimes = [[], []];
    this.lapcounts = [0, 0];
    this.crashcounts = [0, 0];
    this.startTime = 0;
    this.endTime = undefined;
    this.endRace = raceOverCallback;
  }

  start() {
    sound.play('assets/audio/sfx/321go.mp3', {
      complete: () => {
        console.log('321 sound done, enabling cars');
        this.enableCars();
      },
    });
  }

  initCars(carArray) {
    console.log('In init cars', carArray);
    carArray.forEach((car) => {
      car.enabled = false;
    });

    this.enableCars = () => {
      carArray.forEach((car) => {
        car.enabled = true;
      });
    };
  }

  onCarMovedPiece(car) {
    if (car.currentTrack === 0) {
      // Just started a new lap
      this.lapcounts[car.playerIndex] += 1;
      console.log('Car completed a lap: ', car);
    }

    this.checkEndConditions();
  }

  // TODO: subclass this an then let other people implement other rules...
  shouldEndRace() {
    return !this.lapcounts.every((count) => count < LAP_TARGET);
  }

  checkEndConditions() {
    if (this.shouldEndRace()) {
      // TODO: pause before calling this so people can see end before insta hitting results screen?
      this.endRace();
    }
  }
}
