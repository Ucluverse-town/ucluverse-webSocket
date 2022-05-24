import { useEffect, useRef, useState } from 'react';

import './App.css';

import socket from './utils/socket';
import Background from './components/background';
import Character from './components/character';

import {direction} from './libs/keyboardEvent';

function App() {

  const [backgroundCoordinate,setBackgroundCoordinate] = useState({x: window.innerHeight/2 ,y:window.innerWidth/2});
  const moveObject = (e) => Object.keys(direction).includes(e.code) && setBackgroundCoordinate((pre)=>direction[e.code]?.call(pre));
  
  return (
    <div className="App" onKeyDown={moveObject} tabIndex="0">
      <Background backgroundCoordinate={backgroundCoordinate}/>
     <Character backgroundCoordinate={backgroundCoordinate}/>
    </div>
  );
}

export default App;
