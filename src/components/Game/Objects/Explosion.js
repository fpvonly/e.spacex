import GameObject from './GameObject';
import Sounds from './Sound';
import Sprites from './Sprite';

class Explosion extends GameObject {

  constructor(context, canvas, x, y) {
    // context, canvas, width, height, x, y
    super(context, canvas, 40, 40, x, y);

    this.blastPlayed = false;
    this.explosionFrames = [];
    this.resetFrames();
  }

  draw = () => {
    if (this.isExplosionAnimationComplete() === false) {
      this.context.drawImage(this.explosionFrames[0], this.x, this.y, this.width, this.height);
      this.explosionFrames.shift();
    }
    this.playSound();
    return true;
  }

  playSound = () => {
    if (this.blastPlayed === false) {
      Sounds.playExplosionSound();
      this.blastPlayed = true;
    }
  }

  isExplosionAnimationComplete = () => {
    if (this.explosionFrames.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  resetFrames = () => {
    this.explosionFrames = Sprites.getExplosionSpriteAnimFrames();
    this.blastPlayed = false;
  }

}

export default Explosion;
