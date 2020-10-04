import * as PIXI from 'pixi.js';

PIXI.utils.sayHello('WebGL');

const WORLD_WIDTH = 1920;
const WORLD_HEIGHT = 1080;
const WORLD_RATIO = WORLD_WIDTH / WORLD_HEIGHT;

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
  app.renderer.view.style.top = '50%';
  app.renderer.view.style.left = '50%';
  app.renderer.view.style.transform = 'translateX(-50%) translateY(-50%)';
  app.renderer.autoResize = true;
  app.renderer.resize(WORLD_WIDTH, WORLD_HEIGHT);

  const resize = () => {
    const windowRatio = window.innerWidth / window.innerHeight;
    let newWidth;
    let newHeight;
    if (windowRatio >= WORLD_RATIO) {
      // Height is shortest direction.
      newWidth = window.innerHeight * WORLD_RATIO;
      newHeight = window.innerHeight;
    } else {
      // Width is shortest direction.
      newWidth = window.innerWidth;
      newHeight = window.innerWidth / WORLD_RATIO;
    }
    app.renderer.view.style.width = newWidth + 'px';
    app.renderer.view.style.height = newHeight + 'px';
  };
  window.onresize = resize;
  resize();

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
