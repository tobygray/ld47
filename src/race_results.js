export default class RaceResults {
  constructor(raceOverCallback) {
    this.laptimes = [[], []];
    this.lapcounts = [0, 0];
    this.crashcounts = [0, 0];
    this.startTime = 0;
    this.endTime = undefined;
    this.raceOverCallback = raceOverCallback;
  }

  onCarMovedPiece(car) {
    console.log(this, car);
  }
}
