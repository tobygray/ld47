import * as PIXI from 'pixi.js';

import Car from './car';
import TrackPiece from './track_piece';

const mod = (a, b) => ((a % b) + b) % b; // JAVASCRIIIIIIPT
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
      const trackPiece = new TrackPiece(radius, size, pos, angle);
      angle = trackPiece.endAngle;
      pos = trackPiece.endPos;
      track.push(trackPiece);
    }
    this.track = track;
  }

  makeTrackContainer(track) {
    const container = new PIXI.Container();
    for (const piece of track) {
      const line = new PIXI.Graphics();
      line.lineStyle(156, 0x666666, 1).moveTo(...piece.startPos).lineTo(...piece.endPos);
      container.addChild(line);
    }
    this.container = container;
  }

  positionCars() {
    this.positionCar(this.leftCar, 'left');
    this.positionCar(this.rightCar, 'right');
  }

  positionCar(car, side) {
    // at this point we can safely assume the car is on the right piece of track
    const trackPiece = this.track[car.currentTrack];
    const pos = trackPiece.findPos(car.distance, side);
    const angle = trackPiece.findAngle(car.distance, side);
    [car.sprite.x, car.sprite.y] = pos;
    car.sprite.rotation = rad(angle);
  }

  moveCars(delta) {
    this.moveCar(delta, this.leftCar, 'left');
    this.moveCar(delta, this.rightCar, 'right');
  }

  moveCar(delta, car, side) {
    let dist = car.distance + delta * car.speed;
    while (dist > this.track[car.currentTrack].getLength(side)) {
      dist -= this.track[car.currentTrack].getLength(side);
      car.currentTrack = mod(car.currentTrack + 1, this.track.length);
    }
    car.distance = dist;
  }
}
