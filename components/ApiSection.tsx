"use client"
import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

const ApiSection = () => {
  const codeRef = useRef(null);
  const highlighted = useRef(false);

  useEffect(() => {
    if (codeRef.current && !highlighted.current) {
      hljs.highlightElement(codeRef.current);
      highlighted.current = true;
    }
  }, [codeRef]);

  return (
    <div className="container mx-auto mt-10 p-4 md:p-8" id="api">
      <div className="flex flex-col md:flex-row w-full">
        <div className="w-full md:w-1/2 pr-4 mb-4 md:mb-0">
          <h2 className="text-3xl font-bold mb-4">Integrate Our API</h2>
          <p className="text-lg mb-4">
            Enhance your application with our powerful API. Seamlessly integrate our services to create stunning videos effortlessly.
          </p>
          <ul className="list-disc pl-5 text-lg">
            <li>Customizable video creation</li>
            <li>Support for various story types</li>
            <li>Background sound options</li>
            <li>Voice selection for narrations</li>
            <li>Easy integration with your existing applications</li>
          </ul>
        </div>
        <div className="w-full md:w-1/2 pl-4">
          <div className="bg-white p-4 rounded-lg text-black shadow-md">
            <h3 className="text-xl font-semibold mb-2">API Example</h3>
            <div className="relative">
              <pre className="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto">
                <code ref={codeRef} className="language-json">
                  {`POST https://api.ericfranzee.com/storytime\n\nBody:\n{\n  "story": "value",\n  "bg_sound": "value",\n  "voice": "value",\n  "storytype": "value"\n}`}
                </code>
              </pre>
              <button
                className="absolute top-2 right-2 bg-gray-700 text-gray-300 hover:text-white p-2 rounded text-sm focus:outline-none"
                onClick={() => {
                  navigator.clipboard.writeText(((codeRef.current as unknown) as HTMLElement)?.textContent || '');
                }}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiSection;
