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

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900" id="benefits">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose Story Time?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
