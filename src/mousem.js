class Mouse {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.callbacks = {
      mouseenter: [],
      mousemove: [],
    };
  }

  get xPos() {
    return this.x;
  }

  get yPos() {
    return this.y;
  }

  get position() {
    return `${this.x},${this.y}`;
  }

  addListener(type, callback) {
    document.addEventListener(type, this); // Pass `this` as the second arg to keep the context correct
    this.callbacks[type].push(callback);
  }

  // `handleEvent` is part of the browser's `EventListener` API.
  // https://developer.mozilla.org/en-US/docs/Web/API/EventListener/handleEvent
  handleEvent(event) {
    const isMousemove = event.type === "mousemove";
    const isMouseenter = event.type === "mouseenter";

    if (isMousemove || isMouseenter) {
      this.x = event.pageX;
      this.y = event.pageY;
    }

    this.callbacks[event.type].forEach((callback) => {
      callback();
    });
  }
}
