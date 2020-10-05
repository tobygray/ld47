import * as PIXI from 'pixi.js';

import Car from './car';
import physics, { collide, PHYSICS_DEBUG } from './physics';
import TrackPiece from './track_piece';

const SAT = require('sat');

const mod = (a, b) => ((a % b) + b) % b; // JAVASCRIIIIIIPT
const idiv = (a, b) => Math.trunc(a / b);
const rad = (a) => (a * Math.PI) / 180;

const CAR_LENGTH = 100;

export default class Track {
  constructor(pieces) {
    this.makeTrack(pieces);
    this.makeTrackContainer(this.track);

    this.carA = new Car(0, 'left');
    this.container.addChild(this.carA.sprite);
    this.container.addChild(this.carA.smoke);
    this.carB = new Car(1, 'right');
    this.container.addChild(this.carB.sprite);
    this.container.addChild(this.carB.smoke);

    if (PHYSICS_DEBUG) {
      this.container.addChild(this.carA.corner1);
      this.container.addChild(this.carA.corner2);
      this.container.addChild(this.carA.corner3);
      this.container.addChild(this.carA.corner4);
      this.container.addChild(this.carB.corner1);
      this.container.addChild(this.carB.corner2);
      this.container.addChild(this.carB.corner3);
      this.container.addChild(this.carB.corner4);
    }
  }

  makeTrack(pieces) {
    // pieces should be an array of piece names where:
    // 'r1', 'r2', 'r3', 'r4' are 22.5 degree right turns of increasing radius
    // 'l1', 'l2', 'l3', 'l4' likewise
    // 's' is a standard straight, 'ss' is a slightly shorter straight needed for some tracks
    const track = [];
    let pos = [0, 0];
    let angle = 90;
    let zIndex = 0;
    for (const piece of pieces) {
      let radius = 0;
      let size = 0;
      let texture = 'assets/tracks/Pieces/';
      if (piece === 's') {
        size = 87.5;
        if (track.length === 0) {
          // 's' piece in position 0 is special - it's the start track piece!
          texture += 'SHO0.png';
        } else {
          texture += 'SHO.png';
        }
      } else if (piece === 'ss') {
        size = 78;
        texture += 'SSHO.png';
      } else if (piece === 's4') {
        size = 350;
        texture += 'STR.png';
      } else {
        texture += 'R';
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
        texture += piece[1] + '.png';
        radius *= sign;
      }
      const trackPiece = new TrackPiece(radius, size, pos, angle, texture, zIndex);
      angle = trackPiece.endAngle;
      pos = trackPiece.endPos;
      track.push(trackPiece);
      zIndex += 1;
    }
    this.track = track;
  }

  makeTrackContainer(track) {
    const container = new PIXI.Container();
    for (const piece of track) {
      if (piece.texture in PIXI.utils.TextureCache) {
        const sprite = new PIXI.Sprite(PIXI.utils.TextureCache[piece.texture]);
        sprite.pivot.set(0, 78); // midpoint of edge
        if (piece.radius < 0) {
          // left
          sprite.scale.y = -1;
        }
        // track sprites start pointing right
        sprite.angle = mod(piece.startAngle - 90, 360);
        [sprite.x, sprite.y] = piece.startPos;
        sprite.zIndex = piece.zIndex;
        container.addChild(sprite);
      } else {
        const line = new PIXI.Graphics();
        line.lineStyle(156, 0x666666, 1).moveTo(...piece.startPos).lineTo(...piece.endPos);
        line.zIndex = piece.zIndex;
        container.addChild(line);
      }
    }
    container.sortableChildren = true;
    this.container = container;
  }

  positionCars() {
    this.positionCar(this.carA);
    this.positionCar(this.carB);
  }

  positionCar(car) {
    if (car.fallOut > 0) {
      [car.sprite.x, car.sprite.y] = car.pos;
      car.sprite.angle = mod(car.sprite.angle + car.fallHandedness, 360);
      // arbitrary large value - stops crashing cars sliding under track
      // if guard on setting zindex avoids triggering spurious sorts
      if (car.sprite.zIndex !== 400) {
        car.sprite.zIndex = 400;
      }
      return;
    }
    // at this point we can safely assume the car is on the right piece of track
    const trackPiece = this.track[car.currentTrack];
    const pos = trackPiece.findPos(car.distance, car.side);

    let rearDist = car.distance - CAR_LENGTH;
    let rearIdx = car.currentTrack;
    while (rearDist < 0) {
      rearIdx = mod(rearIdx - 1, this.track.length);
      rearDist += this.track[rearIdx].getLength(car.side);
    }
    const rearPos = this.track[rearIdx].findPos(rearDist, car.side);
    const rearX = pos[0] - rearPos[0];
    const rearY = pos[1] - rearPos[1];
    const angle = mod((Math.atan2(rearY, rearX) * 180) / Math.PI + 90, 360) + car.tailAngle;
    [car.sprite.x, car.sprite.y] = pos;
    car.sprite.angle = angle;
    // avoid clipping under the next bit of track
    let newZIndex = trackPiece.zIndex + 4;
    if (newZIndex < 6) {
      // first two track pieces
      // set the Z index above the end of the track
      newZIndex += this.track.length;
    }
    if (car.sprite.zIndex !== newZIndex) {
      car.sprite.zIndex = newZIndex;
    }
    car.pos = pos;
    car.angle = angle;
    car.exhaust = rearPos;
  }

