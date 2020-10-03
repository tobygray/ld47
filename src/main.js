import * as PIXI from 'pixi.js';
import KeyboardFactory from './controller/keyboardfactory';

/* eslint-disable no-console */
console.log('HI');

let type = 'WebGL';
if (!PIXI.utils.isWebGLSupported()) {
  type = 'canvas';
}

PIXI.utils.sayHello(type);

document.addEventListener('DOMContentLoaded', () => {
  const app = new PIXI.Application({
    width: 256, // default: 800
    height: 256, // default: 600
    antialias: true, // default: false
    transparent: false, // default: false
    resolution: 1, // default: 1
  });

  document.body.appendChild(app.view);

  app.renderer.view.style.position = 'absolute';
  app.renderer.view.style.display = 'block';
  app.renderer.autoResize = true;
  app.renderer.resize(window.innerWidth / 1.25, window.innerHeight / 1.25);

  const keyboardfactory = new KeyboardFactory();
  keyboardfactory.createController(document, ' ');
});
