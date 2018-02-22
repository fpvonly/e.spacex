import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import Sounds from './components/Game/Objects/Sound'; // preload sound pool
import MainUI from './components/MainUI.jsx';

ReactDOM.render(<MainUI />, document.getElementById('app'));
