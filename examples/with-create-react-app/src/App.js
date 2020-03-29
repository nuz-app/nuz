import { resolve } from '@nuz/core';
import React, { lazy, Suspense } from 'react';
import logo from './logo.svg';
import './App.css';

const HelloWorld = lazy(() => resolve('hello-world'))

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div>
          <Suspense fallback={<span>Loading...</span>}>
            <HelloWorld />
          </Suspense>
        </div>
      </header>
    </div>
  );
}

export default App;
