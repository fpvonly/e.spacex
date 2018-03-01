import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';

import DebugFPS from './DebugFPS.jsx';
import Sprites from './Objects/Sprite';
import Ship from './Objects/Ship';
import Enemy from './Objects/Enemy';
import * as C from './Constants';

window.GAME_FPS_ADJUST = 1;
window.CANVAS_HEIGHT_ADJUST = 1;

const DEBUG = (process.env.NODE_ENV === 'development' ? true : false);

class Game extends React.Component {

  constructor(props) {
    super(props);

    this.canvas = null;
    this.context = null;
    this.debugFPSREF = null;

    this.GAME_OVER = false;
    this.animation = null; // the requested animation frame
    this.scrollBackgroundEnabled = this.getIsBGScrollActiveFromStorage();
    this.scrollBackground = Sprites.getGameBg();
    this.scrollSpeed = 1;
    this.scrollY = 0;
    this.scrollX = 0;
    this.ship = null;
    this.enemies = [];
    this.points = 0;

    this.fps = 0;
    this.previousFrameTime = 0;
    this.framesThisSecond = 0;
    this.lastFpsUpdate = 0;

    this.touchControls = false;
    if ("ontouchstart" in document.documentElement) {
      this.touchControls = true;
    }
  }

  static defaultProps = {
    gameState: '',
    setGameState: () => {},
    selectedBgClass: ''
  };

  static propTypes = {
    gameState: PropTypes.string,
    setGameState: PropTypes.func,
    selectedBgClass: PropTypes.string
  };

