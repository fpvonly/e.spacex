class GameObject {

  constructor(context = null, canvas = null, width = 0, height = 0, x = null, y = null, speed = 1, rotateSpeed = 0.05) {
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
    this.rotateSpeed = rotateSpeed;

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

  resetXY = () => {
    this.x = this.xOriginal;
    this.y = this.yOriginal;
  }

  resetX = () => {
    this.x = this.xOriginal;
  }

  resetY = () => {
    this.y = this.yOriginal;
  }

  rotateToRight = (degrees = this.rotateSpeed) => {
    if (this.rotateDegress >= 360) {
      this.rotateDegress = 0;
    }
    this.rotateDegress += degrees;
    return this.rotateDegress;
  }

  didCollideWith = (target, source) => {
    let hit = false;
    let tolerance = 0.8;
    if (typeof source === 'undefined') {
      source = this;
    }
    // check if source collides and fits inside target object
    if (source.x > target.x &&
      source.x < target.x + target.width &&
      source.y > target.y &&
      source.y < target.y + target.height) {
        hit = true;
    }

    // detect if source's RIGHT side overlaps with target object
    if (source.x + source.width * tolerance > target.x &&
      source.x + source.width * tolerance < target.x + target.width &&
      source.y < target.y  + target.height &&
      source.y + source.height * tolerance > target.y) {
        hit = true;
    }

    // detect if source's LEFT side overlaps with target object
    if (source.x < target.x + target.width * tolerance &&
      source.x + source.width > target.x + target.width * tolerance &&
      source.y < target.y + target.height * tolerance &&
      source.y + source.height > target.y) {
      hit = true;
    }
    return hit;
  }

}

export default GameObject;
