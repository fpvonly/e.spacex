import GameObject from './GameObject';
import Bullet from './Bullet';
import Explosion from './Explosion';

class Enemy extends GameObject {

  constructor(context, canvas, type = 'rotatingUFO') {

    let ratio = 0;
    let width =  0;
    let height = 0;

    if (type === 'rotatingUFO') {
      width = (canvas.height/10 < 512 ? canvas.height/10 : 512);
      height = width;
    } else {
      width = (canvas.height/10 < 198 ? canvas.height/10 : 198);
      height = width;
    }

    let randomX = Math.floor(Math.random() * (canvas.width - canvas.height/10 + 1)) + 0;
    let randomY = Math.floor(Math.random() * (canvas.height - canvas.height/10 + 1)) + 0;
    randomY = -Math.abs(randomY)

    // context, canvas, width, height, x, y, speed
    super(context, canvas, width, height, randomX, randomY, 5);

    this.rotating = false;
    if (type === 'rotatingUFO') {
      this.enemyBg = new Image();
      this.rotating = true;
      this.enemyBg.src = "assets/images/enemy.png";
    } else {
      this.enemyBg = new Image();
      this.enemyBg.src = "assets/images/enemy_2.png";
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
      } else {
        this.active = false;
      }

      if (this.rotating === true) {
        this.context.setTransform(1, 0, 0, 1, this.x, this.y);
        this.context.rotate(this.rotateToRight(0.05));
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
      if (this.destroyed === true && this.explosion.isExplosionAnimationComplete() === true) {
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
    this.resetY();
    let randomX = Math.floor(Math.random() * (this.canvas.width - this.width + 1)) + 0;
    this.moveToX(randomX);
    this.active = true
    this.destroyed = false;
    this.explosion.resetFrames();

    return true;
  }

}

export default Enemy;
