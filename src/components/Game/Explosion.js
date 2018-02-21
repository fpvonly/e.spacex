import GameObject from './GameObject';

class Explosion extends GameObject {

  constructor(context, canvas, x, y) {

    // context, canvas, width, height, x, y
    super(context, canvas, 40, 40, x, y);

    this.blast = new Audio("assets/sounds/cc0_explosion_large_gas_001.mp3");
    this.blast.volume = 0.2;

    this.explosionFrames = [];
    this.resetFrames();
  }

  draw = () => {
    if (this.isExplosionAnimationComplete() === false) {
      this.context.drawImage(this.explosionFrames[0], this.x, this.y, this.width, this.height);
      this.explosionFrames.shift();
    }
    return true;
  }

  playSound = () => {
    this.blast.play();
  }

  isExplosionAnimationComplete = () => {
    if (this.explosionFrames.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  resetFrames = () => {
    this.explosionFrames = [];
    for (let i = 1; i <= 13; i++) {
      let explosionBg = new Image();
      explosionBg.src = 'assets/images/explosions/' + i + '.png';
      this.explosionFrames.push(explosionBg);
    }
  }

}

export default Explosion;
