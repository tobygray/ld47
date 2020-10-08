class RaceConfig {
  constructor(controllerHandler) {
    this.controllerHandler = controllerHandler;
    this._track = null;
    this._players = [];
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

  addPlayer(player) {
    this._players.push(player);
    this._updated();
  }

  removePlayer(player) {
    this._players = this._players.filter(
      (item) => item !== player,
    );
    this._updated();
  }

  removeController(controller) {
    this._players = this._players.filter(
      (item) => item.controller !== controller,
    );
    this._updated();
  }

  get players() {
    return [...this._players];
  }

  get valid() {
    return (this._players.length > 0) && this._track;
  }

  _updated() {
    if (this._changeListener) {
      this._changeListener();
    }
  }
}

export default RaceConfig;
