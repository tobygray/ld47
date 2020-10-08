class Player {
  constructor(name, controller) {
    this.name = name;
    this._controller = controller;
  }

  get controller() {
    return this._controller;
  }
}

export default Player;
