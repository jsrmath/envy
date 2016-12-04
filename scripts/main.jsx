import Envy from './Envy.jsx';
import React from 'react';
import ReactDOM from 'react-dom';

const ctx = new (window.AudioContext || window.webkitAudioContext)();

ReactDOM.render(
  <Envy ctx={ctx} />,
  document.getElementById('content')
);
