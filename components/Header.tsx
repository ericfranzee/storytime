"use client"
import React, { useState } from 'react';
import { ModeToggle } from "./mode-toggle" // Assuming ModeToggle is in the same directory
import MobileMenu from "./MobileMenu";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-golding-orange text-black dark:text-white p-4">
      <div className="container mx-auto flex flex-row justify-between items-center">
        <h1 className="text-4 font-bold tracking-wide uppercase"><a href="/">Story Time</a></h1>
        <nav className={`${isOpen ? 'flex flex-col absolute top-full left-0 w-full bg-golding-orange text-black dark:text-white p-4' : 'hidden'} md:flex md:items-center md:space-x-4 md:static md:bg-transparent`}>
          <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 justify-center">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="#ApiSection" className="hover:underline">API</a></li>
            <li><a href="#StoryToVideo" className="hover:underline">Story Types</a></li>
            <li><a href="#" className="hover:underline">Pricing</a></li>
            <li><a href="#" className="hover:underline">About</a></li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <div className={`${isOpen ? 'flex flex-col absolute top-full left-0 w-full bg-golding-orange text-black dark:text-white p-4' : 'hidden'} md:flex md:items-center md:space-x-4 md:static md:bg-transparent`}>
          <a href="/login" className="hover:underline bg-dark-purple p-2 rounded">Log in</a>
          <a href="/try-for-free" className="hover:underline bg-dark-purple p-2 rounded">Try for free</a>
          </div>          
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-black dark:text-white focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <MobileMenu isOpen={isOpen} onClose={toggleMenu} />
    </header>
  );
};

export default Header;
