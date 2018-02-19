import GameObject from './GameObject';

const KEYS = {
  32: 'SPACE',
  37: 'LEFT',
  38: 'UP',
  39: 'RIGHT',
  40: 'DOWN'
};

class Ship extends GameObject {
  constructor(context, canvas) {
    // context, canvas, x, y, width, height
    super(context, canvas, canvas.width/2, canvas.height-canvas.height/10, canvas.height/10, canvas.height/10);
    this.shipBg = new Image();
    this.shipBg.src = "assets/images/ship.png";

    window.addEventListener('keydown', this.steer, false);
  }

  steer = (e) => {
    e.preventDefault();

    switch(KEYS[e.keyCode]) {
      case 'LEFT':
        if (this.x > 0) {
          this.moveLeft(16);
        }
        break;
      case 'RIGHT':
        if (this.x <= this.canvas.width - this.width) {
          this.moveRight(16);
        }
        break;
      case 'UP':
        if (this.y > 0) {
          this.moveUp(16);
        }
        break;
      case 'DOWN':
        if (this.y < this.canvas.height - this.height) {
          this.moveDown(16);
        }
        break;
    }
  }

  draw = () => {
    this.context.drawImage(this.shipBg, this.x, this.y, this.width, this.height);
  }
}

export default Ship;
