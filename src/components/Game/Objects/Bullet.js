import GameObject from './GameObject';
import Sounds from './Sound';
import Sprites from './Sprite';
import * as C from '../Constants';

class Bullet extends GameObject {

  constructor(context, canvas, x, y, speed = 15, direction = 'UP', type = C.PLAYER_SHIP) {
    // context, canvas, width, height, x, y, speed
    super(context, canvas, 9 * window.WINDOW_HEIGHT_ADJUST, 5 * window.WINDOW_HEIGHT_ADJUST, x, y, speed);

    this.bulletBg = Sprites.getBulletSprite(type);
    if (type === C.BLUE_UFO || type === C.ROTATING_UFO) {
      this.hasSound = false;
    } else if (type === C.PLAYER_SHIP) {
      this.hasSound = true;
    }
    this.gunBlastPlayed = false;
    this.direction = direction;
    this.active = true; // is on screen?
  }

  draw = () => {
    if (this.active === true) {
      if (this.direction === 'UP' && this.y > 0) {
        this.moveUp(this.speed);
      } else if (this.direction === 'DOWN' && this.y < this.canvas.height) {
        this.moveDown(this.speed);
      } else {
        this.active = false;
      }
      this.context.drawImage(this.bulletBg, this.x, this.y, this.width, this.height);
      if (this.hasSound === true) {
        this.playSound();
      }
    }
    return true;
  }

  playSound = () => {
    if (this.gunBlastPlayed !== true) {
      Sounds.playPlayerShipBulletSound();
      this.gunBlastPlayed = true;
    }
  }

}

export default Bullet;
