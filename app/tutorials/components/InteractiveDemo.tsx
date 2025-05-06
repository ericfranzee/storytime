"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";

interface InteractiveDemoProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const InteractiveDemo: React.FC<InteractiveDemoProps> = ({
  title,
  description,
  children
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </div>
        <div className="mt-4">
          {children}
        </div>
      </Card>
    </motion.div>
  );
};

export default InteractiveDemo;
