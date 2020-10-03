class ControllerBase {
  constructor(document, name) {
    this.div = document.createElement('div');
    this.div.className = 'controller';
    this.value = 0.0;

    this.trackDiv = document.createElement('div');
    this.trackDiv.className = 'controller-track';
    this.div.appendChild(this.trackDiv);

    this.labelDiv = document.createElement('div');
    this.labelDiv.className = 'controller-label';
    this.labelDiv.innerHTML = name;
    this.div.appendChild(this.labelDiv);

    this.handleDiv = document.createElement('div');
    this.handleDiv.className = 'controller-handle';
    this.trackDiv.appendChild(this.handleDiv);

    this.debugDiv = document.createElement('div');
    this.debugDiv.className = 'controller-debug';
    this.trackDiv.appendChild(this.debugDiv);

    document.getElementById('controllers').appendChild(this.div);
    this.setValue(this.value);
  }

  getValue() {
    return this.value;
  }

  remove() {
    this.div.remove();
  }

  setValue(newValue) {
    this.value = newValue;
    this.debugDiv.innerHTML = this.value.toFixed(2);
    const handleRange = this.trackDiv.offsetHeight - this.handleDiv.offsetHeight;
    const handlePosition = (1 - this.value) * handleRange;
    this.handleDiv.style.top = `${handlePosition}px`;
  }
}

export default ControllerBase;
