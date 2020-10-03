import * as PIXI from 'pixi.js';

export default class Car {
  constructor() {
    this.speed = 0;
    this.distance = 0;
    this.currentTrack = 0;

    // unrotated car is pointing up
    this.sprite = new PIXI.Graphics();
    this.sprite.beginFill(0xaa0000).drawRect(0, 0, 58, 140).endFill();
    // anchor point is where the pin goes into the slot
    this.sprite.pivot.x = 58 / 2;
    this.sprite.pivot.y = 140 / 10;
  }
}
