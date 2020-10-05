import * as PIXI from 'pixi.js';

import { PHYSICS_DEBUG } from './physics';

const sound = require('pixi-sound').default;

const TOTAL_SMOKE = 500;

export default class Car {
  constructor(index, side) {
    this.initSmoke();

    this.playerIndex = index;
    this.side = side;

    this.enabled = true; // For use before and after races
    this.speed = 0;
    this.power = 0;
    this.distance = 0;
    this.currentTrack = 0; // This variable counts track segments mod track length
    this.totalTrack = 0; // This counts total elapsted segments and so after the first lap is > len
    this.currentLap = 0; // Counts the current lap
    this.fallOut = 0;
    this.fallHandedness = 0;
    this.pos = [0, 0];
    this.angle = 0;
    this.dangerLevel = 0;
    this.targetAngle = 0;
    this.tailAngle = 0;
    this.currentFriction = 0;

    // unrotated car is pointing up
    const tex = PIXI.utils.TextureCache[`assets/cars/car${this.playerIndex + 1}.png`];
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

    // Audio sample for engine noise
    this.engineSound = sound.play('assets/audio/sfx/idle_engine.mp3', { loop: true });

    if (PHYSICS_DEBUG) {
      this.corner1 = new PIXI.Graphics().beginFill(0xff0000).drawCircle(0, 0, 2).endFill();
      this.corner2 = new PIXI.Graphics().beginFill(0xff00).drawCircle(0, 0, 2).endFill();
      this.corner3 = new PIXI.Graphics().beginFill(0xff).drawCircle(0, 0, 2).endFill();
      this.corner4 = new PIXI.Graphics().beginFill(0xff00ff).drawCircle(0, 0, 2).endFill();
      this.corner1.zIndex = 600;
      this.corner2.zIndex = 600;
      this.corner3.zIndex = 600;
      this.corner4.zIndex = 600;
    }
  }

  initSmoke() {
    this.allSmoke = [];

    this.smoke = new PIXI.ParticleContainer(TOTAL_SMOKE, {
      scale: true,
      position: true,
      rotation: true,
      uvs: true,
      alpha: true,
    });

    this.generateTint = () => 0x0F0F0F;

    for (let i = 0; i < TOTAL_SMOKE; i += 1) {
      const smoke = PIXI.Sprite.from('assets/cars/smoke.png');
      smoke.anchor.set(0.5);
      smoke.visible = false;
      smoke.alpha = 0; // Hide by default
      this.allSmoke.push(smoke);
      this.smoke.addChild(smoke);
    }
  }

  getFreeSmokeParticle(offX, offY) {
    let theOne = this.allSmoke[0];
    this.smoke.zIndex = this.sprite.zIndex - 1;

    for (let i = 0; i < this.allSmoke.length; i += 1) {
      if (!this.allSmoke[i].visible) {
        theOne = this.allSmoke[i];
        break;
      }

      if (theOne.alpha > this.allSmoke[i].alpha) {
        theOne = this.allSmoke[i];
      }
    }

    theOne.visible = true;
    theOne.position.set(this.exhaust[0] + offX, this.exhaust[1] + offY);
    theOne.scale.set(1, 1);
    theOne.alpha = 1;
    theOne.direction = Math.random() * Math.PI * 2;
    if (this.generateTint) {
      theOne.tint = this.generateTint();
    }

    return theOne;
  }

  updateSmoke() {
    const scaleMult = 1.1;
    const aphaMult = 0.9;
    const posMult = 10;
    this.allSmoke.forEach((s) => {
      if (s.visible) {
        s.scale.set(s.scale.x * scaleMult, s.scale.y * scaleMult);
        s.alpha *= aphaMult;
        s.position.set(s.position.x + ((Math.random() - 0.5) * posMult),
          s.position.y + ((Math.random() - 0.5) * posMult));

        if (s.alpha <= 0.05) {
          s.visible = false;
          s.alpha = 0;
        }
      }
    });
  }

  makeSmoke() {
    const amountOfSmoke = 10 + this.speed + (this.power * 5);
    const smokeSpread = 50;
    for (let i = 0; i < amountOfSmoke; i += 1) {
      const offX = (Math.random() * smokeSpread) - (smokeSpread / 2);
      const offY = Math.random() * smokeSpread - (smokeSpread / 2);
      this.getFreeSmokeParticle(offX, offY);
    }
  }
}
