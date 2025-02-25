import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { errorMessages } from '@/lib/error-messages';

interface ErrorAlertProps {
  error: string | null;
  onClose?: () => void;
  variant?: 'toast' | 'inline' | 'modal';
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  error, 
  onClose, 
  variant = 'inline' 
}) => {
  if (!error) return null;

  // Get error message from centralized error messages or use raw error
  const message = (errorMessages as any).auth[error] || 
                 (errorMessages as any).subscription[error] || 
                 (errorMessages as any).video[error] ||
                 errorMessages.general[error as keyof typeof errorMessages.general] ||
                 error;

  const variants = {
    toast: "fixed top-4 right-4 z-50 max-w-md",
    inline: "w-full",
    modal: "absolute top-4 left-4 right-4"
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`${variants[variant]} bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              {message}
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-auto flex-shrink-0 text-red-500 hover:text-red-700"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ErrorAlert;
