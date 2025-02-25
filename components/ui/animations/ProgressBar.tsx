import React from 'react';
import { motion } from 'framer-motion';
import { progressAnimation } from '@/lib/animation-variants';

interface ProgressBarProps {
  value: number;
  color?: string;
  height?: number;
  showValue?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = 'bg-blue-500',
  height = 4,
  showValue = false
}) => {
  return (
    <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <motion.div
        className={`${color} h-${height}`}
        initial="initial"
        animate="animate"
        variants={progressAnimation}
        custom={value}
      />
      {showValue && (
        <motion.span
          className="absolute right-0 -top-6 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {value}%
        </motion.span>
      )}
    </div>
  );
};

export default ProgressBar;
