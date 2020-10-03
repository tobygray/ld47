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
  app.stage.removeChildren();
  app.stage.addChild(track.container);
}

function setup(app) {
  console.log('editor live with app: ', app);
  console.log('editor running');
  $('form#editor input').on('click', (evt) => {
    // Input buttons just change the text area and hook off that
    console.log('Click on: ', evt.target.value);
    let arr = getCurrentArray();
    console.log('Current array is: ', arr);
    if (evt.target.value !== '<--') {
      arr = arr.concat(evt.target.value);
    } else {
      arr.pop();
    }
    setCurrentArray(arr);
    console.log('New array is: ', arr);
    redrawTrack(arr, app);
  });

  $('form#editor textarea#json').on('change keyup paste input', (evt) => {
    console.log('Text area changed: ', evt.target.value);
    redrawTrack(getCurrentArray(), app);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  createViewElementInDom(setupTackEvent.resources, setup);
});
