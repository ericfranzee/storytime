"use client"
import React, { useState } from 'react';
import { signInWithEmailPassword, signInWithGoogle } from "@/app/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface LoginModalProps {
  setIsSignupModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, setIsSignupModalOpen, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleEmailPasswordSignIn = async () => {
    try {
      await signInWithEmailPassword(email, password);
      login();
      onClose();
      onLoginSuccess();
      toast({ title: "Login successful!", variant: "default" });
    } catch (error) {
      toast({ title: "Login failed", description: error instanceof Error ? error.message : "Unknown error", variant: "destructive" });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      login();
      onClose();
      onLoginSuccess();
      toast({ title: "Login successful!", variant: "default" });
    } catch (error) {
      toast({ title: "Login failed", description: error instanceof Error ? error.message : "Unknown error", variant: "destructive" });
    }
  };

  const handleForgotPassword = async () => {
    try {
      const { auth } = await import("@/app/firebase");
      await sendPasswordResetEmail(auth, email);
      toast({ title: "Password reset email sent", description: `A password reset link has been sent to ${email}.` });
      setIsForgotPassword(false);
    } catch (error) {
      toast({ title: "Password reset failed", description: error instanceof Error ? error.message : "Unknown error", variant: "destructive" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`}>
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">{isForgotPassword ? "Reset Password" : "Login"}</h2>

            {/* Email/Password Login */}
            {!isForgotPassword ? (
              <form onSubmit={handleEmailPasswordSignIn} className="mb-4">
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
                  Login with Email
                </button>
                <a onClick={() => setIsForgotPassword(true)} className="text-blue-500 hover:underline block text-center mt-2">
                  Forgot Password?
                </a>
              </form>
            ) : (
              <form onSubmit={handleForgotPassword} className="mb-4">
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
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  Reset Password
                </button>
                <a onClick={() => setIsForgotPassword(false)} className="text-blue-500 hover:underline block text-center mt-2">
                  Back to Login
                </a>
              </form>
            )}

            {/* Google Login */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 mb-4"
            >
              Login with Google
            </button>

            <p className="text-center">
              Don't have an account?{' '}
              <a onClick={() => { onClose(); setIsSignupModalOpen(true); }} className="text-blue-500 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
