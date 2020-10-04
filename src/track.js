import * as PIXI from 'pixi.js';

import Car from './car';
import physics from './physics';
import TrackPiece from './track_piece';

const mod = (a, b) => ((a % b) + b) % b; // JAVASCRIIIIIIPT
const idiv = (a, b) => Math.trunc(a / b);
const rad = (a) => (a * Math.PI) / 180;

export default class Track {
  constructor(pieces) {
    this.makeTrack(pieces);
    this.makeTrackContainer(this.track);

    this.carA = new Car(0, 'left');
    this.container.addChild(this.carA.sprite);
    this.carB = new Car(1, 'right');
    this.container.addChild(this.carB.sprite);
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
        texture += 'SHO.png';
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
      car.sprite.angle = mod(car.sprite.angle + 5, 360);
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
    const angle = trackPiece.findAngle(car.distance, car.side);
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
      car.pos[0] += car.speed * Math.sin(rad(car.angle));
      car.pos[1] -= car.speed * Math.cos(rad(car.angle));
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
  }

  applyPhysics(delta, raceState) {
    this.applyPhysicsToCar(delta, this.carA, raceState);
    this.applyPhysicsToCar(delta, this.carB, raceState);
  }

  applyPhysicsToCar(delta, car, raceState) {
    if (!car.enabled) {
      return;
    }

    const track = this.track[car.currentTrack];
    physics(delta, car, track, car.side, raceState);
  }

  updateEngineSounds() {
    // This should really be power, but for keyboard inputs speed makes a nicer effect!
    this.carA.engineSound.speed = 1 + (this.carA.speed / 5);
    this.carB.engineSound.speed = 1 + (this.carB.speed / 5);

    this.carA.engineSound.volume = 0.5 + (this.carA.power / 2);
    this.carB.engineSound.volume = 0.5 + (this.carB.power / 2);
  }

  updateCars(delta, raceState) {
    this.applyPhysics(delta, raceState);
    this.moveCars(delta, raceState);
    this.positionCars();
    this.updateEngineSounds();
  }
}
