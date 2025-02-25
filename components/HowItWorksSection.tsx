"use client";
import React from 'react';
import { motion } from 'framer-motion';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: "🤖",
      title: "AI Analysis",
      description: "Our AI analyzes your story's content, tone, and context to understand the narrative elements.",
      details: [
        "Natural Language Processing",
        "Sentiment Analysis",
        "Context Mapping"
      ]
    },
    {
      icon: "🎨",
      title: "Visual Generation",
      description: "Advanced algorithms create matching visuals and animations for your story.",
      details: [
        "Scene Composition",
        "Style Transfer",
        "Motion Graphics"
      ]
    },
    {
      icon: "🎵",
      title: "Audio Integration",
      description: "Professional voice-over and background music are seamlessly combined.",
      details: [
        "Voice Synthesis",
        "Audio Mixing",
        "Sound Effects"
      ]
    },
    {
      icon: "✨",
      title: "Final Production",
      description: "Everything is combined into a polished, professional video ready for sharing.",
      details: [
        "Quality Enhancement",
        "Format Optimization",
        "Final Rendering"
      ]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800" id="how-it-works">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">How It Works</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Our advanced AI technology transforms your stories into compelling videos through these steps
        </p>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-blue-200 dark:bg-blue-900 transform -translate-y-1/2 z-10" />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-6 mx-auto text-3xl">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-center mb-4">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">{step.description}</p>
                <ul className="space-y-2">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                      </svg>
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
