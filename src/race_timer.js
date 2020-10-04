import * as PIXI from 'pixi.js';

const LCD_IMAGES = {
  0: 'assets/lcd/0.png',
  1: 'assets/lcd/1.png',
  2: 'assets/lcd/2.png',
  3: 'assets/lcd/3.png',
  4: 'assets/lcd/4.png',
  5: 'assets/lcd/5.png',
  6: 'assets/lcd/6.png',
  7: 'assets/lcd/7.png',
  8: 'assets/lcd/8.png',
  9: 'assets/lcd/9.png',
  '.': 'assets/lcd/decimal.png',
  ':': 'assets/lcd/colon.png',
  ';': 'assets/lcd/colon0.png',
};

export default class TimerDisplay {
  constructor() {
    this.container = new PIXI.Container();
    this.lastTimerValue = undefined;
  }

  static charToSpriteName(ch) {
    if (ch === ':' && (Date.now() / 1000) % 2 > 0.5) {
      ch = ';';
    }
    return LCD_IMAGES[ch];
  }

  static makeSpriteArray(s) {
    let offset = 0;
    // "00:12:34.01" => [sprite, sprite, sprite]
    return s.split('').map((ch) => [TimerDisplay.charToSpriteName(ch), ch]).map(([imgName, _ch]) => {
      const sprite = new PIXI.Sprite(PIXI.utils.TextureCache[imgName]);
      sprite.anchor.set(0, 0);
      sprite.position.set(offset, 0);
      offset += sprite.width;

      return sprite;
    });
  }

  updateValue(timeMs) {
    if (timeMs === Infinity) {
      return;
    }

    // https://stackoverflow.com/a/19700358
    const milliseconds = timeMs % 1000;
    let seconds = Math.floor((timeMs / 1000) % 60);
    let minutes = Math.floor((timeMs / (1000 * 60)) % 60);
    const hours = Math.floor((timeMs / (1000 * 60 * 60)) % 24);

    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;

    const timerString = `${hours}:${minutes}:${seconds}.${milliseconds}`;
    if (this.lastTimerValue === timerString) {
      return;
    }

    this.container.removeChildren();
    const timeSprites = TimerDisplay.makeSpriteArray(timerString);
    this.container.addChild(...timeSprites);
    this.lastTimerValue = timerString;
  }

  static getImages() {
    return Object.values(LCD_IMAGES);
  }
}
