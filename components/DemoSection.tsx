"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const DemoSection = () => {
  const [activeDemo, setActiveDemo] = useState(0);
  
  const demos = [
    {
      title: "African Folktales",
      description: "Transform traditional stories into engaging animations",
      videoId: "08DIcTQcWh4", // Just the video ID from the YouTube URL
      type: "youtube"
    },
    {
      title: "Educational Content",
      description: "Create compelling educational videos effortlessly",
      videoId: "FLVsa44_9kY", // Just the video ID from the YouTube URL
      type: "youtube"
    },
    {
      title: "News Reports",
      description: "Convert news articles into professional video content",
      videoId: "cVcTsWXggvg", // Just the video ID from the YouTube URL
      type: "youtube"
    },
    // {
    //   title: "Educational Content",
    //   description: "Create compelling educational videos effortlessly",
    //   videoUrl: "cVcTsWXggvg",
    //   type: "youtube"
    // },
  ];

  const renderVideo = (demo: typeof demos[0]) => {
    if (demo.type === "youtube") {
      return (
        <iframe
          className="w-full h-full absolute top-0 left-0"
          src={`https://www.youtube.com/embed/${demo.videoId}?autoplay=0&controls=1&rel=0`}
          title={demo.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    return (
      <video 
        className="w-full h-full object-cover"
        controls
        autoPlay
        muted
        loop
      >
        {/* <source src={demo.videoUrl} type="video/mp4" /> */}
        Your browser does not support the video tag.
      </video>
    );
  };

  return (
    <section id="demo" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">See Story Time in Action</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl relative"
          >
            {renderVideo(demos[activeDemo])}
          </motion.div>

          <div className="space-y-8">
            {demos.map((demo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`cursor-pointer p-6 rounded-lg transition-all ${
                  activeDemo === index 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveDemo(index)}
              >
                <h3 className="text-xl font-bold mb-2">{demo.title}</h3>
                <p className={activeDemo === index ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'}>
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
