import React from 'react';
import { motion } from 'framer-motion';
import { successAnimation } from '@/lib/animation-variants';

const SuccessCheckmark = () => {
  return (
    <motion.div
      className="flex items-center justify-center"
      variants={successAnimation}
      initial="initial"
      animate="animate"
    >
      <div className="rounded-full bg-green-100 p-3">
        <svg
          className="w-6 h-6 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </svg>
      </div>
    </motion.div>
  );
};

export default SuccessCheckmark;
