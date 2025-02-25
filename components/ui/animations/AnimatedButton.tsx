import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  isLoading,
  loadingText = 'Loading...',
  variant = 'default',
  ...props
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        variant={variant}
        {...props}
        disabled={isLoading || props.disabled}
        className={`relative overflow-hidden ${props.className || ''}`}
      >
        <motion.div
          animate={isLoading ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              />
              <span>{loadingText}</span>
            </div>
          </motion.div>
        )}
      </Button>
    </motion.div>
  );
};

export default AnimatedButton;
