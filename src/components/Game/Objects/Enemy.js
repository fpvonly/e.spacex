import GameObject from './GameObject';
import Sprites from './Sprite';
import Bullet from './Bullet';
import Explosion from './Explosion';
import * as C from '../Constants';

class Enemy extends GameObject {

  constructor(context, canvas, type = C.ROTATING_UFO) {

    let ratio = 0;
    let width =  0;
    let height = 0;
    if (type === C.ROTATING_UFO) {
      height = 115 * window.CANVAS_HEIGHT_ADJUST;
      width = height;
    } else if (type === C.ROTATING_UFO_2) {
      height = 64 * window.CANVAS_HEIGHT_ADJUST;
      width = height;
    } else if (type === C.BLUE_UFO) {
      height = 105 * window.CANVAS_HEIGHT_ADJUST;
      width = height;
    } else if (type === C.ASTEROID) {
      ratio = 320/240; // width/height
      height = 100 * window.CANVAS_HEIGHT_ADJUST;
      width = height * ratio;
    }
    let randomX = Math.floor(Math.random() * (canvas.width - width));
    let randomY = canvas.height + Math.floor(Math.random() * (canvas.height));
    randomY = -Math.abs(randomY)

    // context, canvas, width, height, x, y, speed, rotation speed
    super(context, canvas, width, height, randomX, randomY, (type === C.ASTEROID ? 5 : 3), (type === C.ASTEROID ? 0.1 : 0.05));

    this.type = type;
    this.shooting = true;
    this.enemyBg = Sprites.getEnemySprite(this.type);
    if (this.type === C.ROTATING_UFO || this.type === C.ROTATING_UFO_2) {
      this.rotating = true;
    } else if (this.type === C.BLUE_UFO) {
      this.rotating = false;
    } else if (this.type === C.ASTEROID) {
      this.rotating = true;
      this.shooting = false;
    }
    this.bullets = [];
    this.active = true; // i.e. has not gone past the bottom of the canvas
    this.destroyed = false; // has not collided with player ship or player bullet
    this.wasDestroyedInYCoord = -1; // the y-coordinate at the moment of destruction
    this.wasDestroyedInXCoord = 0; // the x-coordinate where to draw the explosion, left or right side of the enemy ship
    this.explosion = new Explosion(this.context, this.canvas);
    this.shootInterval = null;
    this.shootTime = 6000;
  }

  shoot = () => {
    if (this.y > 25) { // prevent shooting when enemy is not on screen
      if (this.shootInterval === null) {
        this.generateShotsPerInterval();
      }

      this.shootInterval = setInterval(() => {
        this.generateShotsPerInterval();
      }, this.shootTime);
    }
  }

  generateShotsPerInterval = () => {
    let bulletX = this.x;
    let bulletY = this.y;
    let newBullets = [];
    for (let i = 0; i < (this.type === C.ROTATING_UFO ? 2 : (this.type === C.ROTATING_UFO_2 ? 1 : 3)); i++) {
      newBullets.push(
        new Bullet(
          this.context,
          this.canvas,
          bulletX + this.width/2,
          bulletY + this.height + ((this.type === C.ROTATING_UFO ? 5*i : 15*i) * window.CANVAS_HEIGHT_ADJUST),
          5,
          'DOWN',
          this.type)
        );
    }
    this.bullets.push(...newBullets);
  }

  draw = () => {
    if (this.active === true) {
      if (this.y < this.canvas.height) {
        this.moveDown(this.speed);
        if (this.type === C.ASTEROID) {
          this.moveLeft(this.speed/2);
        }
      } else {
        this.active = false;
      }

      if (this.rotating === true) {
        this.context.setTransform(1, 0, 0, 1, this.x, this.y);
        this.context.setTransform(1, 0, 0, 1, this.x + (this.width/2), this.y + (this.height/2)); // needed to keep coords valid for collision detection
        this.context.rotate(this.rotateToRight());
        this.context.drawImage(this.enemyBg, -(this.width/2), -(this.height/2), this.width, this.height);
        this.context.setTransform(1, 0, 0, 1, 0, 0); // reset
      } else {
        this.context.drawImage(this.enemyBg, this.x, this.y, this.width, this.height);
      }

      if (this.destroyed === true) {
        if (this.type === C.ASTEROID) {
            this.explosion.moveToX(this.x);
        } else {
          this.explosion.moveToX(this.wasDestroyedInXCoord); // this coord remains the same until the end of explosion
        }
        this.explosion.moveToY(this.y + this.height/2);
        this.explosion.draw();
      }
      if (this.active === false || (this.destroyed === true && this.explosion.isExplosionAnimationComplete() === true)) {
        this.reSpawn();
      }
    }

    if (this.shooting === true) {
      if (this.shootInterval === null && this.destroyed === false) {
        this.shoot(); // activate shooting interval
      }
      // draw bullets of even destroyed enemies
      for (let bullet of this.bullets) {
        if (bullet.active === true) {
          bullet.draw();
        }
      }
    }
    return true;
  }

  destroy = () => {
    if (this.destroyed === false) {
      this.destroyed = true;
      this.wasDestroyedInYCoord = this.y;
      this.wasDestroyedInXCoord = (Math.random() > 0.5 ? this.x + this.width : this.x); // randomly left or right side of the enemy ship
    }
  }

  getActiveBullets = () => {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      if (this.bullets[i].active === false) {
        this.bullets.splice(i, 1);
      }
    }
    return this.bullets;
  }

  reSpawn = () => {
    let randomX = Math.floor(Math.random() * (this.canvas.width - this.width));
    let randomY = Math.floor(Math.random() * (this.canvas.height - this.height));
    this.moveToX(randomX);
    this.moveToY(-Math.abs(randomY));
    this.active = true
    this.destroyed = false;
    this.explosion.resetFrames();
    clearInterval(this.shootInterval);
    this.shootInterval = null;

    return true;
  }

}

export default Enemy;
