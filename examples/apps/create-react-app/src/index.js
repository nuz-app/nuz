import { bootstrap, reactHelpersFactory } from '@nuz/core';
import { Helmet } from 'react-helmet';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const nuz = reactHelpersFactory({ React, ReactDOM })

bootstrap({
  // Link only run on development mode
  linked: {
    port: 4000,
  },
  vendors: {
    'react': React,
    'react-dom': ReactDOM,
  },
  // Declared modules in production
  modules: {
    'hello-world': {
      library: 'HelloWorld',
      upstream: 'https://hello-world.nuz.now.sh',
    },
  }
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
