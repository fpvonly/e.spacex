import GameObject from './GameObject';
import Bullet from './Bullet';

const KEYS = {
  'Control': 'SHOOT',
  'ArrowLeft': 'LEFT',
  'ArrowUp': 'UP',
  'ArrowRight': 'RIGHT',
  'ArrowDown': 'DOWN',
  17: 'SHOOT', // ctrl
  37: 'LEFT',
  38: 'UP',
  39: 'RIGHT',
  40: 'DOWN'
};

class Ship extends GameObject {

  constructor(context, canvas) {

    let ratio = 287/151; // height/width ratio for image
    let width = (canvas.height/10 < 287 ? canvas.height/10 : 287);
    let height = width * ratio;

    // context, canvas, width, height
    super(context, canvas, width*0.8, height*0.8); // 0.8 is scaled down

    this.shipBg = new Image();
    this.shipBg.src = "assets/images/ship_1.png";

    this.bullets = [];
    this.allowShipMovement = false;
    this.activeKeys = {};
    this.steerProxy = new Proxy(this.activeKeys, {
      set: (target, key, value) => {
        target[key] = value;
        Object.defineProperty(target, key, {writable: true, configurable: true});
        if (Reflect.ownKeys(target).length > 0) {
          this.allowShipMovement = true;
        }
        return true;
      },
      get: function(target, prop, receiver) {
        return Reflect.get(...arguments);
      },
      deleteProperty: (target, prop) => {
        Reflect.deleteProperty(target, prop);
        if (Reflect.ownKeys(target).length === 0) {
          this.allowShipMovement = false;
        } else {
          this.allowShipMovement = true;
        }
        return Reflect.get(...arguments);
      }
    });

    if (!("ontouchstart" in document.documentElement)) {
      this.mouseTimer = null;
      window.addEventListener('keydown', this.addActiveDownKeys, true);
      window.addEventListener('keyup', this.removeActiveDownKeys, true);
      window.addEventListener('mousemove', this.handleMouseMove, false);
      window.addEventListener('mousedown', this.handleMouseDown, false);
      window.addEventListener('mouseup', this.handleMouseUp, false);
    } else {
//TODO
      this.canvas.addEventListener('touchmove', this.handleTouchMove, false);
      this.canvas.addEventListener('touchend', this.handleTouchEnd, false);
    }
  }

  shoot = () => {
    let bulletX = this.x;
    let bulletY = this.y;
    let bullet = new Bullet(this.context, this.canvas, (bulletX + this.width/2 - 5), bulletY);
    this.bullets.push(bullet);
    bullet.playSound();
  }

  steerAndShoot = () => {
    if (this.allowShipMovement === true) {
      let keys = Reflect.ownKeys(this.steerProxy);
      for (let direction of keys) {
        switch(direction) {
          case 'LEFT':
            if (this.x > 0) {
              this.moveLeft(30);
            }
            break;
          case 'RIGHT':
            if (this.x <= this.canvas.width - this.width) {
              this.moveRight(30);
            }
            break;
          case 'UP':
            if (this.y > 0) {
              this.moveUp(30);
            }
            break;
          case 'DOWN':
            if (this.y < this.canvas.height - this.height) {
              this.moveDown(30);
            }
            break;
          case 'X_COORD': // for mouse and touch events
            if (this.steerProxy.X_COORD <= this.canvas.width - this.width) {
              this.resetY(); // reset y to original initial value
              this.moveToX(this.steerProxy.X_COORD);
            }
            break;
          case 'SHOOT':
            this.shoot();
            break;
        }
      }
    }
    return true;
  }

  addActiveDownKeys = (e) => {
    e.preventDefault();
    this.steerProxy[KEYS[e.key || e.keyCode]] = true;
  }

  removeActiveDownKeys = (e) => {
    e.preventDefault();
    Reflect.deleteProperty(this.steerProxy, KEYS[e.key || e.keyCode]);
  }

  handleMouseMove = (e) => {
    clearTimeout(this.mouseTimer);
    this.steerProxy['X_COORD'] = e.pageX;
    this.mouseTimer = setTimeout(this.handleMouseStop, 300);
  }

  handleMouseStop = (e) => {
    Reflect.deleteProperty(this.steerProxy, 'X_COORD');
  }

  handleMouseDown = (e) => {
    this.steerProxy['SHOOT'] = true; // simulate keyboard shoot event
  }

  handleMouseUp = (e) => {
    Reflect.deleteProperty(this.steerProxy, 'SHOOT');
  }

  handleTouchMove = (e) => {
    e.preventDefault();
    this.steerProxy['X_COORD'] = e.touches[0].pageX;
  }

  handleTouchEnd = (e) => {
    Reflect.deleteProperty(this.steerProxy, 'X_COORD');
  }

  draw = () => {
    let done = this.steerAndShoot();
    for (let bullet of this.bullets.slice()) {
      done = bullet.draw();
    }
    this.context.drawImage(this.shipBg, this.x, this.y, this.width, this.height);
    return true;
  }

  getBullets = () => {
    for (let bullet of this.bullets) {
      if (bullet.active === false) {
        this.bullets.shift(); // the inactive bullet is always the first bullet in the array
      }
    }
    return this.bullets;
  }

}

export default Ship;
