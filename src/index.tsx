import React from 'react';
import ReactDOM from 'react-dom';
//@ts-ignore
import App from './App';

import './styles/index.css';
import './styles/style.scss';

// const root = ReactDOM.createRoot(document.getElementById("root"));
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
