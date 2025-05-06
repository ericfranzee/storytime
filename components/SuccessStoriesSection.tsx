"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const SuccessStoriesSection = () => {
  const [activeStory, setActiveStory] = useState<number | null>(null);
  const stories = [
    {
      title: "Heritage Preservation",
      organization: "Futurology: AI Inspired Stories",
      impact: "500,000+ Views",
      description: "Digitized over 100 traditional stories, reaching global audiences and preserving cultural heritage for future generations.",
      image: "/assets/images/heritage.png",
      metrics: ["147% Engagement Increase", "85% Cost Reduction", "3x Faster Production"]
    },
    {
      title: "Educational Innovation",
      organization: "Folktales Story Time",
      impact: "20,000+ Students",
      description: "Transformed history lessons into engaging visual content, improving student retention by 60%.",
      image: "/assets/images/african-folktales.png",
      metrics: ["92% Student Satisfaction", "75% Better Retention", "40+ Schools Adopted"]
    },
    {
      title: "Content Automation",
      organization: "Ted Talks",
      impact: "1M+ Daily Viewers",
      description: "Automated video production, delivering breaking stories 5x faster than traditional methods.",
      image: "/assets/images/tedtalk.png",
      metrics: ["8x Viewer Growth", "3hr Production → 15min", "300% Revenue Increase"]
    }
  ];

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: { duration: 0.2, ease: "easeInOut" }
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" id="success-stories">
      <div ref={ref} className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Stories of Impact
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Discover how organizations are revolutionizing storytelling with our platform
          </p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {stories.map((story, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              onHoverStart={() => setActiveStory(index)}
              onHoverEnd={() => setActiveStory(null)}
            >
              <div className="relative h-48 overflow-hidden">
                <motion.img 
                  src={story.image} 
                  alt={story.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <motion.div 
                  className="absolute bottom-4 left-4 right-4 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{story.organization}</span>
                    <span className="bg-blue-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      {story.impact}
                    </span>
                  </div>
                </motion.div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {story.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {story.description}
                </p>
                
                <motion.div 
                  className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700"
                  animate={{ opacity: activeStory === index ? 1 : 0.7 }}
                >
                  {story.metrics.map((metric, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center text-sm"
                    >
                      <motion.svg
                        className="w-5 h-5 text-green-500 mr-2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </motion.svg>
                      {metric}
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
