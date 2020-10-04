const assert = require('assert');
const sinon = require('sinon');
const { DriverResult } = require('../src/api/driver_result.js');

describe('Check crash count', () => {
  const driverResult = new DriverResult();
  it('starts zero', () => {
    assert.strictEqual(driverResult.crashCount, 0);
  });
  it('adds one', () => {
    driverResult.crashed();
    assert.strictEqual(driverResult.crashCount, 1);
    driverResult.crashed();
    assert.strictEqual(driverResult.crashCount, 2);
  });
});

describe('Check name behaviour', () => {
  const expectedTrackName = 'Kitten Town';
  const driverResult = new DriverResult(47, expectedTrackName);
  it('has a default name', () => {
    assert.strictEqual(driverResult.name, 'Player 48');
    assert.strictEqual(driverResult.trackName, expectedTrackName);
  });
  it('can have name set', () => {
    const newName = 'Bob';
    driverResult.name = newName;
    assert.strictEqual(driverResult.name, newName);
    assert.strictEqual(driverResult.trackName, expectedTrackName);
  });
});

describe('Check lap recording', () => {
  const driverResult = new DriverResult();
  // Use a fake clock to create fake time data.
  let clock;
  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });
  afterEach(() => {
    clock.restore();
  });

  it('starts with no laps', () => {
    assert.strictEqual(driverResult.lapCount, 0);
    assert.deepStrictEqual(driverResult.lapTimes, []);
  });
  it('can create one lap', () => {
    driverResult.startTime = Date.now();
    clock.tick(100);
    driverResult.startLap();
    assert.strictEqual(driverResult.lapCount, 1);
    assert.deepStrictEqual(driverResult.lapTimes, [100]);
    assert.strictEqual(driverResult.totalTime, Infinity);

    clock.tick(150);
    driverResult.startLap();
    assert.strictEqual(driverResult.lapCount, 2);
    assert.deepStrictEqual(driverResult.lapTimes, [100, 150]);
    assert.strictEqual(driverResult.totalTime, Infinity);

    clock.tick(75);
    driverResult.startLap();
    driverResult.finished();
    assert.strictEqual(driverResult.lapCount, 3);
    assert.deepStrictEqual(driverResult.lapTimes, [100, 150, 75]);
    assert.strictEqual(driverResult.totalTime, 325);
  });
});

describe('can serialize and deserialize', () => {
  const expectedIndex = 123;
  const expectedName = 'Nigel';
  const expectedCrashCount = 7;
  const expectedLapTimes = [123, 987, 23, 43];
  const expectedTrackName = 'Grand Laguna Beach';
  // Use a fake clock to create fake time data.
  let clock;
  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });
  afterEach(() => {
    clock.restore();
  });

  let data = {};
  it('can serialize', () => {
    const driverResult = new DriverResult(expectedIndex, expectedTrackName);
    driverResult.name = expectedName;
    for (let i = 0; i < expectedCrashCount; i += 1) {
      driverResult.crashed();
    }
    driverResult.startTime = Date.now();
    expectedLapTimes.forEach((delay) => {
      clock.tick(delay);
      driverResult.startLap();
    });

    data = driverResult.toFlatData();
    assert.notDeepStrictEqual(data, {});
  });
  it('it deserializes', () => {
    const driverResult = DriverResult.fromFlatData(data);
    assert.strictEqual(driverResult.index, expectedIndex);
    assert.strictEqual(driverResult.name, expectedName);
    assert.strictEqual(driverResult.crashCount, expectedCrashCount);
    assert.deepStrictEqual(driverResult.lapCount, expectedLapTimes.length);
    assert.deepStrictEqual(driverResult.lapTimes, expectedLapTimes);
    assert.deepStrictEqual(driverResult.trackName, expectedTrackName);
  });
});

describe('check DNF status', () => {
  const driverResult = new DriverResult();

  // Use a fake clock to create fake time data.
  let clock;
  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });
  afterEach(() => {
    clock.restore();
  });

  it('does not have a total time if unfinished', () => {
    [120, 130, 140].forEach((delay) => {
      clock.tick(delay);
      driverResult.startLap();
    });

    assert.strictEqual(driverResult.totalTime, Infinity);
  });

  it('does has a total time if finished', () => {
    driverResult.finished();

    assert.strictEqual(driverResult.totalTime, 390);
  });
});
