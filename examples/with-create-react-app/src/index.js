import { bootstrap, reactHelpersFactory } from '@nuz/core';
import { Helmet } from 'react-helmet';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const nuz = reactHelpersFactory({ React, ReactDOM })

bootstrap({
  linked: {
    port: 4000,
  },
  vendors: {
    'react': React,
    'react-dom': ReactDOM,
  },
});

ReactDOM.render(
  <nuz.App injectHead={Helmet}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </nuz.App>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
