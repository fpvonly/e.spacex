class GameObject {
  constructor(context = null, canvas = null, x = 0, y = 0, width = 0, height = 0, speed = 1) {
    this.context = context;
    this.canvas = canvas;
    
    this.x = x;
    this.y = y;
    this.xOriginal = x;
    this.yOriginal = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
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

  reset = () => {
    this.x = xOriginal;
    this.y = yOriginal;
  }

  resetX = () => {
    this.x = xOriginal;
  }

  resetY = () => {
    this.y = yOriginal;
  }
}

export default GameObject;
