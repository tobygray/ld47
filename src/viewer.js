import * as PIXI from 'pixi.js';

PIXI.utils.sayHello('WebGL');

function loadProgressHandler(loader, resource) {
  // NOTE: resource.data lets you access the file's raw binary data

  // Display the file `url` currently being loaded
  console.log('loading: ' + resource.url);

  // Display the percentage of files currently loaded
  console.log('progress: ' + loader.progress + '%');
}

function setup(app, callback) {
  document.body.appendChild(app.view);

  app.renderer.view.style.position = 'absolute';
  app.renderer.view.style.display = 'block';
  app.renderer.autoResize = true;
  app.renderer.resize(1920, 1080);

  callback(app);
}

function createViewElementInDom(resources, callback) {
  const app = new PIXI.Application({
    width: 256, // default: 800
    height: 256, // default: 600
    antialias: true, // default: false
    transparent: false, // default: false
    resolution: 1, // default: 1
  });

  PIXI.Loader.shared.onProgress.add(loadProgressHandler);

  // Load stuff for UI
  PIXI.Loader.shared
    .add(resources)
    .load(() => setup(app, callback));
}

export default createViewElementInDom;
