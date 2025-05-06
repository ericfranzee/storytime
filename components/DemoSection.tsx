"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DemoSection = () => {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const demos = [
    {
      title: "Educational Content",
      description: "Create compelling educational videos effortlessly",
      videoId: "FLVsa44_9kY", // Just the video ID from the YouTube URL
      type: "youtube"
    },
    {
      title: "African Folktales",
      description: "Transform traditional stories into engaging animations",
      videoId: "08DIcTQcWh4", // Just the video ID from the YouTube URL
      type: "youtube"
    },
    {
      title: "News Reports",
      description: "Convert news articles into professional video content",
      videoId: "cVcTsWXggvg", // Just the video ID from the YouTube URL
      type: "youtube"
    },
  ];

  const variants = {
    enter: { opacity: 0, y: 20 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <section id="demo" className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            See Story Time in Action
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Watch how our AI transforms stories into captivating videos
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-square bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDemo}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="w-full h-full"
              >
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${demos[activeDemo].videoId}?autoplay=0&controls=1&rel=0`}
                  title={demos[activeDemo].title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={() => setIsLoading(false)}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <div className="space-y-4">
            <div className="flex justify-between mb-6">
              {demos.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-1 flex-1 mx-1 rounded-full ${
                    index === activeDemo ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  animate={{
                    backgroundColor: index === activeDemo ? '#3B82F6' : '#E5E7EB'
                  }}
                />
              ))}
            </div>

            {demos.map((demo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`cursor-pointer p-6 rounded-xl transition-all duration-300 border-2 ${
                  activeDemo === index 
                    ? 'bg-blue-500 border-blue-600 shadow-lg shadow-blue-500/25' 
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500'
                }`}
                onClick={() => {
                  setIsLoading(true);
                  setActiveDemo(index);
                }}
              >
                <div className="flex items-center justify-between">
                  <h3 className={`text-xl font-bold ${
                    activeDemo === index ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {demo.title}
                  </h3>
                  <motion.div
                    animate={{ rotate: activeDemo === index ? 180 : 0 }}
                    className={`${activeDemo === index ? 'text-white' : 'text-blue-500'}`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </div>
                <p className={`mt-2 ${
                  activeDemo === index ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {demo.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
