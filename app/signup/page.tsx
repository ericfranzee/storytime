"use client";

import React, { useState } from 'react';
import SignupModal from '@/components/SignupModal';
import { toast } from 'react-toastify';

const SignupPage: React.FC = () => {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [setIsLoginModalOpen, setLoginModalOpen] = useState(false);

  const handleSignupSuccess = () => {
    toast.success('Signup successful!');
  };

  return (
    <div>
      <h1>Signup Page</h1>
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        setIsLoginModalOpen={setLoginModalOpen}
        onSignupSuccess={handleSignupSuccess}
      />
    </div>
  );
};

export default SignupPage;
