import { useEffect, useRef, useState } from 'react';

import './App.css';
import socket from './utils/socket';
import Background from './components/background';
import Character from './components/character';
import defaultMapSetting from './libs/defaultMapSetting';
import keyboardEvent from './libs/keyboardEvent';

function App() {
  const [users, setUsers] = useState({});
  const socketId = socket.id;
  const [user, setUser] =useState({
    name: '',
    x: 1800,
    y: 1800,
    direction: 'down',
    state: 'mid',
  }
  );
  const defaultCharacterPosition = defaultMapSetting[0].character;
  const defaultBackgroundPosition = defaultMapSetting[0].background;

  const left = defaultBackgroundPosition.left + defaultCharacterPosition.x - user.x;
  const top = defaultBackgroundPosition.top + defaultCharacterPosition.y - user.y;

  const [move, setMove] = useState(false);
  const [marginBackground, setMarginBackground] = useState({ top, left });
  const [tempBackground, setTempBackground] = useState({ top, left });
  const [background, setBackground] = useState({ top, left });

  useEffect(() => {
    const handleMove = document;

    socket.emit('JOIN_ROOM', {  id: socket.id, cId: 0 }, (userData) => setUser(userData));
    socket.on('makeRoomClient', ( RoomUser) => setUsers(RoomUser));

    handleMove.addEventListener('keydown', (event) => {
      if (Object.keys(keyboardEvent.direction).includes(event.code)) {
        setTempBackground((v) =>
          keyboardEvent.direction[event.code].background.call(v),
        );
        setUser(
          (v) => keyboardEvent.direction[event.code].character.call(v) ,
        );
      }
    });

    handleMove.addEventListener('keyup', () => setUser((v) => ({ ...v, state: 'mid' })));

    socket.on('changeMove', (list, temp) => {
      setUsers(list);
      if (temp !== null)
        (function () {
          setBackground((v) => temp ?? v);
          setMove(false);
        })();
      else setMove(true);
    });

  }, []);

  useEffect(() => {
    socket.emit('CHARACTER_MOVE', { user, tempBackground });
  }, [user]);

  useEffect(() => {
    if (tempBackground.top === background.top && tempBackground.left === background.left)
      setMarginBackground((v) => ({ top: background.top, left: background.left }));
  }, [background, tempBackground]);
  
  return (
    <div className="App">
      <Background marginBackground={marginBackground} />
      <Character socketId={socketId} users={users} marginBackground={ marginBackground } move={move}/>
    </div>
  );
}

export default App;
