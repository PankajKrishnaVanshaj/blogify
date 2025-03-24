import { useState } from "react";

const Draggable = ({ children }) => {
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Function to handle mouse down and touch start
  const handleStart = (e) => {
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);

    if (clientX === undefined || clientY === undefined) return;

    setDragging(true);
    setOffset({
      x: clientX - position.x,
      y: clientY - position.y,
    });
  };

  // Function to handle mouse move and touch move
  const handleMove = (e) => {
    if (dragging) {
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);

      if (clientX === undefined || clientY === undefined) return;

      setPosition({
        x: clientX - offset.x,
        y: clientY - offset.y,
      });
    }
  };

  // Function to handle mouse up and touch end
  const handleEnd = () => {
    setDragging(false);
  };

  return (
    <div
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      className="relative"
    >
      <div
        className="cursor-move"
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Draggable;
