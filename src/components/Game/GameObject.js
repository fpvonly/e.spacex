class GameObject {

  constructor(context = null, canvas = null, width = 0, height = 0, x = null, y = null, speed = 1) {
    this.context = context;
    this.canvas = canvas;

    this.x = (x === null ? (canvas.width/2) - (width/2) : x);
    this.y = (y === null ? canvas.height - height : y);
    this.xOriginal = this.x;
    this.yOriginal = this.y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.rotateDegress = 0;

    if ("ontouchstart" in document.documentElement) {
      this.width *= 2;
      this.height *= 2;
      this.y = (y === null ? canvas.height - height*2 : y);
      this.yOriginal = this.y;
    }
  }

  moveRight = (amount = 1) => {
    this.x += amount;
  }

  moveLeft = (amount = 1) => {
    this.x -= amount;
  }

  moveUp = (amount = 1) => {
    this.y -= amount;
  }

  moveDown = (amount = 1) => {
    this.y += amount;
  }

  moveToX = (x = this.xOriginal) => {
    this.x = x;
  }

  moveToY = (y = this.yOriginal) => {
    this.y = y;
  }

  reset = () => {
    this.x = this.xOriginal;
    this.y = this.yOriginal;
  }

  resetX = () => {
    this.x = this.xOriginal;
  }

  resetY = () => {
    this.y = this.yOriginal;
  }

  rotateToRight = (degrees) => {
    if (this.rotateDegress >= 360) {
      this.rotateDegress = 0;
    }
    this.rotateDegress += degrees;
    return this.rotateDegress;
  }

}

export default GameObject;
