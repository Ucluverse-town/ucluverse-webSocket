import { useEffect, useRef, useState } from 'react';
import airplane from '../Assets/airplane.png';
import snowman from '../Assets/snowman.png';
const Character = ({backgroundCoordinate, userInfo, socketId})=>{
    const characterCanvas = useRef(null);
    const [coordinate,setCoordinate] = useState({x: window.innerHeight/2 ,y:window.innerWidth/2});
    const [characterImg,setCharacterImg] = useState();
    
    
    useEffect(()=>{
      setCharacterImg(new Image());
    },[]);
  
    

    useEffect(() => {
      const actx = characterCanvas.current.getContext('2d');
      actx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      Object.entries(userInfo).map(([key,{x,y}])=>{
        if(key !== socketId) {
          if(characterImg === undefined) return;
          characterImg.src = airplane;
          actx?.drawImage(characterImg, 0, 0, 1411, 1164,  window.innerWidth/2+userInfo[key].x-userInfo[socketId].x, window.innerHeight/2+userInfo[key].y-userInfo[socketId].y, 130, 90);
        } else {
          if(characterImg === undefined) return;
          characterImg.src = airplane;
          actx?.drawImage(characterImg, 0, 0, 1411, 1164, window.innerWidth/2, window.innerHeight/2, 130, 90);
        }
      })
    }, [characterImg, backgroundCoordinate, userInfo]);
  
    
    return <canvas ref={characterCanvas} width={window.innerWidth} height={window.innerHeight} className='characterCanvas' />
}

export default Character;