import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import conf from '../conf.json';
import * as C from './Game/Constants';

class Menu extends React.Component {

  constructor(props) {
    super(props);

    this.extraSubMenu = null;
    this.state = {
      extraSubMenuVisible: false,
      selectedBg: this.getBGFromStorage()
    };
  }

  static defaultProps = {
    visible: true,
    setGameState: () => {},
    controlMusic: () => {},
    musicState: false,
    updateBGCallback: () => {}
  };

  static propTypes = {
    visible: PropTypes.bool,
    setGameState: PropTypes.func,
    controlMusic: PropTypes.func,
    musicState: PropTypes.bool,
    updateBGCallback: PropTypes.func
  };

  componentWillUnmount() {
    this.extraSubMenu.removeEventListener('mouseleave', this.handleShowExtraClick, false);
  }

  handleNewGameClick = (e) => {
    this.props.setGameState(C.RUN, 'MENU_NEW_GAME_CLICK');
  }

  handleShowExtraClick = () => {
    this.setState({extraSubMenuVisible: !this.state.extraSubMenuVisible}, () => {
      if (this.state.extraSubMenuVisible === true && this.extraSubMenu !== null) {
        this.extraSubMenu.addEventListener('mouseleave', this.handleShowExtraClick, false);
      } else if (this.extraSubMenu !== null) {
        this.extraSubMenu.removeEventListener('mouseleave', this.handleShowExtraClick, false);
      }
    });
  }

  handleQuitClick = (e) => {
    window.location.assign('http://' + conf.quit_url);
  }

  handlePlayMusicClick = (e) => {
    this.props.controlMusic();
  }

  handleFullscreenClick = (e) => {
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

  setBGToStorage = (bg = 'space2.jpg') => {
    this.extraSubMenu.removeEventListener('mouseleave', this.handleShowExtraClick, false); // prevent flashes during render update
    if (window.localStorage) {
      localStorage.setItem('gameBg', bg);
      this.setState({selectedBg: bg}, () => {
        this.props.updateBGCallback();
        setTimeout(() => {
          this.extraSubMenu.addEventListener('mouseleave', this.handleShowExtraClick, false);
        }, 1000);
      });
    }
  }

  getBGFromStorage = () => {
    let value = null;
    if (window.localStorage) {
      value = localStorage.getItem('gameBg');
    }
    return (value && value !== null ? value : 'space2.jpg');
  }

  handleBgSelection = (bg, e) => {
    this.setBGToStorage(bg);
  }

  getBGOptions = () => {
    return <div className='extra_bg_options'>
      <div
        className={'bg_option default_bg' + (this.state.selectedBg === 'space2.jpg' ? ' selected' : '')}
        onClick={this.handleBgSelection.bind(this, 'space2.jpg')}>
          <img src='assets/images/space2.jpg' />
      </div>
      <div
        className={'bg_option extra_bg' + (this.state.selectedBg === 'space1.jpg' ? ' selected' : '')}
        onClick={this.handleBgSelection.bind(this, 'space1.jpg')}>
        <img src='assets/images/space1.jpg' />
      </div>

    </div>;
  }

  render() {
    let mainMenu = null;
    let extraSubMenu = null;

    if (this.props.visible === true) {
      mainMenu = <div className='menu'>
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
      if (this.state.extraSubMenuVisible === true) {
        extraSubMenu = <div ref={(c) => {this.extraSubMenu = c;}} className='extra_sub_menu'>
          <div className='bg'/>
          <div className='padding'>
            <span className='bg_selection_title'>Select background:</span>

            {this.getBGOptions()}
          </div>
          <div className='extra_close_btn' onClick={this.handleShowExtraClick}>Close</div>
        </div>;
      }
    }

    return <div>
      {mainMenu}
      <ReactCSSTransitionGroup
        transitionName="slide"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}>
          {extraSubMenu}
      </ReactCSSTransitionGroup>
    </div>;
  }
}

export default Menu;
