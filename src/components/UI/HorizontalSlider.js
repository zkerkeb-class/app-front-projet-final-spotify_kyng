import React from 'react';

const HorizontalSlider = ({ children }) => {
  return (
    <div className="overflow-hidden w-full">
      <div className="overflow-x-auto p-4">
        <ul className="flex flex-nowrap" role="list" aria-label="Horizontal slider">
          {children}
        </ul>
      </div>
    </div>
  );
};

export default HorizontalSlider;
