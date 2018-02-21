import GameObject from './GameObject';
import Bullet from './Bullet';
import Explosion from './Explosion';

const ASTEROID = 'asteroid';
const BLUE_UFO = 'blueUFO';
const ROTATING_UFO = 'rotatingUFO';

class Enemy extends GameObject {

  constructor(context, canvas, type = ROTATING_UFO) {

    let ratio = 0;
    let width =  0;
    let height = 0;

    if (type === ROTATING_UFO) {
      height = (canvas.height/10 < 512 ? canvas.height/10 : 512);
      width = height;
    } else if (type === BLUE_UFO) {
      height = (canvas.height/10 < 198 ? canvas.height/10 : 198);
      width = height;
    } else if (type === 'asteroid') {
      ratio = 320/240; // width/height
      height = (canvas.height/10 < 240 ? canvas.height/10 : 240);
      width = height * ratio;
    }

    let randomX = Math.floor(Math.random() * (canvas.width - width));
    let randomY = Math.floor(Math.random() * (canvas.height - height));
    randomY = -Math.abs(randomY)

    // context, canvas, width, height, x, y, speed
    super(context, canvas, width, height, randomX, randomY, (type === ASTEROID ? 8 : 5), (type === ASTEROID ? 0.1 : 0.05));

    this.type = type;
    this.shooting = true;
    this.enemyBg = new Image();
    if (this.type === ROTATING_UFO) {
      this.enemyBg.src = "assets/images/enemy.png";
      this.rotating = true;
    } else if (this.type === BLUE_UFO) {
      this.enemyBg.src = "assets/images/enemy_2.png";
      this.rotating = false;
    } else if (this.type === ASTEROID) {
      this.enemyBg.src = "assets/images/a10003.png";
      this.rotating = true;
      this.shooting = false;
    }

    this.bullets = [];
    this.active = true; // i.e. is within screen
    this.destroyed = false; // has not collided
    this.wasDestroyedInYCoord = -1; // the y-coordinate at the moment of destruction
    this.wasDestroyedInXCoord = 0; // the x-coordinate where to draw the explosion, left or right side of the enemy ship
    this.explosion = new Explosion(this.context, this.canvas);
  }

  shoot = () => {
    let bulletX = this.x;
    let bulletY = this.y;
    let bullet = new Bullet(this.context, this.canvas, (bulletX + this.width/2 - 5), bulletY);
    this.bullets.push(bullet);
  }

  draw = () => {
    if (this.active === true) {
      if (this.y < this.canvas.height + this.height/2) {
        this.moveDown(this.speed);
        if (this.type === ASTEROID) {
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
        this.explosion.moveToX(this.wasDestroyedInXCoord); // this coord remains the same until the end of explosion
        this.explosion.moveToY(this.y + this.height/2);
        this.explosion.draw();
        this.explosion.playSound();
      }
      if (this.active === false || (this.destroyed === true && this.explosion.isExplosionAnimationComplete() === true)) {
        this.reSpawn();
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

  getBullets = () => {
    for (let bullet of this.bullets) {
      if (bullet.active === false) {
        this.bullets.shift(); // the inactive bullet is always the first bullet in the array
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

    return true;
  }

}

export default Enemy;
