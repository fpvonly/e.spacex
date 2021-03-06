import GameObject from './GameObject';
import Sounds from './Sound';
import Sprites from './Sprite';

class Explosion extends GameObject {

  constructor(context, canvas, x, y) {
    // context, canvas, width, height, x, y
    super(context, canvas, 40 * window.CANVAS_HEIGHT_ADJUST, 40 * window.CANVAS_HEIGHT_ADJUST, x, y);

    this.then = Date.now(); // previous explosion time frame, for throttling the animation
    this.explosionFPS = 12;
    this.blastPlayed = false;
    this.explosionFrames = [];
    this.resetFrames();
  }

  draw = () => {
    if (this.isExplosionAnimationComplete() === false) {
      this.context.drawImage(this.explosionFrames[0], this.x, this.y, this.width, this.height);
      this.now = Date.now();
      this.delta = this.now - this.then;
      if (this.delta > 1000/this.explosionFPS) {
        this.then = this.now - (this.delta % 1000/this.explosionFPS);
        this.explosionFrames.shift();
      }
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
