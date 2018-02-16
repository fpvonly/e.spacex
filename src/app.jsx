import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Link, Route, IndexRoute, Switch} from 'react-router-dom';

import MainUI from './components/MainUI.jsx';

ReactDOM.render(<MainUI />, document.getElementById('app'));
