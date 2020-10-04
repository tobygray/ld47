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

  onCarMovedPiece(car) {
    if (car.currentTrack === 0) {
      // Just started a new lap
      this.lapcounts[car.playerIndex] += 1;
      console.log('Car completed a lap: ', car);
    }

    this.checkEndConditions();
  }

  /* eslint-disable class-methods-use-this */
  onCarFallOut(car) {
    console.log('Car fell out:', car);
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
