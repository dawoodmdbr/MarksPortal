import { useEffect, useState } from 'react';
import "../styles/FrostedCursor.css";

const FrostedCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorState, setCursorState] = useState('default'); // 'hover', 'disabled'

  useEffect(() => {
    const move = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target;

      if (target.closest('button:disabled')) {
        setCursorState('disabled');
      } else if (target.closest('button, a, .hoverable')) {
        setCursorState('hover');
      } else {
        setCursorState('default');
      }
    };

    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div
      className={`frosted-cursor ${cursorState}`}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    />
  );
};

export default FrostedCursor;
