'use client';
import React, { useEffect, useRef } from 'react';

const HorizontalSlider = ({ children }) => {
  const sliderRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        sliderRef.current.scrollBy({ left: 200, behavior: 'smooth' });
      } else if (event.key === 'ArrowLeft') {
        sliderRef.current.scrollBy({ left: -200, behavior: 'smooth' });
      }
    };

    const currentSlider = sliderRef.current;
    currentSlider.addEventListener('keydown', handleKeyDown);

    return () => {
      currentSlider.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      className="overflow-hidden w-full"
      tabIndex="0"
      role="region"
      aria-label="Horizontal Slider"
      ref={sliderRef}
    >
      <div className="overflow-x-auto p-4">
        <ul
          className="flex flex-nowrap"
          role="list"
          aria-label="Slider items"
        >
          {children}
        </ul>
      </div>
    </div>
  );
};

export default HorizontalSlider;
