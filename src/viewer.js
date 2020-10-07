import * as PIXI from 'pixi.js';
import * as ProgressBar from 'progressbar.js';

PIXI.utils.sayHello('WebGL');

const WORLD_WIDTH = 1920;
const WORLD_HEIGHT = 1080;
const WORLD_RATIO = WORLD_WIDTH / WORLD_HEIGHT;

let lastWindowSize = [0, 0];

let progressBar;

function loadProgressHandler(loader, resource) {
  progressBar.animate(loader.progress / 100);
  document.getElementById('pgtxt').innerHTML = `${Math.round(loader.progress)}%<br />${resource.url}`;

  // NOTE: resource.data lets you access the file's raw binary data
  console.log('loading: ' + resource.url);
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

  const mobileBrowser = /android|ipod|iphone/i.test(navigator.userAgent);
  if (mobileBrowser) {
    setInterval(() => {
      if ((lastWindowSize[0] !== window.innerWidth) || (lastWindowSize[1] !== window.innerHeight)) {
        lastWindowSize = [window.innerWidth, window.innerHeight];
        resize();
      }
    }, 100);
  } else {
    resize();
  }
  callback(app);
}

function createViewElementInDom(resources, callback) {
  progressBar = new ProgressBar.Circle('#progress', {
    color: '#FCB03C',
    duration: 1000,
    easing: 'easeInOut',
  });

  const app = new PIXI.Application({
    width: 256, // default: 800
    height: 256, // default: 600
    antialias: true, // default: false
    transparent: false, // default: false
    resolution: 1, // default: 1
  });

  PIXI.Loader.shared.onProgress.add(loadProgressHandler);

  function cleanupProgressBar() {
    function removeElement() {
      document.getElementById('progress').remove();
      setup(app, callback);
    }
    progressBar.animate(1, {}, removeElement);
  }

  // Load stuff for UI
  PIXI.Loader.shared
    .add(resources)
    .load(cleanupProgressBar);
}

export default createViewElementInDom;
