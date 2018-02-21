import React from 'react';
import {render} from 'react-dom';

import Menu from './Menu.jsx';
import Game from './Game/Game.jsx';
import TitleBanner from './TitleBanner.jsx';

const STOP = 'STOP';
const RUN = 'RUN';

class UI extends React.Component {

  constructor(props) {
    super(props);

    this.music = new Audio('assets/sounds/slackbaba_drink_more_tea.mp3');
    this.music.loop = true;
    this.music.volume = 0.3;
    //this.music.currentTime = 283;

    this.state = {
      GAME_STATE: STOP,
      musicState: this.getmusicStateFromStorage()
    }
  }

  componentDidMount() {
    if(this.state.musicState === true) {
      this.music.play();
    }
  }

  setGameState = (state = STOP) => {
    this.setState({GAME_STATE: state});
  }

  controlMusic = () => {
    if (!this.music.paused) {
      this.music.pause();
      this.setmusicStateToStorage(false);
      return false;
    } else {
      this.music.play();
      this.setmusicStateToStorage(true);
      return true;
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
