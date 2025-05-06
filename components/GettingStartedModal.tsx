"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Image from 'next/image';

interface GettingStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GettingStartedModal: React.FC<GettingStartedModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Story Time",
      content: "Learn how to create stunning videos from your stories in just a few steps.",
      image: "/onboarding/welcome.svg"
    },
    {
      title: "Choose Your Story Type",
      content: "Select from African Folktales, History, News, or Bedtime Stories to get tailored video generation.",
      image: "/onboarding/story-types.svg"
    },
    {
      title: "Craft Your Story",
      content: "Write or paste your story summary. Keep it concise and focused for the best results.",
      image: "/onboarding/writing.svg"
    },
    {
      title: "Customize Your Video",
      content: "Select background music and voice options to perfectly match your story's mood.",
      image: "/onboarding/customize.svg"
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full mx-4 overflow-hidden"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-8">
            <Image
              src={steps[currentStep].image}
              alt={steps[currentStep].title}
              width={500}
              height={300}
              className="w-full h-48 object-contain mb-4"
            />
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              {steps[currentStep].content}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            {currentStep < steps.length - 1 ? (
              <Button onClick={() => setCurrentStep(prev => prev + 1)}>
                Next
              </Button>
            ) : (
              <Button onClick={onClose}>
                Get Started
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GettingStartedModal;
