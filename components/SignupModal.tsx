"use client"
import React, { useState } from 'react';
import { signUpWithEmailPassword, signInWithGoogle, confirmVerification, sendVerificationCode } from "@/app/firebase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast-utils";
import { Progress } from "@/components/ui/progress";
import './ui/modal-styles.css';
import Modal from '@/components/ui/Modal';

interface SignupModalProps {
  setIsLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  onClose: () => void;
  onSignupSuccess: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, setIsLoginModalOpen, onSignupSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [hasPendingVerification, setHasPendingVerification] = useState(false);
  const { login } = useAuth();

  const strengthIndicators = [
    { color: 'red', label: 'Weak' },
    { color: 'orange', label: 'Fair' },
    { color: 'yellow', label: 'Good' },
    { color: 'green', label: 'Strong' }
  ];

  const getCurrentStrength = () => {
    const index = Math.floor(passwordStrength / 25);
    return strengthIndicators[index] || strengthIndicators[0];
  };

  const validatePassword = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^A-Za-z0-9]/)) strength += 25;
    setPasswordStrength(strength);
  };

  const handleEmailPasswordSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast.error("Passwords don't match", "Please ensure both passwords are identical");
      return;
    }

    if (passwordStrength < 75) {
      showToast.error("Weak Password", "Please create a stronger password");
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUpWithEmailPassword(email, password);
      
      if (result.status === 'pending_verification') {
        setHasPendingVerification(true);
        setVerificationSent(true);
        setPendingEmail(email);
        showToast.info(
          "Pending Verification",
          "You have a pending verification. Would you like to resend the code?"
        );
      } else if (result.status === 'verification_sent') {
        setVerificationSent(true);
        setPendingEmail(email);
        showToast.success(
          "Verification Required",
          "Please check your email for verification code"
        );
      }
    } catch (error) {
      showToast.error(
        "Signup Failed", 
        error instanceof Error ? error.message : "Please try again"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const user = await confirmVerification(pendingEmail, verificationCode);
      login();
      showToast.success("Welcome!", "Your account has been verified");
      onClose();
      onSignupSuccess();
    } catch (error) {
      showToast.error(
        "Verification Failed",
        error instanceof Error ? error.message : "Please try again"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      await sendVerificationCode(pendingEmail);
      showToast.success("Verification Code Resent", "Please check your email");
    } catch (error) {
      showToast.error(
        "Resend Failed",
        error instanceof Error ? error.message : "Please try again"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      login();
      showToast.success("Welcome!", "Successfully signed in with Google");
      onClose();
      onSignupSuccess();
    } catch (error) {
      showToast.error(
        "Google Signup Failed", 
        error instanceof Error ? error.message : "Please try again"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
        
        {verificationSent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4"
              >
                <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Check your email</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We've sent a verification code to {pendingEmail}
              </p>
            </div>

            <div className="space-y-4">
              <form onSubmit={handleVerificationSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Enter Verification Code
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify Account"}
                </Button>
              </form>
              <button
                onClick={handleResendVerification}
                className="text-sm text-blue-600 hover:text-blue-800"
                disabled={isLoading}
              >
                Resend verification code
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Create Account</h2>
            </div>

            <form onSubmit={handleEmailPasswordSignUp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isLoading}
                />
                <div className="space-y-2">
                  <motion.div
                    className="h-1 bg-gray-200 rounded-full overflow-hidden"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                  >
                    <motion.div
                      className={`h-full transition-all duration-300 rounded-full bg-gradient-to-r from-${getCurrentStrength().color}-500 to-${getCurrentStrength().color}-600`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </motion.div>
                  <div className="flex justify-between text-xs">
                    <span className={`text-${getCurrentStrength().color}-500`}>
                      {getCurrentStrength().label}
                    </span>
                    <span className="text-gray-500">
                      {passwordStrength}% Complete
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Password must contain at least 8 characters, including uppercase, numbers & symbols
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>
          </motion.div>
        )}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
            />
          </svg>
          Continue with Google
        </Button>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <button
            onClick={() => { onClose(); setIsLoginModalOpen(true); }}
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Log in
          </button>
        </p>
      </motion.div>
    </Modal>
  );
};

export default SignupModal;
