import React from 'react';
import {render} from 'react-dom';

import Sounds from './Game/Objects/Sound';
import Sprites from './Game/Objects/Sprite';
import * as C from './Game/Constants';
import Game from './Game/Game.jsx';
import Menu from './Menu.jsx';
import TitleBanner from './TitleBanner.jsx';

class UI extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isHydrating: true,
      GAME_STATE: C.STOP,
      musicState: this.getmusicStateFromStorage(),
      selectedBgClass: this.getBGFromStorage()
    }

    this.loadingInterval = null;
    this.loadingIntervalCount = 0; // if all files can't be loaded (sounds etc)a t the moment (slow connection), allow still access to main menu and game
  }

  componentDidMount() {
    this.loadingInterval = setInterval(() => {
      if ((Sounds.soundsLoaded() === true && Sprites.spritesLoaded() === true) || this.loadingIntervalCount === 30) {
        this.setState({isHydrating: false}, () => {
          this.loadingIntervalCount = 0;
          clearInterval(this.loadingInterval);
        });
      }
      this.loadingIntervalCount++;
    }, 1000);
  }

  componentDidUpdate() {
    if(this.state.isHydrating === false && this.state.musicState === true) {
      Sounds.playMusic();
    }
  }

  setGameState = (state = C.STOP, info = '') => {
    this.setState({GAME_STATE: state});
  }

  controlMusic = () => {
    if (this.state.musicState === true) {
      Sounds.pauseMusic();
      this.setmusicStateToStorage(false);
    } else {
      Sounds.playMusic();
      this.setmusicStateToStorage(true);
    }
  }

  setmusicStateToStorage = (value = false) => {
    if (window.localStorage) {
      localStorage.setItem('playMusic', value);
      this.setState({musicState: value});
    }
  }

  getmusicStateFromStorage = () => {
    let value = false;
    if (window.localStorage) {
      value = localStorage.getItem('playMusic');
    }
    return (value && value !== null ? (value == 'true') : false);
  }

  getBGFromStorage = () => {
    let value = null;
    if (window.localStorage) {
      value = localStorage.getItem('gameBg');
    }
    return (value && value !== null ? value : 'space2.jpg');
  }

  updateBGCallback = () => {
    this.setState({selectedBgClass: this.getBGFromStorage()});
  }

  render() {
    return (this.state.isHydrating === true)
              ? <div className={'loading ' + (this.state.selectedBgClass.indexOf('.') !== -1 ? this.state.selectedBgClass.split('.')[0] : '')}>
                  <img src='assets/images/loader.svg' />
                  Loading game files...
                </div>
              : <div>
                  <Game
                    selectedBgClass={this.state.selectedBgClass}
                    gameState={this.state.GAME_STATE}
                    setGameState={this.setGameState} />
                  <Menu
                    visible={(this.state.GAME_STATE !== C.RUN ? true : false)}
                    setGameState={this.setGameState}
                    controlMusic={this.controlMusic}
                    musicState={this.state.musicState}
                    updateBGCallback={this.updateBGCallback} />
                  <TitleBanner gameState={this.state.GAME_STATE} />
              </div>

  }
}

export default UI;
