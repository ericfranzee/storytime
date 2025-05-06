"use client";
import React, { useState, useEffect } from 'react';
import { signInWithEmailPassword, signInWithGoogle } from "@/app/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { showToast } from "@/lib/toast-utils";
import ModalTransition from '@/components/ui/animations/ModalTransition';
import FormField from '@/components/ui/animations/FormField';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import ErrorAlert from '@/components/ui/feedback/ErrorAlert';
import LoadingOverlay from '@/components/ui/loading/LoadingOverlay';
import './ui/modal-styles.css';
import Modal from '@/components/ui/Modal';
import { User } from 'firebase/auth';

// Update type definition with proper Firebase User type
type GoogleSignInResult = | {
  status: 'verification_sent';
  email: string | null;
} | User;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  setIsSignupModalOpen?: (isOpen: boolean) => void; // Made optional
  onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, setIsSignupModalOpen, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { delay: 0.1 } }
  };

  const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email.trim() || !password.trim()) {
      setError('auth/missing-fields');
      return;
    }

    try {
      setIsLoading(true);
      await signInWithEmailPassword(email, password);
      login();
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      }
      showToast.success("Welcome back!", "Successfully logged in");
      onClose();
      onLoginSuccess();
    } catch (error: any) {
      setError(error.code || 'auth/unknown-error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle() as GoogleSignInResult;
      
      if ('status' in result && result.status === 'verification_sent') {
        showToast.info(
          "Verification Required",
          "Please check your email to verify your account"
        );
      } else {
        login();
        showToast.success("Welcome!", "Successfully signed in with Google");
        onClose();
        onLoginSuccess();
      }
    } catch (error) {
      showToast.error(
        "Google Login Failed", 
        error instanceof Error ? error.message : "Please try again"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast.error("Email Required", "Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const { auth } = await import("@/app/firebase");
      await sendPasswordResetEmail(auth, email);
      showToast.success(
        "Reset Email Sent", 
        `Check ${email} for password reset instructions`
      );
      setIsForgotPassword(false);
    } catch (error) {
      showToast.error(
        "Reset Failed", 
        error instanceof Error ? error.message : "Please try again"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

        <motion.button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>

        {isLoading && (
          <LoadingOverlay 
            isLoading={isLoading} 
            message="Logging in..." 
          />
        )}
        
        {error && (
          <ErrorAlert
            error={error}
            onClose={() => setError(null)}
            variant="modal"
          />
        )}

        <motion.div variants={formVariants}>
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {isForgotPassword ? "Reset Password" : "Welcome Back"}
          </h2>

          {!isForgotPassword ? (
            <motion.form 
              onSubmit={handleEmailPasswordSignIn}
              className="space-y-6"
              variants={formVariants}
            >
              <FormField 
                label="Email" 
                error={error?.includes('email') ? error : undefined}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isLoading}
                />
              </FormField>

              <FormField 
                label="Password"
                error={error?.includes('password') ? error : undefined}
              >
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isLoading}
                />
              </FormField>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  Forgot password?
                </button>
              </div>

              <motion.div
                className="flex flex-col gap-4"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      ⚪
                    </motion.div>
                  ) : null}
                  {isLoading ? "Logging in..." : "Log In"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                      or continue with
                    </span>
                  </div>
                </div>

                <motion.div className="grid grid-cols-1 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGoogleSignIn}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                      />
                    </svg>
                    Continue with Google
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.form>
          ) : (
            <motion.form 
              onSubmit={handlePasswordReset}
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
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
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Reset Password"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setIsForgotPassword(false)}
              >
                Back to Login
              </Button>
            </motion.form>
          )}
        </motion.div>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          {isForgotPassword ? null : (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => { onClose(); setIsSignupModalOpen && setIsSignupModalOpen(true); }} // Added check
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                Sign up
              </button>
            </>
          )}
        </p>
      </motion.div>
    </Modal>
  );
};

export default LoginModal;
