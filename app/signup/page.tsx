import React from 'react';
import SignupModal from '@/components/SignupModal';
import { toast } from 'react-toastify';

interface SignupPageProps {
  isSignupModalOpen: boolean;
  setIsSignupModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignupPage: React.FC<SignupPageProps> = ({ isSignupModalOpen, setIsSignupModalOpen, setIsLoginModalOpen }) => {
  const handleSignupSuccess = () => {
    toast.success('Signup successful!');
  };

  return (
    <div>
      <h1>Signup Page</h1>
      <SignupModal isOpen={isSignupModalOpen} onClose={() => setIsSignupModalOpen(false)} setIsLoginModalOpen={setIsLoginModalOpen} onSignupSuccess={handleSignupSuccess} />
    </div>
  );
};

export default SignupPage;
