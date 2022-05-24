import { useEffect, useRef, useState } from 'react';
import map from '../Assets/testMap.png';
const Background = ({backgroundCoordinate})=>{
    const backgroundCanvas = useRef(null);
    const [backgroundImg,setBackgroundImg] = useState();

    useEffect(()=>{
        setBackgroundImg(new Image());
      },[]);

      useEffect(()=>{
        const ctx = backgroundCanvas.current.getContext('2d');
        ctx !== null && ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        if(backgroundImg === undefined)return;
        ctx?.drawImage(backgroundImg, backgroundCoordinate.x, backgroundCoordinate.y, window.innerWidth, window.innerHeight, 0, 0, window.innerWidth, window.innerHeight);
      },[backgroundImg,backgroundCoordinate]);

      useEffect(() => {
        const ctx = backgroundCanvas.current.getContext('2d');
        if(backgroundImg === undefined)return;
        backgroundImg.src = map;
        backgroundImg.onload = () => {
          // ctx?.drawImage(img, 150, 350, window.innerWidth, window.innerHeight, 0, 0, window.innerWidth, window.innerHeight);
          ctx?.drawImage(backgroundImg, 0, 0, window.innerWidth, window.innerHeight, 0, 0, window.innerWidth, window.innerHeight);
        };
      }, [backgroundImg]);
 
    return  <canvas ref={backgroundCanvas} width={window.innerWidth} height={window.innerHeight} className='backgroundCanvas' />
    
}

export default Background;