  moveCars(delta, raceState) {
    this.moveCar(delta, this.carA, raceState);
    this.moveCar(delta, this.carB, raceState);
  }

  moveCar(delta, car, raceState) {
    if (!car.enabled) {
      return;
    }

    if (car.fallOut > 0) {
      // car is going to carry on at its present direction + speed
      car.pos[0] += delta * car.speed * Math.sin(rad(car.angle));
      car.pos[1] -= delta * car.speed * Math.cos(rad(car.angle));
      return;
    }
    let dist = car.distance + delta * car.speed;
    while (dist > this.track[car.currentTrack].getLength(car.side)) {
      dist -= this.track[car.currentTrack].getLength(car.side);
      car.totalTrack += 1;
      car.currentTrack = mod(car.totalTrack, this.track.length);
      car.currentLap = idiv(car.totalTrack, this.track.length);
      if (raceState) {
        raceState.onCarMovedPiece(car);
      }
    }
    car.distance = dist;

    let angleDelta = car.targetAngle - car.tailAngle;
    angleDelta *= (car.speed * delta) / (2 * CAR_LENGTH);
    car.tailAngle += angleDelta;
  }

  applyPhysics(delta, raceState) {
    let coll = null;
    if (this.carA.enabled && this.carA.fallOut <= 0 && this.carB.fallOut <= 0) {
      // don't bother with collision checks for crashed or waiting cars
      coll = collide(this.carA, this.carB);
    }
    let vec1 = null;
    let vec2 = null;
    if (coll !== null) {
      // the result object gives us a vector that will uncollide the two objects by the shortest
      // path, but that's not really what we want. keep the size of the overlap, but use a direct
      // vector between the centre points
      vec1 = new SAT.V(this.carA.pos[0] - this.carB.pos[0], this.carA.pos[1] - this.carB.pos[1]);
      vec1.normalize().scale(coll.overlap);
      vec2 = vec1.clone().reverse();

      if (PHYSICS_DEBUG) {
        const force1 = new PIXI.Graphics();
        force1.lineStyle(4, 0xff00, 1).moveTo(this.carA.pos[0], this.carA.pos[1])
          .lineTo(this.carA.pos[0] + vec1.x, this.carA.pos[1] + vec1.y);
        force1.lineStyle(4, 0xff, 1).lineTo(this.carA.pos[0] + vec1.x * 2,
          this.carA.pos[1] + vec1.y * 2);
        force1.zIndex = 600;
        this.container.addChild(force1);
        const force2 = new PIXI.Graphics();
        force2.lineStyle(4, 0xff00, 1).moveTo(this.carB.pos[0], this.carB.pos[1])
          .lineTo(this.carB.pos[0] + vec2.x, this.carB.pos[1] + vec2.y);
        force2.lineStyle(4, 0xff, 1).lineTo(this.carB.pos[0] + vec2.x * 2,
          this.carB.pos[1] + vec2.y * 2);
        force2.zIndex = 600;
        this.container.addChild(force2);
      }
    }
    this.applyPhysicsToCar(delta, this.carA, raceState, vec1);
    this.applyPhysicsToCar(delta, this.carB, raceState, vec2);
  }

  applyPhysicsToCar(delta, car, raceState, coll) {
    if (!car.enabled) {
      return;
    }

    const track = this.track[car.currentTrack];
    physics(delta, car, track, car.side, raceState, coll);
  }

  updateEngineSounds() {
    if (!this.carA.engineSound || !this.carB.engineSound) {
      /*
      Working around a weird bug:

      if we call stopAll() on every transition then the scoreboard screen sometimes
      ends up with oddly fast music.

      This bug occured because the last tick that updated an engine sound playback
      speed was still running after we'd called stopAll() and after we'd started
      the new music track. Given that we'd already tried to cancel the timer before
      we reached that point though this points to an index into a sample buffer
      getting re-used after it had been realloacted to the new sample.

      To fix that we changed we remove the car engine sound objects early and if we
      get another callback fire after we thought we'd stopped then we check if they're
      defined. If they're not defined we ignore it quietly because we're probably on
      cleanup detail now anyway and that sidesetps the bug. (I HOPE!!!).
      */
      return;
    }
    // This should really be power, but for keyboard inputs speed makes a nicer effect!
    this.carA.engineSound.speed = 1 + (this.carA.speed / 5);
    this.carB.engineSound.speed = 1 + (this.carB.speed / 5);

    this.carA.engineSound.volume = 0.5 + (this.carA.power / 2);
    this.carB.engineSound.volume = 0.5 + (this.carB.power / 2);
  }

  updateSmoke() {
    this.carA.makeSmoke();
    this.carB.makeSmoke();
    this.carA.updateSmoke();
    this.carB.updateSmoke();
  }

  updateCars(delta, raceState) {
    this.applyPhysics(delta, raceState);
    this.moveCars(delta, raceState);
    this.positionCars();
    this.updateEngineSounds();
    this.updateSmoke();
  }
}
