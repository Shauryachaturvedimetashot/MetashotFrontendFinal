'use client';

import React, { useState, useEffect } from 'react';

const funFacts = [
  "The first computer bug was an actual moth!",
  "The average employee spends 28% of their workweek managing emails.",
  "The term 'debugging' originated from removing an actual moth from a computer.",
  "The first computer programmer was a woman named Ada Lovelace.",
  // Add more fun facts here
];

export default function Loading() {
  const [currentFact, setCurrentFact] = useState('');

  useEffect(() => {
    const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
    setCurrentFact(randomFact);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-[#0F8B3B]">
      <div className="bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg rounded-lg p-8 shadow-lg border border-white border-opacity-20 max-w-[80%] text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white border-solid mx-auto"></div>
        <p className="text-white text-lg mt-6">{currentFact}</p>
      </div>
    </div>
  );
}