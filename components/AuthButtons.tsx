"use client";

import React from 'react';

interface AuthButtonsProps {
  setIsLoginModalOpen: (open: boolean) => void;
  setIsSignupModalOpen: (open: boolean) => void;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ setIsLoginModalOpen, setIsSignupModalOpen }) => {
  return (
    <div className="flex space-x-4">
      <button
        onClick={() => setIsLoginModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Login
      </button>
      <button
        onClick={() => setIsSignupModalOpen(true)}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Signup
      </button>
    </div>
  );
};

export default AuthButtons;
