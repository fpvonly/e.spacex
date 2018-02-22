import GameObject from './GameObject';

const BLUE_UFO = 'blueUFO';
const ROTATING_UFO = 'rotatingUFO';
const PLAYER_SHIP = 'playerShip';

class Bullet extends GameObject {

  constructor(context, canvas, x, y, speed = 40, direction = 'UP', enemyType = PLAYER_SHIP) {
    
    // context, canvas, width, height, x, y, speed
    super(context, canvas, 9, 5, x, y, speed);
    this.bulletBg = new Image();
    if (enemyType === BLUE_UFO) {
      this.bulletBg.src = "assets/images/bullet.png";
    } else if (enemyType === ROTATING_UFO) {
      this.bulletBg.src = "assets/images/bullet_3.png";
    } else if (enemyType === PLAYER_SHIP) {
      this.bulletBg.src = "assets/images/bullet_2.png";
    }

    this.gunBlast = new Audio("assets/sounds/aaj_0022_Lazer_Gun_02_SFX.mp3");
    this.gunBlast.volume = 0.2;

    this.direction = direction;
    this.active = true;
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
    }

    return true;
  }

  playSound = () => {
    this.gunBlast.play();
  }

}

export default Bullet;
