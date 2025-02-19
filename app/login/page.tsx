import React from 'react';
import LoginModal from '@/components/LoginModal';
import { toast } from 'react-toastify';

interface LoginPageProps {
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSignupModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginPage: React.FC<LoginPageProps> = ({ isLoginModalOpen, setIsLoginModalOpen, setIsSignupModalOpen }) => {
  const handleLoginSuccess = () => {
    toast.success('Login successful!');
  };

  return (
    <div>
      <h1>Login Page</h1>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} setIsSignupModalOpen={setIsSignupModalOpen} onLoginSuccess={handleLoginSuccess} />
    </div>
  );
};

export default LoginPage;
