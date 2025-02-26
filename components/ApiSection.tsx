"use client"
import React, { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ApiSection = () => {
  const codeRef = useRef(null);
  const highlighted = useRef(false);

  const apiExamples = {
    curl: `curl -X POST https://api.storytime.africa/v1/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "story": "Once upon a time in Africa...",
    "bg_sound": "traditional",
    "voice": "en-NG-Female",
    "storytype": "folktale"
  }'`,
    python: `import requests

api_key = 'YOUR_API_KEY'
url = 'https://api.storytime.africa/v1/generate'

payload = {
    'story': 'Once upon a time in Africa...',
    'bg_sound': 'traditional',
    'voice': 'en-NG-Female',
    'storytype': 'folktale'
}

headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}

response = requests.post(url, json=payload, headers=headers)
video_url = response.json()['video_url']`,
    node: `const axios = require('axios');

const generateVideo = async () => {
  const apiKey = 'YOUR_API_KEY';
  const url = 'https://api.storytime.africa/v1/generate';

  const payload = {
    story: 'Once upon a time in Africa...',
    bg_sound: 'traditional',
    voice: 'en-NG-Female',
    storytype: 'folktale'
  };

  const headers = {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  };

  const response = await axios.post(url, payload, { headers });
  const videoUrl = response.data.video_url;
};`
  };

  useEffect(() => {
    if (codeRef.current && !highlighted.current) {
      hljs.highlightElement(codeRef.current);
      highlighted.current = true;
    }
  }, [codeRef]);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900" id="api">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Developer API</h2><h6 className="text-xl font-bold mb-4">(Comming Soon!)</h6>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Integrate our powerful video generation capabilities directly into your applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Features</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  RESTful API with JSON responses
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Webhook notifications
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Multiple voice options
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Customizable backgrounds
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Getting Started</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Sign up for an API key</li>
                <li>Choose your integration method</li>
                <li>Make your first API call</li>
                <li>Handle webhook responses</li>
              </ol>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <Tabs defaultValue="curl" className="w-full">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <TabsList>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="node">Node.js</TabsTrigger>
                </TabsList>
              </div>

              {Object.entries(apiExamples).map(([lang, code]) => (
                <TabsContent key={lang} value={lang}>
                  <div className="relative">
                    <pre className="p-4 overflow-x-auto">
                      <code className={`language-${lang}`}>{code}</code>
                    </pre>
                    <button
                      className="absolute top-2 right-2 bg-gray-700 text-gray-300 hover:text-white p-2 rounded"
                      onClick={() => {
                        navigator.clipboard.writeText(code);
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="mt-12 text-center">
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              View Full Documentation
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApiSection;
