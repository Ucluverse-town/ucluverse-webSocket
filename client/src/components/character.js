import { useEffect, useRef, useState } from 'react';
import airplane from '../Assets/airplane.png';
const Character = ({backgroundCoordinate})=>{
    const characterCanvas = useRef(null);
    const [coordinate,setCoordinate] = useState({x: window.innerHeight/2 ,y:window.innerWidth/2});
    const [characterImg,setCharacterImg] = useState();

    useEffect(()=>{
        setCharacterImg(new Image());
      },[]);
    
      useEffect(()=>{
        const actx = characterCanvas.current.getContext('2d');
        actx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        if(characterImg === undefined)return;
        characterImg.src = airplane;
        actx?.drawImage(characterImg, 0, 0, 1411, 1164, window.innerWidth/2, window.innerHeight/2, 130, 90);
      },[characterImg,backgroundCoordinate])
    
      useEffect(() => {
    
        const actx = characterCanvas.current.getContext('2d');
        // ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        // actx.clearRect(0, 0, 1000, 1000);
        if(characterImg === undefined)return;
        characterImg.src = airplane;
        characterImg.onload = () => {
          actx?.drawImage(characterImg, 0, 0, 1411, 1164, coordinate.x, coordinate.y, 130, 90);
        };
      }, []);
 
    return <canvas ref={characterCanvas} width={window.innerWidth} height={window.innerHeight} className='characterCanvas' />
    
}

export default Character;