"use client";

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      <div className="flex flex-col min-h-screen">
        {children}
      </div>
    </motion.div>
  );
};

export default AdminLayout;
