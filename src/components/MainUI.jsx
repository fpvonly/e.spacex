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

    this.state = {
      GAME_STATE: STOP
    }
  }

  setGameState = (state = STOP) => {
    this.setState({GAME_STATE: state});
  }

  render() {
    return <div>
      <Game gameState={this.state.GAME_STATE} setGameState={this.setGameState} />
      <Menu gameState={this.state.GAME_STATE} setGameState={this.setGameState} />
      <TitleBanner gameState={this.state.GAME_STATE} />
    </div>
  }
}

export default UI;
