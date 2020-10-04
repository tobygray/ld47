import createViewElementInDom from './viewer';
import setupTackEvent from './track_screen';
import Track from './track';

const $ = require('jquery');

function getTextElement() {
  return $('form#editor textarea#json');
}

function getCurrentJson() {
  return getTextElement().val();
}

function getCurrentArray() {
  const json = getCurrentJson();
  try {
    return JSON.parse(json);
  } catch (e) {
    console.log('Returning default, parse failed', json);
    return [];
  }
}

function setCurrentJSON(str) {
  // Does nothing to prove that it does still deserialise
  JSON.parse(str);
  getTextElement().val(str);
}

function setCurrentArray(arr) {
  setCurrentJSON(JSON.stringify(arr));
}

function redrawTrack(pieces, app) {
  const track = new Track(pieces);
  // TODO work out the scaling factors here properly
  track.container.scale.x = 0.5;
  track.container.scale.y = 0.5;
  track.container.x = 300;
  track.container.y = 400;
  app.stage.removeChildren();
  app.stage.addChild(track.container);
}

function setup(app) {
  $('form#editor input').on('click', (evt) => {
    // Input buttons just change the text area and hook off that
    let arr = getCurrentArray();
    if (evt.target.value !== '<--') {
      arr = arr.concat(evt.target.value);
    } else {
      arr.pop();
    }
    setCurrentArray(arr);
    redrawTrack(arr, app);
  });

  $('form#editor textarea#json').on('change keyup paste input', (_evt) => {
    redrawTrack(getCurrentArray(), app);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  createViewElementInDom(setupTackEvent.resources, setup);
});
