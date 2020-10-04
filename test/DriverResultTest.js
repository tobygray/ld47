const assert = require('assert');
const { default: DriverResult } = require('../src/api/driver_result.js');

describe('Check crash count', () => {
  const driverResult = new DriverResult();
  it('starts zero', () => {
    assert.equal(driverResult.crashCount, 0);
  });
  it('adds one', () => {
    driverResult.crashed();
    assert.equal(driverResult.crashCount, 1);
    driverResult.crashed();
    assert.equal(driverResult.crashCount, 2);
  });
});
