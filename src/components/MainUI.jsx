import React from 'react';
import {render} from 'react-dom';

import Sounds from './Game/Objects/Sound';
import * as C from './Game/Constants';
import Game from './Game/Game.jsx';
import Menu from './Menu.jsx';
import TitleBanner from './TitleBanner.jsx';

class UI extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      GAME_STATE: C.STOP,
      musicState: this.getmusicStateFromStorage()
    }
  }

  componentDidMount() {
    if(this.state.musicState === true) {
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

  render() {
    return <div>
      <Game
        gameState={this.state.GAME_STATE}
        setGameState={this.setGameState} />
      <Menu
        gameState={this.state.GAME_STATE}
        setGameState={this.setGameState}
        controlMusic={this.controlMusic}
        musicState={this.state.musicState} />
      <TitleBanner gameState={this.state.GAME_STATE} />
    </div>
  }
}

export default UI;
