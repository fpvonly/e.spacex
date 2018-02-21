import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';

import Ship from './Ship';
import Enemy from './Enemy';

const STOP = 'STOP';
const RUN = 'RUN';
const NUMBER_OF_ENEMIES = 10;

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

	  this.scrollBackground = new Image();
	  this.scrollBackground.src = "assets/images/game_scroll_stars.png";
    if (window.innerHeight < 800) {
      this.scrollSpeed = 1;
    } else {
      this.scrollSpeed = 2;
    }
    this.scrollY = 0;
    this.scrollX = 0;
    this.ship = null;
    this.enemies = [];
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
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeCanvas, false);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.gameState === RUN && this.props.gameState === RUN) {
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.gameState === RUN && prevProps.gameState === STOP) {
      this.startGame();
    }
  }

  getCanvasRef = (c) => {
    this.canvas = c;
    this.context = c.getContext("2d");
  }

  resizeCanvas = (e) => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.resetGame();
    this.props.setGameState(STOP);
  }

  stopGame = (e) => {
    if (e.key === 'Escape' || e.keyCode === 27) {
      this.resetGame();
      this.props.setGameState(STOP);
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
    for (let i = 0; i < NUMBER_OF_ENEMIES; i++) {
      let type = (i%3 === 0) ? 'rotatingUFO' : 'blueUFO';
      this.enemies.push(new Enemy(this.context, this.canvas, type));
    }
    return true;
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
      // BG
      this.clearCanvas();
      this.drawBgScroll();
      // The ship
      done = this.ship.draw();
      let shipBullets = this.ship.getBullets();
      // Enemies
      for (let enemy of this.enemies) {
        if (enemy.active === true) {
          done = enemy.draw();
          if(enemy.destroyed === false) {
            for (let bullet of shipBullets) {
              if(bullet.active === true &&
                bullet.x > enemy.x &&
                bullet.x < enemy.x + enemy.width &&
                bullet.y > enemy.y &&
                bullet.y < enemy.y + enemy.height) {
                  enemy.destroy();
                  break;
              }
            }
          }
        } else {
          done = enemy.reSpawn();
        }
      } // ends enemies for loop
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
        style={(this.props.gameState === RUN ? {'cursor': 'none'} : null)}>
          Your browser doesn't support HTML5 canvas API. Please update your browser.
      </canvas>
    </div>
  }
}

export default Game;
