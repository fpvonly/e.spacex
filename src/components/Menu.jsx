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
    setGameState: () => {},
    controlMusic: () => {},
    musicState: false
  };

  static propTypes = {
    gameState: PropTypes.string,
    setGameState: PropTypes.func,
    controlMusic: PropTypes.func,
    musicState: PropTypes.bool
  };

  handleNewGameClick = () => {
    this.props.setGameState(RUN);
  }

  handleShowExtraClick = () => {

  }

  handleQuitClick = () => {
    window.location.assign('http://' + conf.quit_url);
  }

  handlePlayMusicClick = () => {
    let play = this.props.controlMusic();
    this.setState({playMusic: play});
  }

  render() {
    let menu = null;
    if (this.props.gameState === STOP) {
      menu = <div className='menu'>
        <div className='menu_btn new_game' onClick={this.handleNewGameClick}><div className='circle'><span>New game</span></div></div>
        <div className='menu_btn extra'><div className='circle' onClick={this.handleShowExtraClick}><span>Extra</span></div></div>
        <div className='menu_btn quit' onClick={this.handleQuitClick}><div className='circle'><span>Quit</span></div></div>
        <div className='menu_btn music' onClick={this.handlePlayMusicClick}>
          {(this.props.musicState === true ? 'Stop music' : 'Play music')}
        </div>
      </div>;
    }

    return menu;
  }
}

export default Menu;
