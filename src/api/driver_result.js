class DriverResult {
  constructor(index) {
    this._index = index;
    this._name = null;
    this._lapTimes = [];
    this._crashCount = 0;
    this._startTime = 0;
  }

  set startTime(startTime) {
    this._startTime = startTime;
  }

  set name(name) {
    this._name = name;
  }

  get name() {
    if (this._name) {
      return this._name;
    }
    return `Player ${this._index + 1}`;
  }

  get lapCount() {
    return this._lapTimes.length;
  }

  get lapTimes() {
    return [...this._lapTimes];
  }

  get crashCount() {
    return this._crashCount;
  }

  startLap() {
    this._lapTimes.push(Date.now() - this._startTime);
  }

  crashed() {
    this._crashCount = 1;
  }
}

export default DriverResult;
