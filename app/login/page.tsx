"use client";

import React, { useState } from 'react';
import LoginModal from '@/components/LoginModal';
import { toast } from 'react-toastify';

const LoginPage: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const handleLoginSuccess = () => {
    toast.success('Login successful!');
  };

  return (
    <div>
      <h1>Login Page</h1>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        setIsSignupModalOpen={setIsSignupModalOpen}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default LoginPage;
