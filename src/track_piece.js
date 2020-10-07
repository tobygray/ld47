import { getMaxSpeed } from './physics';

const mod = (a, b) => ((a % b) + b) % b; // JAVASCRIIIIIIPT
const rad = (a) => (a * Math.PI) / 180;

export default class TrackPiece {
  constructor(radius, size, startPos, startAngle, texture, zIndex, cross = false) {
    // radius = 0 for straight, size is then length
    // radius > 0 for right turn, size ignored
    // radius < 0 for left turn, size ignored
    // startPos is the coords of the start of this track
    // startAngle is the direction the car is travelling in when it enters this bit of track,
    // measured from 0 = up, in degrees
    // cross is for crossover pieces: 1 for the first half, -1 for the second. (trust me.)
    // we need to calculate the vector from the start to the finish of this segment, the angle at
    // the end, the length if this is a curved piece, and some helper values for placing cars
    this.startPos = startPos;
    this.startAngle = startAngle;
    this.radius = radius;
    this.totalAngle = 22.5;
    this.cross = cross;
    if (radius === 0) {
      this.length = size;
      this.leftLength = size;
      this.rightLength = size;
    } else {
      if (cross !== false) {
        this.length = size;
        // left track always right turns
        this.leftRadius = this.radius + 39;
        this.rightRadius = -this.radius - 39;
        this.totalAngle = 25.1;
      } else {
        this.length = (Math.abs(radius) * Math.PI * (this.totalAngle / 180));
        this.leftRadius = radius + 39;
        this.rightRadius = radius - 39;
      }
      this.leftLength = (Math.abs(this.leftRadius) * Math.PI * (this.totalAngle / 180));
      this.rightLength = (Math.abs(this.rightRadius) * Math.PI * (this.totalAngle / 180));
    }
    this.startVector = null;
    this.startVectorCross = null;
    this.endAngle = this.findAngle(this.length);
    this.endPos = this.findPos(this.length);
    this.texture = texture;
    this.zIndex = zIndex;
    this.maxSafeSpeedLeft = getMaxSpeed(this, 'left');
    this.maxSafeSpeedRight = getMaxSpeed(this, 'right');
  }

  findPos(distance, side = 'middle') {
    // axis handedness is graphics, not math: down is +ve y
    if ((this.radius === 0) || ((this.cross !== false) && (side === 'middle'))) {
      let xdelta = distance * Math.sin(rad(this.startAngle));
      let ydelta = -distance * Math.cos(rad(this.startAngle));
      if (side !== 'middle') {
        // add a 39 offset at 90 degrees
        let angle = this.startAngle;
        if (side === 'left') {
          angle = mod(angle - 90, 360);
        } else if (side === 'right') {
          angle = mod(angle + 90, 360);
        }
        xdelta += 39 * Math.sin(rad(angle));
        ydelta += -39 * Math.cos(rad(angle));
      }
      return [this.startPos[0] + xdelta, this.startPos[1] + ydelta];
    }
    // find vector from startPos to circle centre and cache it
    // then find vector from circle centre to specified point
    let angleCorrection = 90;
    const radius = this.getRadius(side);
    if (radius > 0) {
      angleCorrection = -90;
    }
    // HACK just calculate the startVector each time for crossover pieces, which need an opposite
    // vector for each side.
    if (this.startVector === null || this.cross !== false) {
      let startRadius = this.radius;
      let crossCorrection = 0;
      if (this.cross === -1) {
        startRadius = this.getRadius(side);
        crossCorrection = this.totalAngle;
        if (startRadius > 0) {
          crossCorrection *= -1;
        }
      }
      // the point on the circle that corresponds to heading in the right direction, taking the
      // corner in the right direction
      const angle = mod(this.startAngle + angleCorrection + crossCorrection, 360);
      // vector from the origin of the circle to the starting point
      const x = Math.abs(startRadius) * Math.sin(rad(angle));
      const y = -Math.abs(startRadius) * Math.cos(rad(angle));
      this.startVector = [this.startPos[0] - x, this.startPos[1] - y];
    }
    const finalAngle = mod(this.findAngle(distance, side) + angleCorrection, 360);
    // vector from the origin of the circle to the end point
    const xa = Math.abs(radius) * Math.sin(rad(finalAngle));
    const ya = -Math.abs(radius) * Math.cos(rad(finalAngle));
    return [xa + this.startVector[0], ya + this.startVector[1]];
  }

  findAngle(distance, side = 'middle') {
    const length = this.getLength(side);
    const delta = (this.totalAngle * distance) / length;
    let crossCorrection = 0;
    if (this.cross === -1) {
      crossCorrection = this.totalAngle;
    }
    if (this.radius === 0 || (this.cross !== false && side === 'middle')) {
      return this.startAngle;
    }
    if (this.getRadius(side) > 0) {
      return mod(this.startAngle + delta - crossCorrection, 360);
    }
    return mod(this.startAngle - delta + crossCorrection, 360);
  }

  getLength(side = 'middle') {
    if (side === 'left') {
      return this.leftLength;
    }
    if (side === 'right') {
      return this.rightLength;
    }
    return this.length;
  }

  getRadius(side = 'middle') {
    if (this.radius === 0) {
      return 0;
    }
    if (side === 'left') {
      return this.leftRadius;
    }
    if (side === 'right') {
      return this.rightRadius;
    }
    return this.radius;
  }

  getMaxSafeSpeed(side) {
    if (side === 'right') {
      return this.maxSafeSpeedRight;
    }
    return this.maxSafeSpeedLeft;
  }
}
