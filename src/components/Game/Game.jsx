import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';

import Sprites from './Objects/Sprite';
import Ship from './Objects/Ship';
import Enemy from './Objects/Enemy';
import * as C from './Constants';

class Game extends React.Component {

  constructor(props) {
    super(props);

    this.canvas = null;
    this.context = null;

    this.animation = null; // the requested animation frame
    this.fps = 30;
    this.now;
    this.then = Date.now();
    this.interval = 1000/this.fps;
    this.delta;

	  this.scrollBackground = Sprites.getGameBg();
    if (window.innerHeight < 800) {
      this.scrollSpeed = 1;
    } else {
      this.scrollSpeed = 2;
    }
    this.scrollY = 0;
    this.scrollX = 0;
    this.ship = null;
    this.enemies = [];
    this.points = 0;
  }

  static defaultProps = {
    gameState: '',
    setGameState: () => {}
  };

  static propTypes = {
    gameState: PropTypes.string,
    setGameState: PropTypes.func
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
    window.addEventListener('keyup', this.stopGame, false);
    document.addEventListener("visibilitychange", this.handleDocumentVisibilityChange, false); // reset game if user changes tab
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeCanvas, false);
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

  stopGame = (e) => {
    if (e.key === 'Escape' || e.keyCode === 27) {
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

    // game base variables and objects ->
    this.scrollY = 0;
    this.scrollX = 0;
    if (window.innerHeight < 800) {
      this.scrollSpeed = 1;
    } else {
      this.scrollSpeed = 2;
    }
    this.ship = new Ship(this.context, this.canvas);
    this.enemies = [];
    // let's pre-create the re-spawning enemies so that the drawing loop is lighter on performance (because of images)
    for (let i = 0; i < C.NUMBER_OF_ENEMIES; i++) {
      let type = (i%3 === 0) ? C.ROTATING_UFO : C.BLUE_UFO;
      if (i === C.NUMBER_OF_ENEMIES - 1) {
        this.enemies.push(new Enemy(this.context, this.canvas, C.ASTEROID));
      } else {
        this.enemies.push(new Enemy(this.context, this.canvas, type));
      }
    }
    return true;
  }

  gameOver = () => {
  //TODO show points in UI
    console.log('this.points', this.points);
    this.resetGame();
  }

  animate = () => {
    this.animation = requestAnimFrame(this.animate);
    this.now = Date.now();
    this.delta = this.now - this.then;
    // let's keep the fps at 30fps max, interval 1000/30
    if (this.delta > this.interval) {
      this.then = this.now - (this.delta % this.interval);
      this.drawFrame();
    }
  }

  drawFrame = () => {
    let done = false;
    if (this.context) {

      // Background scroll
      this.clearCanvas();
      this.drawBgScroll();
      // The player ship
      done = this.ship.draw();
      let shipBullets = this.ship.getActiveBullets();
      // Enemies and hits
      for (let enemy of this.enemies) {
        done = enemy.draw();
        if(enemy.destroyed === false) {
          // did player's ship bullets hit any of the enemies?
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
        }
      } // ends enemies for loop

      if (this.ship.destroyed === true && this.ship.isExplosionAnimationComplete() === true) {
        this.gameOver();
      }
    }
  }

  drawBgScroll = () =>{
		this.scrollY += this.scrollSpeed;
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
    return <div>
      <div className='bg' />
      <canvas
        ref={this.getCanvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={(this.props.gameState === C.RUN ? {'cursor': 'none'} : null)}>
          Your browser doesn't support HTML5 canvas API. Please update your browser.
      </canvas>
    </div>
  }
}

export default Game;
