"use client";
import React, { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, slideIn } from '@/lib/animation-variants';

const ApiSection = () => {
  const codeRef = useRef(null);
  const highlighted = useRef(false);

  // NOTE: Replace YOUR_DOMAIN with the actual domain when deployed
  const API_ENDPOINT = 'storytime.ericfranzee.com/api/v1/generate-video';

  const apiExamples = {
    curl: `curl -X POST ${API_ENDPOINT} \\
  -H "Authorization: Bearer sk_YOUR_USER_ID" \\
  -H "Content-Type: application/json" \\
  -d '{
    "story": "A brave tortoise decided to race the hare...",
    "music": "1",
    "voice": "en-US-Andrew",
    "storyType": "African Folktales",
    "isVertical": false
  }'`,
    python: `import requests

api_key = 'sk_YOUR_USER_ID'
url = '${API_ENDPOINT}'

payload = {
    'story': 'A brave tortoise decided to race the hare...',
    'music': '1', # '1': Joyful, '2': Horror, '3': Piano, '4': Natural, '5': Love, 'others'
    # 'musicUrl': 'https://example.com/your_music.mp3', # Required if music='others'
    'voice': 'en-US-Andrew', # See documentation for all voice options
    'storyType': 'African Folktales', # Or 'History', 'News', 'Bedtime Stories'
    'isVertical': False, # True for 9:16, False for 16:9
    # 'video_length': 'medium' # Optional: 'default', 'medium', 'long' (Pro/Elite only)
}

headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}

response = requests.post(url, json=payload, headers=headers)

if response.status_code == 202:
    print("Video generation started successfully!")
    print(response.json())
else:
    print(f"Error: {response.status_code}")
    print(response.json())
`,
    node: `const axios = require('axios');

const generateVideo = async () => {
  const apiKey = 'sk_YOUR_USER_ID';
  const url = '${API_ENDPOINT}';

  const payload = {
    story: 'A brave tortoise decided to race the hare...',
    music: '1', // '1': Joyful, '2': Horror, '3': Piano, '4': Natural, '5': Love, 'others'
    // musicUrl: 'https://example.com/your_music.mp3', // Required if music='others'
    voice: 'en-US-Andrew', // See documentation for all voice options
    storyType: 'African Folktales', // Or 'History', 'News', 'Bedtime Stories'
    isVertical: false, // true for 9:16, false for 16:9
    // video_length: 'medium' // Optional: 'default', 'medium', 'long' (Pro/Elite only)
  };

  const headers = {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.post(url, payload, { headers });
    // console.log('Video generation started:', response.data); // Removed for production
    // { success: true, message: '...', videoUrl: '...' }
  } catch (error) {
    console.error('Error generating video:', error.response?.data || error.message);
  }
};

generateVideo();`
  };

  const [copiedLang, setCopiedLang] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('curl');

  const copyToClipboard = async (code: string, lang: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedLang(lang);
    setTimeout(() => setCopiedLang(null), 2000);
  };

  useEffect(() => {
    if (codeRef.current && !highlighted.current) {
      hljs.highlightElement(codeRef.current);
      highlighted.current = true;
    }
  }, [codeRef]);

  return (
    <motion.section 
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      id="api"
    >
      <div className="container mx-auto px-4">
        <motion.div 
          variants={slideIn}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 dark:bg-blue-500/20 backdrop-blur-sm mb-6"
            >
              <span className="text-blue-700 dark:text-blue-300 font-semibold">RESTful API</span>
              <div className="w-2 h-2 rounded-full bg-green-500 ml-2 animate-pulse" />
            </motion.div>
            <motion.h2 
              className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600"
            >
              Powerful Integration
            </motion.h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Integrate our powerful video generation capabilities directly into your applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Features</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Simple RESTful API endpoint (`/api/v1/generate-video`).
                </li>
                 <li className="flex items-center">
                   <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                   </svg>
                   Authenticate with your unique API key.
                 </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Choose from various story types, voices, and music options.
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                   Specify video orientation (landscape or vertical).
                 </li>
                 <li className="flex items-center">
                   <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                   </svg>
                   Provide your own background music URL.
                 </li>
                 <li className="flex items-center">
                   <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                   </svg>
                   Request longer video durations (Pro/Elite plans).
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Quick Start</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Find your API Key (`sk_YOUR_USER_ID`) in your Account Settings.</li>
                <li>Send a POST request to `/api/v1/generate-video`.</li>
                <li>Include your API key in the `Authorization: Bearer` header.</li>
                 <li>Provide `story`, `voice`, `music`, and `storyType` in the JSON body.</li>
                 <li>Optionally include `isVertical` (boolean), `musicUrl` (if `music` is 'others'), and `video_length` ('medium' or 'long' for Pro/Elite).</li>
               </ol>
            </div>
          </div>

           <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm text-blue-800 dark:text-blue-200">
             <strong>Note:</strong> Your API key (`sk_...`) can be found in the 'API' tab of your account dashboard.
           </div>

          <div className="relative mt-12">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <TabsList className="inline-flex p-1 rounded-lg bg-gray-100 dark:bg-gray-800">
                  {Object.keys(apiExamples).map((lang) => (
                    <TabsTrigger
                      key={lang}
                      value={lang}
                      className="px-4 py-2 rounded-md transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                    >
                      {lang.toUpperCase()}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <AnimatePresence mode="wait">
                {Object.entries(apiExamples).map(([lang, code]) => (
                  <TabsContent key={lang} value={lang}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="relative group"
                    >
                      <pre className="p-6 rounded-lg bg-gray-900 overflow-x-auto">
                        <code className={`language-${lang} text-white text-sm`}>{code}</code>
                      </pre>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => copyToClipboard(code, lang)}
                        className="absolute top-4 right-4 px-3 py-2 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 
                          opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2"
                      >
                        {copiedLang === lang ? (
                          <>
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>Copy</span>
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  </TabsContent>
                ))}
              </AnimatePresence>
            </Tabs>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="mt-16 inline-flex items-center"
          >
            <a
              href="/documentation"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full 
                font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            >
              View Full Documentation
              <motion.svg 
                className="ml-2 w-5 h-5 inline-block group-hover:translate-x-1 transition-transform"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ApiSection;
