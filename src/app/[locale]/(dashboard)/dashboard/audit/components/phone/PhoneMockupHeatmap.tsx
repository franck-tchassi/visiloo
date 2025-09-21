'use client'

import React from 'react';
import Image from 'next/image';

const PhoneMockupHeatmap = () => {
  const gridSize = 9;
  const circleSize = 22;
  const offset = 6;

  const circles = [];

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const top = row * (circleSize - offset);
      const left = col * (circleSize - offset);
      const value = Math.floor(Math.random() * 3) + 1;

      circles.push(
        <div
          key={`${row}-${col}`}
          className="absolute bg-green-500 bg-opacity-80 text-white font-bold rounded-full flex items-center justify-center text-xs"
          style={{
            width: circleSize,
            height: circleSize,
            top,
            left,
            zIndex: 2,
          }}
        >
          {value}
        </div>
      );
    }
  }

  return (
    <div className="relative w-[477px] h-[847px] mx-auto">
      {/* iPhone mockup */}
      <Image
        src="/iphone-mockup.png"
        alt="iPhone mockup"
        fill
        className="object-contain z-0"
      />

      {/* Heatmap container inside the screen */}
      <div className="absolute top-[190px] left-[75px] w-[320px] h-[320px] z-1 overflow-hidden">
        {/* Background map (optional) */}
        <img
          src="/map-placeholder.png"
          alt="Map"
          className="absolute w-full h-full object-cover z-0"
        />
        {/* Circles grid */}
        {circles}
      </div>
    </div>
  );
};

export default PhoneMockupHeatmap;
