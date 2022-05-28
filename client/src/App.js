import { useEffect, useRef, useState } from 'react';

import './App.css';
import socket from './utils/socket';
import Background from './components/background';
import Character from './components/character';

import {direction} from './libs/keyboardEvent';

function App() {
  const [userInfo, setUserInfo] = useState({});
  const socketId = socket.id;
  const [backgroundCoordinate,setBackgroundCoordinate] = useState({x: 0 ,y:0});
  const moveObject = (e) => {
    if (Object.keys(direction).includes(e.code)) {
      setBackgroundCoordinate((pre)=>direction[e.code]?.call(pre));
      socket.emit('move', backgroundCoordinate);
    }
  }

  useEffect(() => {
    socket.on('set_userInfo', (userInfo) => {
      setUserInfo(userInfo);
    });
    return () => {
      socket.off('set_userInfo');
    }
  });
  useEffect(() => {
    socket.on('draw_move', (userInfo) => {
      setUserInfo(userInfo);
    });
    return () => {
      socket.off('draw_move');
      // 중복 문제 해결
    }
  });
  
  return (
    <div className="App" onKeyDown={moveObject} tabIndex="0">
      <Background backgroundCoordinate={backgroundCoordinate} userInfo={userInfo} />
      <Character backgroundCoordinate={backgroundCoordinate} userInfo={userInfo} socketId={socketId} />
    </div>
  );
}

export default App;
