"use client";
import React from 'react';
import { motion } from 'framer-motion';

const SuccessStoriesSection = () => {
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

  return (
    <section className="py-20 bg-white dark:bg-gray-900" id="success-stories">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Success Stories</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Real organizations achieving extraordinary results with Story Time
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50 rounded-xl" />
              <div className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl">
                <div className="h-48 bg-gray-200 relative">
                  <img 
                    src={story.image} 
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                    {story.impact}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{story.title}</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">{story.organization}</p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{story.description}</p>
                  
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold mb-2">Key Metrics:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {story.metrics.map((metric, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                        >
                          <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                          </svg>
                          {metric}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
