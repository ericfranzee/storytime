import React from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import '@/styles/modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  isWide?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, isWide }) => {
  if (!isOpen) return null;

  // Create portal to modal-root
  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full ${
            isWide ? 'max-w-4xl' : 'max-w-md'
          } z-[10000]`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </div>
    </div>,
    document.getElementById('modal-root') || document.body
  );
};

export default Modal;
