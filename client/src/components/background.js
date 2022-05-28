

import { useRef, useEffect } from 'react';


const Background = ({ marginBackground }) => {
  const canvasBackgroundRef = useRef(null);
  const background = new Image();

  useEffect(() => {
    const context = (canvasBackgroundRef.current)?.getContext('2d');
    background.src = '/Assets/testMap.png';
    background.onload = () => {
      context?.drawImage(
        background,
        -marginBackground.left / 2,
        -marginBackground.top / 2,
        window.innerWidth,
        window.innerHeight,
        0,
        0,
        window.innerWidth * 2,
        window.innerHeight * 2,
      );
    };
  });

  useEffect(() => {
    const context = (canvasBackgroundRef.current)?.getContext('2d');
    context !== null && context.clearRect(0, 0, window.screen.width, window.screen.height);
    context?.drawImage(
      background,
      -marginBackground.left / 2,
      -marginBackground.top / 2,
      window.innerWidth,
      window.innerHeight,
      0,
      0,
      window.innerWidth * 2,
      window.innerHeight * 2,
    );
  }, [marginBackground]);

  return (
      <canvas width={window.innerWidth} height={window.innerHeight} ref={canvasBackgroundRef} className='backgroundCanvas'/>
  );
};

export default Background;
