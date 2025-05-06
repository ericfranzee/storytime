import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { successMessages } from '@/lib/error-messages';

interface SuccessAlertProps {
  message: string;
  description?: string;
  onClose?: () => void;
  variant?: 'toast' | 'inline' | 'modal';
  autoClose?: boolean;
  duration?: number;
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({
  message,
  description,
  onClose,
  variant = 'inline',
  autoClose = true,
  duration = 5000,
}) => {
  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

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
        className={`${variants[variant]} bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4`}
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              {message}
            </p>
            {description && (
              <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                {description}
              </p>
            )}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-auto pl-3 flex-shrink-0"
            >
              <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SuccessAlert;
