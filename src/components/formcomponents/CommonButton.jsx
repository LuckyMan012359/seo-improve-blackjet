import React, { memo, useState } from 'react';

const CommonButton = ({
  text,
  className,
  onClick = () => {},
  error,
  type = 'button',
  pressedClass = 'pressed-btn',
  disabledClass = 'disable-btn',
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  return (
    <button
      type={type}
      onMouseDown={() => setIsPressed(true)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`common-btn ${error ? disabledClass : ''} ${
        isPressed ? pressedClass : ''
      } ${className}`}
      onClick={onClick}
      {...props}
    >
      {text}
    </button>
  );
};

export default memo(CommonButton);
