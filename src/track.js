import * as PIXI from 'pixi.js';

const mod = (a, b) => ((a % b) + b) % b; // JAVASCRIIIIIIPT
const rad = (a) => (a * Math.PI) / 180;

class Track {
  constructor(radius, size, startPos, startAngle) {
    // radius = 0 for straight, size is then length
    // radius > 0 for right turn, size ignored
    // radius < 0 for left turn, size ignored
    // startPos is the coords of the start of this track
    // startAngle is the direction the car is travelling in when it enters this bit of track,
    // measured from 0 = up, in degrees
    // we need to calculate the vector from the start to the finish of this segment, the angle at
    // the end, the length if this is a curved piece, and some helper values for placing cars
    this.startPos = startPos;
    this.startAngle = startAngle;
    this.radius = radius;
    if (radius === 0) {
      this.length = size;
    } else {
      this.length = (Math.abs(radius) * Math.PI * (22.5 / 180));
    }
    this.startVector = null;
    this.endAngle = this.findAngle(this.length);
    this.endPos = this.findPos(this.length);
  }

  findPos(distance) {
    // axis handedness is graphics, not math: down is +ve y
    if (this.radius === 0) {
      const xdelta = this.length * Math.sin(rad(this.startAngle));
      const ydelta = -this.length * Math.cos(rad(this.startAngle));
      return [this.startPos[0] + xdelta, this.startPos[1] + ydelta];
    }
    // find vector from startPos to circle centre and cache it
    // then find vector from circle centre to specified point
    let angleCorrection = 90;
    if (this.radius > 0) {
      angleCorrection = -90;
    }
    if (this.startVector === null) {
      // the point on the circle that corresponds to heading in the right direction, taking the
      // corner in the right direction
      const angle = mod(this.startAngle + angleCorrection, 360);
      // vector from the origin of the circle to the starting point
      const x = Math.abs(this.radius) * Math.sin(rad(angle));
      const y = -Math.abs(this.radius) * Math.cos(rad(angle));
      this.startVector = [this.startPos[0] - x, this.startPos[1] - y];
    }
    const finalAngle = mod(this.findAngle(distance) + angleCorrection, 360);
    // vector from the origin of the circle to the end point
    const xa = Math.abs(this.radius) * Math.sin(rad(finalAngle));
    const ya = -Math.abs(this.radius) * Math.cos(rad(finalAngle));
    return [xa + this.startVector[0], ya + this.startVector[1]];
  }

  findAngle(distance) {
    const delta = (22.5 * distance) / this.length;
    if (this.radius > 0) {
      return mod(this.startAngle + delta, 360);
    }
    if (this.radius === 0) {
      return this.startAngle;
    }
    return mod(this.startAngle - delta, 360);
  }
}

function makeTrack(pieces) {
  // pieces should be an array of piece names where:
  // 'r1', 'r2', 'r3', 'r4' are 22.5 degree right turns of increasing radius
  // 'l1', 'l2', 'l3', 'l4' likewise
  // 's' is a standard straight, 'ss' is a slightly shorter straight needed for some tracks
  const track = [];
  let pos = [0, 0];
  let angle = 90;
  let radius = 0;
  let size = 0;
  for (const piece of pieces) {
    if (piece === 's') {
      radius = 0;
      size = 87;
    } else if (piece === 'ss') {
      radius = 0;
      size = 78;
    } else {
      let sign = 0;
      if (piece[0] === 'r') {
        sign = 1;
      } else if (piece[0] === 'l') {
        sign = -1;
      } else {
        throw new Error('invalid track piece');
      }
      if (piece[1] === '1') {
        radius = 214;
      } else if (piece[1] === '2') {
        radius = 370;
      } else if (piece[1] === '3') {
        radius = 526;
      } else if (piece[1] === '4') {
        radius = 682;
      } else {
        throw new Error('invalid track piece');
      }
      radius *= sign;
    }
    const trackPiece = new Track(radius, size, pos, angle);
    angle = trackPiece.endAngle;
    pos = trackPiece.endPos;
    track.push(trackPiece);
  }
  return track;
}

export function makeTrackContainer(pieces) {
  const container = new PIXI.Container();
  const track = makeTrack(pieces);
  for (const piece of track) {
    const line = new PIXI.Graphics();
    line.lineStyle(156, 0x666666, 1).moveTo(...piece.startPos).lineTo(...piece.endPos);
    container.addChild(line);
  }
  return container;
}

export function makeOvalTrack() {
  const pieces = [
    's', 's', 's', 's',
    'r2', 'r2', 'r2', 'r2', 'r2', 'r2', 'r2', 'r2',
    's', 's', 's', 's',
    'r2', 'r2', 'r2', 'r2', 'r2', 'r2', 'r2', 'r2',
  ];
  const container = makeTrackContainer(pieces);
  return container;
}
