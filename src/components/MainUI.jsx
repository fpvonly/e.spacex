import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';


class App extends React.Component {

  constructor(props) {
    super(props);

    this.canvas = null;
  }

  static defaultProps = {

  };

  static propTypes = {

  };

  componentWillMount() {
    window.addEventListener('resize', this.resizeCanvas, false);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeCanvas, false);
  }

  resizeCanvas = (e) => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }


  render() {
    return <div>
      <header>HEADER</header>
      <div className='bg' />
      <canvas ref={(c) => {this.canvas = c;}} width={window.innerWidth} height={window.innerHeight}>
        Your browser doesn't support HTML5 canvas API. Please update your browser.
      </canvas>
      <div className='title'>e.spaceX</div>
    </div>
  }
}

export default App;
