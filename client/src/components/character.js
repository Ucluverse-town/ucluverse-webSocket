import { useEffect, useRef, useState } from 'react';
const direct = {
  up: 32 * 6,
  down: 0,
  left: 32 * 3,
  right: 32 * 9,
};

const run = {
  mid: 0,
  left: 32,
  right: 32 * 2,
};
const dance = {
  leftUp: 32 * 12,
  rightMid: 32 * 13,
  rightUp: 32 * 14,
  leftMid: 32 * 15,
};

const Character = ({socketId, users, marginBackground,move })=>{
    const characterCanvas = useRef(null);

    const changeMotion = (direction, state) =>
    (dance[state] ?? direct[direction] + run[state]);

    const [characterImg,setCharacterImg] = useState();
    
    useEffect(()=>{
      setCharacterImg(new Image());
    },[]);
  
    useEffect(() => {
      const actx = characterCanvas.current.getContext('2d');
      actx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      Object.entries(users).map(([key,{x,y,direction,state}])=>{
        if(key !== socketId) {
          if(characterImg === undefined) return;
          characterImg.src = '/Assets/snowman.png';

          actx?.drawImage(characterImg,changeMotion(direction,state), 0, 32, 32,  window.innerWidth/2+x-users[socketId].x, window.innerHeight/2+y-users[socketId].y, 50, 50);
        } else {
          if(characterImg === undefined) return;
          characterImg.src = '/Assets/snowman.png';
       
          if(users[socketId].x < 760 || users[socketId].x > 2640 || users[socketId].y < 1160 || users[socketId].y > 3560){
            actx?.drawImage(characterImg, changeMotion(direction,state), 0, 32, 32, window.innerWidth/2, window.innerHeight/2, 50, 50);
          } else {
            actx?.drawImage(characterImg, changeMotion(direction,state), 0, 32, 32, window.innerWidth/2, window.innerHeight/2, 50, 50);
          }
          
          
        }
      })
    }, [characterImg, users]);
  
    
    return <canvas ref={characterCanvas} width={window.innerWidth-350} height={window.innerHeight} className='characterCanvas' />
}

export default Character;