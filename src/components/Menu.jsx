import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';

import conf from '../conf.json';

const STOP = 'STOP';
const RUN = 'RUN';

class Menu extends React.Component {

  constructor(props) {
    super(props);
  }

  static defaultProps = {
    gameState: '',
    setGameState: () => {}
  };

  static propTypes = {
    gameState: PropTypes.string,
    setGameState: PropTypes.func
  };

  handleNewGameClick = () => {
    this.props.setGameState(RUN);
  }

  handleShowInfoClick = () => {

  }

  handleQuitClick = () => {
    window.location.assign('http://' + conf.quit_url);
  }

  render() {
    let menu = null;
    if (this.props.gameState === STOP) {
      menu = <div className='menu'>
        <div className='menu_btn new_game' onClick={this.handleNewGameClick}><div className='circle'><span>New game</span></div></div>
        <div className='menu_btn info'><div className='circle' onClick={this.handleShowInfoClick}><span>Info</span></div></div>
        <div className='menu_btn quit' onClick={this.handleQuitClick}><div className='circle'><span>Quit</span></div></div>
      </div>;
    }

    return menu;
  }
}

export default Menu;