  componentWillMount() {
    window.requestAnimFrame = (function(){
      return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback, element) {
          window.setTimeout(callback, 1000/60);
        };
      })();
    window.cancelAnimRequestFrame = (function() {
      return window.cancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ||
        clearTimeout
    })();
    window.addEventListener('resize', this.resizeCanvas, false);
    window.addEventListener('keyup', this.endGame, false);
    document.addEventListener("visibilitychange", this.handleDocumentVisibilityChange, false); // reset game if user changes tab
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeCanvas, false);
    window.removeEventListener('mousedown', this.endGame, false);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.gameState === C.RUN && this.props.gameState === C.RUN) {
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.gameState === C.RUN && prevProps.gameState === C.STOP) {
      this.startGame();
    }
  }

  getCanvasRef = (c) => {
    this.canvas = c;
    this.context = c.getContext("2d");
  }

  getDebugFPSRef = (c) => {
    this.debugFPSREF = c;
  }

  getIsBGScrollActiveFromStorage = () => {
    let value = null;
    if (window.localStorage) {
      value = localStorage.getItem('scrollBg');
    }
    return (value && value !== null ? (value == 'true') : true);
  }

  handleDocumentVisibilityChange = () => {
    if (document.hidden === true) {
      this.resetGame();
      this.props.setGameState(C.STOP);
    }
  }

  resizeCanvas = (e) => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.resetGame();
    this.props.setGameState(C.STOP);
  }

  adjustGameSpeedBasedOnCanvasHeight = () => {
    if (this.canvas.height < 1000) {
      window.CANVAS_HEIGHT_ADJUST = this.canvas.height/1000;
    } else if (this.canvas.height > 1080) {
      window.CANVAS_HEIGHT_ADJUST = this.canvas.height/1080;
    } else {
      window.CANVAS_HEIGHT_ADJUST = 1; // for heights 1000px -> 1080px
    }
  }

  endGame = (e) => {
    if (e.key === 'Escape' || e.keyCode === 27 || e.type === 'mousedown') {
      this.resetGame();
      this.props.setGameState(C.STOP);
    }
  }

  startGame = () => {
    this.resetGame();
    this.animate();
  }

  resetGame = () => {
    this.context = this.canvas.getContext('2d');
    this.clearCanvas();
    cancelAnimRequestFrame(this.animation);
    this.adjustGameSpeedBasedOnCanvasHeight();
    this.scrollBackgroundEnabled = this.getIsBGScrollActiveFromStorage();
    window.removeEventListener('mousedown', this.endGame, false);

    // game base variables and objects ->
    window.GAME_FPS_ADJUST = 1;
    this.fps = 0; // reset previous value as it might be wrong after window resize
    this.lastFpsUpdate = 0; // reset
    this.fps = this.framesThisSecond; // reset
    this.GAME_OVER = false;
    this.points = 0;
    this.scrollY = 0;
    this.scrollX = 0;
    this.scrollSpeed = 1;
    this.ship = new Ship(this.context, this.canvas);
    this.enemies = [];
    // let's pre-create the re-spawning enemies so that the drawing loop is lighter on performance (because of images)
    for (let i = 0; i < C.NUMBER_OF_ENEMIES; i++) {
      let type = (i%3 === 0) ? C.ROTATING_UFO : C.BLUE_UFO;
      if (i === C.NUMBER_OF_ENEMIES - 1) {
        this.enemies.push(new Enemy(this.context, this.canvas, C.ASTEROID));
      } else if (i === 7) {
        this.enemies.push(new Enemy(this.context, this.canvas, C.ROTATING_UFO_2));
      } else {
        this.enemies.push(new Enemy(this.context, this.canvas, type));
      }
    }
    return true;
  }

  gameOver = () => {
    this.context.strokeStyle = '#FFFFFF';
    this.context.lineWidth = 10;
    this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    let fontSize = (this.canvas.width/2 >= 960 ? 100 : ((this.canvas.width/2)/960) * 100);
    this.context.font = fontSize + 'px Audiowide-Regular,Arial';
    this.context.fillStyle = '#FFFFFF';
    this.context.textAlign = "center";
    this.context.fillText("GAME OVER!", this.canvas.width/2, ((this.canvas.height/2) * 0.1) + 70);
    this.context.fillText("Your points: " + this.points, this.canvas.width/2, this.canvas.height/2);
    this.context.font = '15px Audiowide-Regular,Arial';
    this.context.fillStyle = '#FFFFFF';
    this.context.textAlign = "center";
    this.context.fillText("Press esc or click on the screen to return to main menu", this.canvas.width/2, (this.canvas.height) - 70);
    this.canvas.style = 'cursor: pointer;' ;
    if (this.GAME_OVER === false) {
      window.addEventListener('mousedown', this.endGame, false);
    }
    this.GAME_OVER = true;
  }

  animate = (time) => {
    if (time > this.lastFpsUpdate + 1000) { // update fps every second
      this.fps = this.framesThisSecond;
      this.lastFpsUpdate = time;
      if (this.fps > 15 && this.framesThisSecond > 0) { // check for both variable to prevent "speed ups" after window resize
        window.GAME_FPS_ADJUST = 60/(this.fps > 60 ? 60 : this.fps);
      }
      this.framesThisSecond = 0;
    }
    this.framesThisSecond++;
    this.animation = requestAnimFrame(this.animate);
    this.drawFrame();

    if (DEBUG === true) {
      this.debugFPSREF.updateFPS(this.fps);
    }
  }

  drawFrame = () => {
    let done = false;
    let autoShoot = false;
    if (this.context) {
      this.clearCanvas();
      // Background scroll
      if (this.scrollBackgroundEnabled === true) {
        this.drawBgScroll();
      }

      if (this.GAME_OVER === false) {
        // The player ship
        done = this.ship.draw();
        let shipBullets = this.ship.getActiveBullets();

        // Enemies and hits
        for (let enemy of this.enemies) {
          done = enemy.draw();
          if(enemy.destroyed === false && enemy.active === true) {
            // did player's ship bullets hit the enemy?
            for (let playerBullet of shipBullets) {
              if(playerBullet.active === true && playerBullet.didCollideWith(enemy) === true) {
                  enemy.destroy();
                  playerBullet.active = false; // bullet is used now
                  this.points++;
                  break;
              }
            }
            // did enemy ship's bullets the player's ship?
            let enemyBullets = enemy.getActiveBullets();
            for (let enemyBullet of enemyBullets) {
              if(enemyBullet.active === true && enemyBullet.didCollideWith(this.ship) === true) {
                enemyBullet.active = false; // bullet is used now
                this.ship.destroy();
                break;
              }
            }
            // did player's ship and an enemy ship collide?
            if(this.ship.didCollideWith(enemy) === true) {
              this.ship.destroy();
            }

            // if a touch device, shoot automatically when target locked
            if (this.touchControls === true) {
              if(this.ship.destroyed === false && this.ship.overlapsWithXSpanOf(enemy) === true && enemy.isOnScreenBetweenTopAndBottom() === true) {
                autoShoot = true;
              }
            }
          }
        } // ends enemies for loop

        // if a touch device, shoot automatically when target locked
        if (this.touchControls === true && autoShoot === true) {
          this.ship.handleTouchShoot(true);
        } else if (this.touchControls === true) {
          this.ship.handleTouchShoot(false);
        }
      }

      if (this.GAME_OVER === true || (this.ship.destroyed === true && this.ship.isExplosionAnimationComplete() === true)) {
        this.gameOver();
      }
    }
  }

  drawBgScroll = () =>{
		this.scrollY += this.scrollSpeed * window.CANVAS_HEIGHT_ADJUST; // no fps adjust for bg scroll as it's too noticeable
		this.context.drawImage(this.scrollBackground, this.scrollX, this.scrollY, this.canvas.width, this.canvas.height);
		this.context.drawImage(this.scrollBackground, this.scrollX, this.scrollY - this.canvas.height, this.canvas.width, this.canvas.height);
		if (this.scrollY >= this.canvas.height) {
      this.scrollY = 0;
    }
  }

  clearCanvas = () => {
    if (this.context) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  render() {
    return <div className='game'>
      <div className={'bg ' + this.props.selectedBgClass.split('.')[0]} />
      <canvas
        ref={this.getCanvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={(this.props.gameState === C.RUN ? {'cursor': 'none'} : null)}>
          Your browser doesn't support HTML5 canvas API. Please update your browser.
      </canvas>
      {(DEBUG === true ? <DebugFPS ref={this.getDebugFPSRef} /> : null)}
    </div>
  }
}

export default Game;
