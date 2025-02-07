"use client";

import React from 'react';

const BackToTopButton = () => {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-700 focus:outline-none"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="currentColor">
<path d="M17 15L12 10L7 15" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M17 8L12 3L7 8" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
    </button>
  );
};

export default BackToTopButton;
