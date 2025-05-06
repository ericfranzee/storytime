"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Re-added Button
import { Input } from "@/components/ui/input"; // Re-added Input
import { // Re-added lucide-react icons
  PlayCircle, Settings, Code, FileVideo, Music, 
  Mic, Layout, Tags, RefreshCcw, BookOpen, Headphones,
  PenTool, Video, Users, Zap, Gift, Key, Search
} from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Re-added Alert components
import { // Re-added Accordion components
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { FloatingActionButton } from "@/components/ui/floating-action-button"; // Re-added FloatingActionButton
import { cn } from "@/lib/utils";

// Add type definitions
type StepItem = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

type ContentItem = {
  type?: string;
  title: string;
  description?: string;
  items?: Array<{
    title?: string;
    name?: string;
    description?: string; // Make description optional
    icon?: React.ReactNode;
    tips?: string[];
    id?: string;
    question?: string;
    answer?: string;
  }>;
  features?: Array<{
    title: string;
    description: string;
  }>;
};

type Section = {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: ContentItem[];
};

const TutorialPage = () => {
  // Removed unused activeDemo state
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('quickstart');
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const animations = {
    fadeIn: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 }
    },
    slideIn: {
      initial: { x: -20, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      transition: { duration: 0.3 }
    },
    stagger: {
      animate: {
        transition: {
          staggerChildren: 0.1
        }
      }
    }
  };

  const sections: Section[] = [
    {
      id: 'quickstart',
      title: 'Quick Start Guide',
      icon: <Zap className="w-6 h-6" />,
      content: [
        {
          type: 'steps',
          title: '5-Minute Quick Start',
          items: [
            {
              title: 'Sign Up',
              description: 'Create an account or sign in with Google for immediate access.',
              icon: <Users className="w-5 h-5" />
            },
            {
              title: 'Choose Story Type',
              description: 'Select from African Folktales, History, News, or Bedtime Stories.',
              icon: <BookOpen className="w-5 h-5" />
            },
            {
              title: 'Write or Generate',
              description: 'Enter your story or use our AI-powered story generator.',
              icon: <PenTool className="w-5 h-5" />
            },
            {
              title: 'Customize',
              description: 'Pick voice, music, and video orientation.',
              icon: <Settings className="w-5 h-5" />
            },
            {
              title: 'Generate',
              description: 'Click generate and get your video in minutes!',
              icon: <Video className="w-5 h-5" />
            }
          ]
        }
      ]
    },
    {
      id: 'story-creation',
      title: 'Story Creation',
      icon: <BookOpen className="w-6 h-6" />,
      content: [
        {
          title: 'Story Types',
          description: 'Choose from various story categories:',
          items: [
            {
              title: 'African Folktales',
              description: 'Traditional stories with cultural elements and moral lessons',
              tips: ['Include cultural references', 'Focus on moral lessons', 'Use traditional names']
            },
            {
              title: 'History',
              description: 'Historical events and figures brought to life',
              tips: ['Research accurate details', 'Include dates and locations', 'Focus on key moments']
            },
            {
              title: 'News',
              description: 'Current events transformed into engaging stories',
              tips: ['Stay factual', 'Include relevant dates', 'Focus on human interest']
            },
            {
              title: 'Bedtime Stories',
              description: 'Soothing tales perfect for children',
              tips: ['Use gentle language', 'Include positive messages', 'Keep it simple']
            }
          ]
        }
      ]
    },
    {
      id: 'customization',
      title: 'Customization',
      icon: <Settings className="w-6 h-6" />,
      content: [
        {
          title: 'Voice Settings',
          description: 'Choose from multiple voice options:',
          features: [
            { title: 'Multiple Languages', description: 'Various languages and accents available' },
            { title: 'Voice Preview', description: 'Test voices before generating' },
            { title: 'Voice Speed', description: 'Adjust speaking pace' }
          ]
        },
        {
          title: 'Music Options',
          description: 'Background music categories:',
          items: [
            { id: '1', name: 'Joyful', description: 'Upbeat and positive tracks' },
            { id: '2', name: 'Horror', description: 'Suspenseful and dramatic music' },
            { id: '3', name: 'Piano', description: 'Soft piano melodies' },
            { id: '4', name: 'Natural', description: 'Nature and ambient sounds' },
            { id: '5', name: 'Love', description: 'Romantic and emotional tracks' }
          ]
        }
      ]
    },
    {
      id: 'features',
      title: 'Features Overview',
      icon: <Tags className="w-6 h-6" />,
      content: [
        {
          title: 'Core Features',
          description: 'Explore the powerful features of StoryTime Africa:',
          features: [
            {
              title: 'AI Story Generation',
              description: 'Let AI help you create engaging stories with cultural context'
            },
            {
              title: 'Multiple Voice Options',
              description: 'Choose from various accents and languages'
            },
            {
              title: 'Custom Music Integration',
              description: 'Add your own music or choose from our library'
            },
            {
              title: 'Video Orientation Options',
              description: 'Create videos in landscape (16:9) or vertical (9:16) format'
            }
          ]
        }
      ]
    },
    {
      id: 'video-settings',
      title: 'Video Settings',
      icon: <Video className="w-6 h-6" />,
      content: [
        {
          title: 'Video Configuration',
          description: 'Optimize your video output:',
          items: [
            {
              title: 'Resolution Settings',
              description: 'Videos are generated in high quality 1080p',
              tips: ['16:9 for landscape', '9:16 for vertical/mobile']
            },
            {
              title: 'Duration Optimization',
              description: 'Automatic content pacing for engagement',
              tips: ['2-5 minutes optimal length', 'Automatic scene transitions']
            }
          ]
        }
      ]
    },
    {
      id: 'best-practices',
      title: 'Best Practices',
      icon: <BookOpen className="w-6 h-6" />,
      content: [
        {
          title: 'Writing Tips',
          description: 'Create more engaging content:',
          items: [
            {
              title: 'Story Structure',
              description: 'Follow the classic storytelling format',
              tips: [
                'Clear beginning, middle, and end',
                'Focus on one main message',
                'Include descriptive details'
              ]
            },
            {
              title: 'Cultural Elements',
              description: 'Incorporate authentic cultural aspects',
              tips: [
                'Use traditional names',
                'Include local settings',
                'Reference cultural customs'
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: <RefreshCcw className="w-6 h-6" />,
      content: [
        {
          title: 'Common Issues',
          description: 'Solutions for frequently encountered problems:',
          items: [
            {
              question: 'Video generation is taking too long',
              answer: 'Generation typically takes 5-10 minutes. Check your internet connection and try refreshing the page.',
              description: 'Timeout and connection issues'
            },
            {
              question: 'Lost video after page refresh',
              answer: 'Access your generated videos through the Dashboard → My Videos section. All videos are automatically saved to your account.',
              description: 'Page refresh handling'
            },
            {
              question: 'Voice preview not working',
              answer: 'Ensure your device audio is enabled and try using a different browser.',
              description: 'Audio playback issues'
            },
            {
              question: 'Custom music URL not accepted',
              answer: 'Ensure the URL is public and points directly to an audio file (MP3 format recommended).',
              description: 'Music URL validation'
            },
            {
              question: 'Payment failed or subscription issues',
              answer: 'Check your payment method details and ensure sufficient funds. Contact support if issues persist.',
              description: 'Payment troubleshooting'
            },
            {
              question: 'Video generation limit reached',
              answer: 'Upgrade your subscription plan or wait for the next billing cycle for more video generations.',
              description: 'Usage limits'
            }
          ]
        },
        {
          title: 'Support Resources',
          description: 'Additional help and resources:',
          items: [
            {
              question: 'Customer Support',
              answer: 'Email us at support@storytimeafrica.com for direct assistance.',
              description: 'Contact information'
            },
            {
              question: 'Blog & Updates',
              answer: 'Visit our blog for latest features, tips, and best practices: blog.storytimeafrica.com',
              description: 'Knowledge resources'
            },
            {
              question: 'Community Forum',
              answer: 'Join our community forum to connect with other users and share experiences.',
              description: 'User community'
            }
          ]
        }
      ]
    }
  ];

  const navCards = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of video creation',
      icon: <PlayCircle className="w-8 h-8" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Story Types',
      description: 'Explore different story categories',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'bg-green-500'
    },
    {
      title: 'Customization',
      description: 'Voice, music, and video settings',
      icon: <Settings className="w-8 h-8" />,
      color: 'bg-purple-500'
    }
  ];

  const renderContent = (contentItem: ContentItem) => {
    if (contentItem.type === 'steps') {
      return (
        <div className="space-y-4">
          {contentItem.items?.map((item, index) => ( // Renamed idx to index
            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {item.icon && <div className="mt-1">{item.icon}</div>}
              <div>
                <h4 className="font-semibold">{item.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (contentItem.features) {
      return (
        <div className="grid gap-4 md:grid-cols-3">
          {contentItem.features.map((feature, idx) => (
            <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-semibold mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      );
    }

    if (contentItem.items) {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          {contentItem.items.map((item, idx) => (
            <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-semibold mb-2">{item.title || item.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
              {item.tips && (
                <ul className="mt-2 space-y-1">
                  {item.tips.map((tip, tipIdx) => (
                    <li key={tipIdx} className="text-sm text-gray-500 dark:text-gray-400">• {tip}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const filteredSections = sections.filter(section => 
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.content.some(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const [progress, setProgress] = useState(0);

  const FloatingButtons = () => (
    <motion.div 
      className="fixed bottom-8 left-8 flex flex-col gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <FloatingActionButton
        icon={<Headphones className="w-6 h-6" />}
        onClick={() => window.location.href = '/support'}
        tooltip="Need Help!"
      />
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-violet-500 z-50 origin-left"
        style={{ scaleX }}
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div {...animations.fadeIn} className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium mb-4">
            Tutorial Guide
          </span>
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
            Master StoryTime Africa
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Transform your stories into engaging videos with our comprehensive guide
          </p>
        </motion.div>

        {/* Enhanced Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-2xl mx-auto mb-8"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search tutorials..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)} // Added type for event
            className="pl-10 w-full"
          />
        </motion.div>

        {/* Progress Tracker */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Tutorial Progress</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Interactive Navigation Cards */}
        <motion.div 
          variants={animations.stagger}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {navCards.map((card, index) => (
            <motion.div
              key={card.title}
              variants={animations.fadeIn}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection(card.title.toLowerCase())}
              className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-all"
            >
              <div className={`${card.color} p-6 text-white h-full`}>
                <motion.div
                  className="absolute right-2 top-2 opacity-10"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  {card.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-sm opacity-90">{card.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Tutorial Content - Mobile Friendly Tabs */}
        <Tabs 
          defaultValue="quickstart" 
          value={activeSection}
          className="w-full"
          onValueChange={(value) => {
            setActiveSection(value);
            setProgress((prev) => Math.min(prev + 10, 100));
          }}
        >
          <div className="relative">
            <ScrollArea className="w-full">
              <TabsList className="inline-flex w-full md:w-auto flex-wrap md:flex-nowrap gap-2 p-1 h-auto">
                {sections.map((section) => (
                  <TabsTrigger 
                    key={section.id} 
                    value={section.id}
                    className={cn(
                      "flex-shrink-0 flex items-center gap-2 px-3 py-1.5 text-sm whitespace-nowrap",
                      "data-[state=active]:bg-primary/10 dark:data-[state=active]:bg-primary/20"
                    )}
                  >
                    {section.icon}
                    <span className="hidden sm:inline">{section.title}</span>
                    <span className="inline sm:hidden">{section.title.split(' ')[0]}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>
            <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent md:hidden" />
          </div>

          <AnimatePresence mode="wait">
            {filteredSections.map((section) => (
              <TabsContent key={section.id} value={section.id} className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid gap-6"
                >
                  {section.content.map((contentItem, index) => (
                    <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <h3 className="text-2xl font-semibold mb-4">{contentItem.title}</h3>
                        {contentItem.description && (
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {contentItem.description}
                          </p>
                        )}
                        {renderContent(contentItem)}
                      </motion.div>
                    </Card>
                  ))}
                </motion.div>
              </TabsContent>
            ))}
          </AnimatePresence>
        </Tabs>

        {/* Troubleshooting Guide */}
        <motion.section 
          {...animations.fadeIn}
          className="mt-16"
        >
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Troubleshooting Guide</h2>
            <Accordion type="single" collapsible>
              {sections.find(section => section.id === 'troubleshooting')?.content[0].items?.map((item, index) => (
                <AccordionItem key={index} value={item.question || `item-${index}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </motion.section>
      </div>

      <FloatingButtons />
    </div>
  );
};

export default TutorialPage;
