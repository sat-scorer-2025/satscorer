import React, { useState } from 'react';

const Tooltip = ({ text, children }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="cursor-pointer"
      >
        {children}
      </div>
      {show && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-gray-900 text-white text-xs rounded-md shadow-lg w-48 max-w-xs">
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;