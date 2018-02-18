import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';

class TitleBanner extends React.Component {

  constructor(props) {
    super(props);
  }

  static defaultProps = {
    gameState: ''
  };

  static propTypes = {
    gameState: PropTypes.string
  };

  render() {
    let banner = null;
    if (this.props.gameState === 'STOP') {
      banner = <div className='banner'>
        <div className='title'>e.spaceX</div>
        <div className='arc'></div>
      </div>;
    }
    
    return banner;
  }
}

export default TitleBanner;
