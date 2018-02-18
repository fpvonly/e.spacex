import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';

const STOP = 'STOP';
const RUN = 'RUN';

class Game extends React.Component {

  constructor(props) {
    super(props);

    this.canvas = null;
    this.context = null;

    this.animation = null; // the requested animation frame

	  this.scrollBackground = new Image();
	  this.scrollBackground.src = "assets/images/game_scroll_stars.png";
    if (window.innerHeight < 800) {
      this.scrollSpeed = 1;
    } else {
      this.scrollSpeed = 2;
    }
    this.scrollY = 0;
    this.scrollX = 0;
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
    } else if (this.props.gameState === STOP && prevProps.gameState === RUN) { // TODO Test this
      this.resetGame();
    }
  }

  resizeCanvas = (e) => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.resetGame();
    this.props.setGameState(STOP);
  }

  getCanvasRef = (c) => {
    this.canvas = c;
    this.context = c.getContext("2d");
  }

  startGame = () => {
    this.context = this.canvas.getContext('2d');
    this.animate();
  }

  resetGame = () => {
    cancelAnimRequestFrame(this.animation);
    this.scrollY = 0;
    this.scrollX = 0;
    if (window.innerHeight < 800) {
      this.scrollSpeed = 1;
    } else {
      this.scrollSpeed = 2;
    }
  }

  animate = () => {
    this.animation = requestAnimFrame(this.animate);
    this.draw();
  }

  draw = () => {
    if (this.context && this.context.clearRect) {
      this.clearCanvas();
      this.drawBgScroll();
    }
  }

  drawBgScroll = () =>{
		this.scrollY += this.scrollSpeed;

		this.context.drawImage(this.scrollBackground, this.scrollX, this.scrollY, 1920, 1080);
		this.context.drawImage(this.scrollBackground, this.scrollX, this.scrollY - this.canvas.height, 1920, 1080);

		if (this.scrollY >= this.canvas.height) {
      this.scrollY = 0;
    }
  }

   clearCanvas = () => {
     this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
   }

  render() {
    return <div>
      <div className='bg' />
      <canvas ref={this.getCanvasRef} width={window.innerWidth} height={window.innerHeight}>
        Your browser doesn't support HTML5 canvas API. Please update your browser.
      </canvas>
    </div>
  }
}

export default Game;
