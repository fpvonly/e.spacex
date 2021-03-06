import React from 'react';
import {render} from 'react-dom';

import Sounds from './Game/Objects/Sound'; // preload sound pool
import Sprites from './Game/Objects/Sprite'; // preload sprites
import * as C from './Game/Constants';
import Game from './Game/Game.jsx';
import Menu from './Menu.jsx';
import TitleBanner from './TitleBanner.jsx';

class UI extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isHydrating: true,
      loadingSoundsStatusInfoText: '',
      loadingSpritesStatusInfoText: '',
      GAME_STATE: C.STOP,
      musicState: this.getmusicStateFromStorage(),
      selectedBgClass: this.getBGFromStorage()
    }

    this.loadingInterval = null;
    this.loadingIntervalCount = 0; // if all files can't be loaded (sounds etc)a t the moment (slow connection), allow still access to main menu and game
  }

  componentWillMount() {
    let soundAssetsLoadInfo = Sounds.getLoadingStatusInfo();
    let spriteAssetsLoadInfo = Sprites.getLoadingStatusInfo();
    this.setState({
      loadingSoundsStatusInfoText: soundAssetsLoadInfo,
      loadingSpritesStatusInfoText: spriteAssetsLoadInfo
    });
  }

  componentDidMount() {
    this.loadingInterval = setInterval(() => {

      let soundAssetsLoadInfo = Sounds.getLoadingStatusInfo();
      let spriteAssetsLoadInfo = Sprites.getLoadingStatusInfo();

      if ((Sounds.soundsLoaded() === true && Sprites.spritesLoaded() === true) || this.loadingIntervalCount === 20) {
        this.setState({
          isHydrating: false,
          loadingSoundsStatusInfoText: soundAssetsLoadInfo,
          loadingSpritesStatusInfoText: spriteAssetsLoadInfo
        }, () => {
          this.loadingIntervalCount = 0;
          clearInterval(this.loadingInterval);
        });
      } else {
        this.setState({
          loadingSoundsStatusInfoText: soundAssetsLoadInfo,
          loadingSpritesStatusInfoText: spriteAssetsLoadInfo
        });

      }
      this.loadingIntervalCount++;
    }, 1000);
  }

  componentDidUpdate() {
    if(this.state.isHydrating === false && this.state.musicState === true) {
      Sounds.playMusic().catch((err) => {
        this.controlMusic(false);
      });
    }
  }

  setGameState = (state = C.STOP, info = '') => {
    this.setState({GAME_STATE: state});
  }

  controlMusic = (value) => {
    if (typeof value !== 'undefined' && value === false) {
      Sounds.pauseMusic();
      this.setmusicStateToStorage(false);
    } else if (this.state.musicState === true) {
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
                  <div className='loader lds-css ng-scope'><div style={{'width': '100%', 'height': '100%'}} className='lds-eclipse'><div></div></div></div>
                  <div className='loader_text'>
                    <span>Loading game files...</span>
                    <span className='sounds_loaded'>
                      {this.state.loadingSoundsStatusInfoText}
                    </span>
                    <span className='sprites_loaded'>
                      {this.state.loadingSpritesStatusInfoText}
                    </span>
                  </div>
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
