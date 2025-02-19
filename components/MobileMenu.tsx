"use client";

import React from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/firebase';
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  setIsLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSignupModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, setIsLoginModalOpen, setIsSignupModalOpen }) => {
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('Logout successful!');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Logout failed: ' + error.message);
      } else {
        console.error('Logout failed: Unknown error');
      }
    }
  };

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
          <li><a href="#api" className="hover:underline text-lg">API</a></li>
          <li><a href="#story" className="hover:underline text-lg">Story Types</a></li>
          <li><a href="#pricing" className="hover:underline text-lg">Pricing</a></li>
          <li><a href="#about" className="hover:underline text-lg">About</a></li>
          {user ? (
            <>
              <li>
                <Button variant="ghost" onClick={handleLogout} className="hover:underline text-lg">Log out</Button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Button variant="ghost" onClick={() => { onClose(); setIsLoginModalOpen(true) }} className="hover:underline text-lg">Log in</Button>
              </li>
              <li>
                <Button variant="ghost" onClick={() => { onClose(); setIsSignupModalOpen(true) }} className="hover:underline text-lg">Sign up</Button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>,
    document.body
  );
};

export default MobileMenu;
