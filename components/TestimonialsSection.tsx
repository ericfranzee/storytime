"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Educational Content Creator",
    image: "/assets/images/testimonials/sarah.jpg",
    content: "Story Time has revolutionized how I create educational content. The AI-powered video generation saves me hours of work while maintaining exceptional quality.",
    rating: 5
  },
  {
    name: "Chidi Okonjo",
    role: "Cultural Historian",
    image: "/assets/images/testimonials/chidi.jpg",
    content: "Finally, a platform that understands African storytelling! The cultural accuracy in the generated videos is impressive. It's helping preserve our heritage.",
    rating: 5
  },
  {
    name: "Maria Rodriguez",
    role: "News Producer",
    image: "/assets/images/testimonials/maria.jpg",
    content: "The speed and quality of video generation is unmatched. We use Story Time daily for our news content, and it never disappoints.",
    rating: 4
  }
];

const TestimonialsSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Voices of Success
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Discover how Story Time is transforming content creation worldwide
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              onHoverStart={() => setActiveTestimonial(index)}
              onHoverEnd={() => setActiveTestimonial(null)}
              className="relative group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-t-2xl" />
              
              <div className="flex items-center mb-6">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="relative"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-blue-100 dark:ring-blue-900">
                    <Image
                      src={testimonial.image}
                      alt={`${testimonial.name}'s avatar`}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  </div>
                  <motion.div
                    initial={false}
                    animate={{ scale: activeTestimonial === index ? 1 : 0.8, opacity: activeTestimonial === index ? 1 : 0 }}
                    className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.div>
                </motion.div>
                
                <div className="ml-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{testimonial.name}</h3>
                  <p className="text-blue-600 dark:text-blue-400">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-4 space-x-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.svg
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </motion.svg>
                ))}
              </div>

              <motion.p 
                className="text-gray-600 dark:text-gray-300 leading-relaxed"
                initial={{ opacity: 0.8 }}
                animate={{ opacity: activeTestimonial === index ? 1 : 0.8 }}
              >
                "{testimonial.content}"
              </motion.p>

              <motion.div
                className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.2, rotate: 90 }}
              >
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default TestimonialsSection;
