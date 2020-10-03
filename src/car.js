import * as PIXI from 'pixi.js';

export default class Car {
  constructor() {
    this.speed = 0;
    this.power = 0;
    this.distance = 0;
    this.currentTrack = 0;
    this.fallOut = 0;
    this.pos = [0, 0];
    this.angle = 0;

    // unrotated car is pointing up
    const tex = PIXI.utils.TextureCache['assets/cars/car1.png'];
    this.sprite = new PIXI.Sprite(tex);
    // target car width is 58 for scale
    const scale = tex.width / 58;
    this.sprite.width = tex.width / scale;
    this.sprite.height = tex.height / scale;
    // anchor point is where the pin goes into the slot
    // pivot is pixel coords, anchor is proportional in size... in theory
    // non-Sprites don't have anchor, but pivot doesn't seem to work for Sprites??
    // this.sprite.pivot.x = this.sprite.width / 2;
    // this.sprite.pivot.y = this.sprite.height / 10;
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.1;
  }
}
