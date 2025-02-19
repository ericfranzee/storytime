"use client"
import React, { useState } from 'react';
import { signUpWithEmailPassword, signInWithGoogle } from "@/app/firebase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface SignupModalProps {
  setIsLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  onClose: () => void;
  onSignupSuccess: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, setIsLoginModalOpen, onSignupSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { toast } = useToast();

  const handleEmailPasswordSignUp = async () => {
    try {
      await signUpWithEmailPassword(email, password);
      login();
      onClose();
      onSignupSuccess();
      toast({ title: "Signup successful!", variant: "default" });
    } catch (error) {
      toast({ title: "Signup failed", description: error instanceof Error ? error.message : "Unknown error", variant: "destructive" });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      login();
      onClose();
      onSignupSuccess();
      toast({ title: "Signup successful!", variant: "default" });
    } catch (error) {
      toast({ title: "Signup failed", description: error instanceof Error ? error.message : "Unknown error", variant: "destructive" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`}>
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>

            {/* Email/Password Signup */}
            <form onSubmit={handleEmailPasswordSignUp} className="mb-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                  placeholder="username@gmail.com"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                  placeholder="Password"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Signup with Email
              </button>
            </form>

            {/* Google Signup */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 mb-4"
            >
              Signup with Google
            </button>

            <p className="text-center">
              I have an account!{' '}
              <a onClick={() => { onClose(); setIsLoginModalOpen(true); }} className="text-blue-500 hover:underline">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
