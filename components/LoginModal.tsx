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
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

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
      <div className="p-6">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

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

        <div className="flex justify-between items-center mb-4">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold"
          >
            {isForgotPassword ? "Reset Password" : "Welcome Back"}
          </motion.h2>
        </div>

        {!isForgotPassword ? (
          <motion.form 
            onSubmit={handleEmailPasswordSignIn}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
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

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
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

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          {isForgotPassword ? null : (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => { onClose(); setIsSignupModalOpen(true); }}
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                Sign up
              </button>
            </>
          )}
        </p>
      </div>
    </Modal>
  );
};

export default LoginModal;
