import * as PIXI from 'pixi.js';

const LIGHTS_ORDERED = [
  'assets/lights/light-r.png',
  'assets/lights/light-a.png',
  'assets/lights/light-g.png',
];

export default function startRaceLights(timeSec, position) {
  const container = new PIXI.Container();
  container.zIndex = 99999; // There, i fixed it
  const lightSprites = LIGHTS_ORDERED.map((imgPath, i) => {
    const sprite = new PIXI.Sprite(
      PIXI.utils.TextureCache[imgPath],
    );
    sprite.position.set(...position);
    sprite.anchor.set(0.5, 0.5);
    if (!i) {
      sprite.visible = true;
    } else {
      sprite.visible = false;
      setTimeout(() => {
        lightSprites.forEach((x) => { x.visible = false; });
        sprite.visible = true;
      }, 1000 * i);
    }
    container.addChild(sprite);
    setTimeout(() => {
      container.removeChildren();
    }, 4000);

    return sprite;
  });
  return container;
}
startRaceLights.resources = LIGHTS_ORDERED;
