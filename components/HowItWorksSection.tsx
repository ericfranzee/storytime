"use client";
import React, { useState } from 'react';
import { motion, useMotionTemplate, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

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

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }: {
    currentTarget: HTMLElement;
    clientX: number;
    clientY: number;
  }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden" id="how-it-works">
      <div ref={ref} className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            How the Magic Happens
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Watch your stories transform through our intelligent creation process
          </p>
        </motion.div>

        <div className="relative">
          {/* Animated Progress Line */}
          <motion.div 
            className="hidden lg:block absolute top-1/2 left-0 right-0"
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <svg className="w-full h-2" viewBox="0 0 100 2">
              <motion.path
                d="M0 1 L100 1"
                stroke="url(#gradient)"
                strokeWidth="2"
                fill="none"
                variants={{
                  hidden: { pathLength: 0 },
                  visible: { 
                    pathLength: 1,
                    transition: { duration: 2, ease: "easeInOut" }
                  }
                }}
              />
              <defs>
                <linearGradient id="gradient">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                onMouseMove={onMouseMove}
                onMouseEnter={() => setActiveStep(index)}
                onMouseLeave={() => setActiveStep(null)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="group relative bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300"
                style={{
                  transformStyle: 'preserve-3d',
                }}
                whileHover={{ translateY: -5 }}
              >
                <motion.div
                  className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
                  style={{
                    background: useMotionTemplate`
                      radial-gradient(
                        650px circle at ${mouseX}px ${mouseY}px,
                        rgba(59, 130, 246, 0.15),
                        transparent 80%
                      )
                    `,
                  }}
                />
                <div className="relative">
                  <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-2xl mb-6 mx-auto text-4xl"
                  >
                    {step.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-center mb-4">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center mb-6">{step.description}</p>
                  <motion.ul 
                    className="space-y-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: activeStep === index ? 1 : 0.7 }}
                  >
                    {step.details.map((detail, idx) => (
                      <motion.li
                        key={idx}
                        className="flex items-center text-sm text-gray-500 dark:text-gray-400"
                        initial={{ x: -10, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <motion.svg
                          className="w-5 h-5 text-blue-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: idx * 0.1 }}
                        >
                          <motion.path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </motion.svg>
                        {detail}
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
