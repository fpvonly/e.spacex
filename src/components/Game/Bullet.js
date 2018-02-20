import GameObject from './GameObject';

class Bullet extends GameObject {

  constructor(context, canvas, x, y) {
    // context, canvas, width, height, x, y, speed
    super(context, canvas, 9, 5, x, y, 40);
    this.bulletBg = new Image();
    this.bulletBg.src = "assets/images/bullet_2.png";

    this.gunBlast = new Audio("assets/sounds/aaj_0022_Lazer_Gun_02_SFX.mp3");
    this.gunBlast.volume = 0.2;

    this.active = true;
  }

  draw = () => {
    if (this.active === true) {
      if (this.y > 0) {
        this.moveUp(this.speed);
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
