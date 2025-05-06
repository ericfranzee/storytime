import React from 'react';
import { motion } from 'framer-motion';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: "🎨",
      title: "AI-Powered Creativity",
      description: "Our advanced AI transforms your text into visually stunning videos, perfectly matching your story's context."
    },
    {
      icon: "🌍",
      title: "African-Centric Content",
      description: "Specialized in creating authentic African narratives, preserving and sharing our rich cultural heritage."
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Generate professional-quality videos in minutes, not hours. Perfect for tight deadlines."
    },
    {
      icon: "🎯",
      title: "Multiple Story Types",
      description: "From folktales to news reports, create various types of content tailored to your needs."
    },
    {
      icon: "🎵",
      title: "Custom Audio",
      description: "Choose from a curated selection of background music and voice options to perfect your story."
    },
    {
      icon: "💰",
      title: "Cost-Effective",
      description: "Premium quality videos at a fraction of traditional production costs."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: {
      scale: 1.05,
      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800" id="benefits">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Why Choose Story Time?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Transform your storytelling with our cutting-edge AI-powered platform
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className="group relative p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-t-2xl" />
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {benefit.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">
                {benefit.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {benefit.description}
              </p>
              <motion.div 
                className="absolute bottom-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 dark:bg-gray-700"
                whileHover={{ scale: 1.2, rotate: 90 }}
              >
                <svg 
                  className="w-4 h-4 text-blue-500 dark:text-blue-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
