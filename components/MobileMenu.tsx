"use client";

import React from 'react';
import { createPortal } from 'react-dom';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const menuClass = `fixed top-0 left-0 w-full h-full z-50 ${
    isOpen ? 'block' : 'hidden'
  } bg-background text-foreground`;

  return createPortal(
    <div className={menuClass}>
      <div className="flex justify-end p-4">
        <button onClick={onClose} className="text-foreground focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <nav className="flex flex-col items-center justify-center h-full">
        <ul className="flex flex-col space-y-4">
          <li><a href="/" className="hover:underline text-lg">Home</a></li>
          <li><a href="#ApiSection" className="hover:underline text-lg">API</a></li>
          <li><a href="#StoryToVideo" className="hover:underline text-lg">Story Types</a></li>
          <li><a href="#" className="hover:underline text-lg">Pricing</a></li>
          <li><a href="#" className="hover:underline text-lg">About</a></li>
          <li><a href="#" className="hover:underline text-lg">Log in</a></li>
          <li><a href="#" className="hover:underline text-lg">Try for free</a></li>
        </ul>
      </nav>
    </div>,
    document.body
  );
};

export default MobileMenu;
