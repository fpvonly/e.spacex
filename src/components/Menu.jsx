import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';

import conf from '../conf.json';
import * as C from './Game/Constants';

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
    this.props.setGameState(C.RUN, 'MENU_NEW_GAME_CLICK');
  }

  handleShowExtraClick = () => {

  }

  handleQuitClick = () => {
    window.location.assign('http://' + conf.quit_url);
  }

  handlePlayMusicClick = () => {
    this.props.controlMusic();
  }

  handleFullscreenClick = () => {
    let appWrapper = document.getElementById('app');
    if (this.isFullScreenActive() === false) {
      if (appWrapper.requestFullscreen) {
        appWrapper.requestFullscreen();
      } else if (appWrapper.msRequestFullscreen) {
        appWrapper.msRequestFullscreen();
      } else if (appWrapper.mozRequestFullScreen) {
        appWrapper.mozRequestFullScreen();
      } else if (appWrapper.webkitRequestFullscreen) {
        appWrapper.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1000);
  }

  isFullScreenActive = () => {
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    let menu = null;
    if (this.props.gameState === C.STOP) {
      menu = <div className='menu'>
        <div className='menu_btn new_game' onClick={this.handleNewGameClick}><div className='circle'><span>New game</span></div></div>
        <div className='menu_btn extra'><div className='circle' onClick={this.handleShowExtraClick}><span>Extra</span></div></div>
        <div className='menu_btn quit' onClick={this.handleQuitClick}><div className='circle'><span>Quit</span></div></div>
        <div className='menu_btn music' onClick={this.handlePlayMusicClick}>
          {(this.props.musicState === true ? 'Stop music' : 'Play music')}
        </div>
        <div className='menu_btn fullscreen' onClick={this.handleFullscreenClick}>
          {(this.isFullScreenActive() ? 'Normal screen' : 'Full screen' )}
        </div>
      </div>;
    }

    return menu;
  }
}

export default Menu;
