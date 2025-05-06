import React from 'react';
import { motion } from 'framer-motion';

interface Step {
  label: string;
  status: 'waiting' | 'processing' | 'completed' | 'error';
}

interface ProcessingStepsProps {
  steps: Step[];
  currentStep: number;
}

const ProcessingSteps: React.FC<ProcessingStepsProps> = ({ steps }) => {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={index} className="relative">
          <div className="flex items-center">
            <div className={`
              flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
              ${step.status === 'completed' ? 'bg-green-500' :
                step.status === 'processing' ? 'bg-blue-500' :
                step.status === 'error' ? 'bg-red-500' :
                'bg-gray-300'}
            `}>
              {step.status === 'completed' ? (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : step.status === 'processing' ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white rounded-full border-t-transparent"
                />
              ) : (
                <span className="text-white text-sm">{index + 1}</span>
              )}
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {step.label}
              </h3>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className="ml-4 mt-2 mb-2 w-0.5 h-6 bg-gray-300 dark:bg-gray-700" />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProcessingSteps;
