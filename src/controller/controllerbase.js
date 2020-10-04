class ControllerBase {
  constructor(factory, name, icon) {
    this.factory = factory;
    this.name = name;
    this.changeListener = null;
    this.icon = `ui/icons/${icon}`;

    this.setValue(this.value);
  }

  setChangeListener(listener) {
    this.changeListener = listener;
  }

  /* eslint-disable class-methods-use-this */
  remove() {
  }

  setValue(newValue) {
    const changed = this.value !== newValue;
    this.value = newValue;
    if (changed && this.changeListener) {
      this.changeListener();
    }
  }

  /* eslint-disable class-methods-use-this */
  setDangerValue(_newValue) {
  }
}

export default ControllerBase;
