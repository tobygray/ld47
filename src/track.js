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

    this.leftCar = new Car();
    this.container.addChild(this.leftCar.sprite);
    this.rightCar = new Car();
    this.container.addChild(this.rightCar.sprite);
  }

  makeTrack(pieces) {
    // pieces should be an array of piece names where:
    // 'r1', 'r2', 'r3', 'r4' are 22.5 degree right turns of increasing radius
    // 'l1', 'l2', 'l3', 'l4' likewise
    // 's' is a standard straight, 'ss' is a slightly shorter straight needed for some tracks
    const track = [];
    let pos = [0, 0];
    let angle = 90;
    for (const piece of pieces) {
      let radius = 0;
      let size = 0;
      let texture = 'assets/tracks/Pieces/';
      if (piece === 's') {
        size = 87;
        texture += 'SHO.png';
      } else if (piece === 'ss') {
        size = 78;
        texture += 'SSHO.png';
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
      const trackPiece = new TrackPiece(radius, size, pos, angle, texture);
      angle = trackPiece.endAngle;
      pos = trackPiece.endPos;
      track.push(trackPiece);
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
        container.addChild(sprite);
      } else {
        const line = new PIXI.Graphics();
        line.lineStyle(156, 0x666666, 1).moveTo(...piece.startPos).lineTo(...piece.endPos);
        container.addChild(line);
      }
    }
    this.container = container;
  }

  positionCars() {
    this.positionCar(this.leftCar, 'left');
    this.positionCar(this.rightCar, 'right');
  }

  positionCar(car, side) {
    if (car.fallOut > 0) {
      [car.sprite.x, car.sprite.y] = car.pos;
      car.sprite.angle = mod(car.sprite.angle + 5, 360);
      return;
    }
    // at this point we can safely assume the car is on the right piece of track
    const trackPiece = this.track[car.currentTrack];
    const pos = trackPiece.findPos(car.distance, side);
    const angle = trackPiece.findAngle(car.distance, side);
    [car.sprite.x, car.sprite.y] = pos;
    car.sprite.angle = angle;
    car.pos = pos;
    car.angle = angle;
  }

  moveCars(delta) {
    this.moveCar(delta, this.leftCar, 'left');
    this.moveCar(delta, this.rightCar, 'right');
  }

  moveCar(delta, car, side) {
    if (car.fallOut > 0) {
      // car is going to carry on at its present direction + speed
      car.pos[0] += car.speed * Math.sin(rad(car.angle));
      car.pos[1] -= car.speed * Math.cos(rad(car.angle));
      return;
    }
    let dist = car.distance + delta * car.speed;
    while (dist > this.track[car.currentTrack].getLength(side)) {
      dist -= this.track[car.currentTrack].getLength(side);
      car.totalTrack += 1;
      car.currentTrack = mod(car.totalTrack, this.track.length);
      car.currentLap = idiv(car.totalTrack, this.track.length);
    }
    car.distance = dist;
  }

  applyPhysics(delta) {
    this.applyPhysicsToCar(delta, this.leftCar, 'left');
    this.applyPhysicsToCar(delta, this.rightCar, 'right');
  }

  applyPhysicsToCar(delta, car, side) {
    const track = this.track[car.currentTrack];
    physics(delta, car, track, side);
  }

  updateCars(delta) {
    this.applyPhysics(delta);
    this.moveCars(delta);
    this.positionCars();
  }
}
