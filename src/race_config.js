class RaceConfig {
  constructor() {
    this._track = null;
    this._controllers = [];
    this._changeListener = null;
  }

  setChangeListener(listener) {
    this._changeListener = listener;
  }

  set track(selectedTrack) {
    this._track = selectedTrack;
    this._updated();
  }

  get track() {
    return this._track;
  }

  addController(controller) {
    this._controllers.push(controller);
    this._updated();
  }

  removeController(controller) {
    this._controllers = this._controllers.filter(
      (item) => item !== controller,
    );
    this._updated();
  }

  get controllers() {
    return [...this._controllers];
  }

  get valid() {
    return (this._controllers.length > 0) && this._track;
  }

  _updated() {
    if (this._changeListener) {
      this._changeListener();
    }
  }
}

export default RaceConfig;
