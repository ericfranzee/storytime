"use client"; // Add this directive to make it a Client Component

import React from 'react';
import Link from 'next/link'; // Added Link import
import { voiceOptions } from '@/components/voice-options'; // Import voice options
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css'; // Style for code blocks
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Reuse tabs for examples

// Helper component for code blocks
const CodeBlock: React.FC<{ language: string; code: string }> = ({ language, code }) => {
  const highlightedCode = hljs.highlight(code, { language }).value;
  return (
    <div className="relative bg-gray-800 dark:bg-gray-900 rounded-md my-4">
      <pre className="p-4 overflow-x-auto text-sm">
        <code className={`language-${language}`} dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      </pre>
      <button
        className="absolute top-2 right-2 bg-gray-700 text-gray-300 hover:text-white p-1.5 rounded text-xs"
        onClick={() => navigator.clipboard.writeText(code)}
      >
        Copy
      </button>
    </div>
  );
};

const DocumentationPage = () => {
  // NOTE: Replace YOUR_DOMAIN (e.g: storytime.ericfranzee.com) with the actual domain when deployed
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

api_key = 'sk_YOUR_USER_ID' # Get from your account settings
url = '${API_ENDPOINT}'

payload = {
    'story': 'A brave tortoise decided to race the hare...',
    'music': '1', # '1': Joyful, '2': Horror, '3': Piano, '4': Natural, '5': Love, 'others'
    # 'musicUrl': 'https://example.com/your_music.mp3', # Required if music='others'
    'voice': 'en-US-Andrew', # See full list below
    'storyType': 'African Folktales', # Or 'History', 'News', 'Bedtime Stories'
    'isVertical': False # True for 9:16, False for 16:9
}

headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}

try:
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status() # Raise an exception for bad status codes (4xx or 5xx)

    if response.status_code == 202:
        print("Video generation started successfully!")
        print(response.json())
        # {'success': True, 'message': '...', 'videoUrl': '... or null'}
    else:
        # Should not happen if raise_for_status() is used, but good practice
        print(f"Unexpected status code: {response.status_code}")
        print(response.text)

except requests.exceptions.RequestException as e:
    print(f"An error occurred: {e}")
    if e.response is not None:
        print(f"Status Code: {e.response.status_code}")
        try:
            print(f"Response Body: {e.response.json()}")
        except ValueError:
            print(f"Response Body: {e.response.text}")
`,
    node: `const axios = require('axios');

const generateVideo = async () => {
  const apiKey = 'sk_YOUR_USER_ID'; // Get from your account settings
  const url = '${API_ENDPOINT}';

  const payload = {
    story: 'A brave tortoise decided to race the hare...',
    music: '1', // '1': Joyful, '2': Horror, '3': Piano, '4': Natural, '5': Love, 'others'
    // musicUrl: 'https://example.com/your_music.mp3', // Required if music='others'
    voice: 'en-US-Andrew', // See full list below
    storyType: 'African Folktales', // Or 'History', 'News', 'Bedtime Stories'
    isVertical: false // true for 9:16, false for 16:9
  };

  const headers = {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.post(url, payload, { headers });
    // console.log('Video generation started:', response.data); // Example log
    // { success: true, message: '...', videoUrl: '...' }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error generating video:', error.response?.status, error.response?.data);
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
};

generateVideo();`
  };

  const musicOptionsMap = {
    '1': 'Joyful',
    '2': 'Horror',
    '3': 'Piano',
    '4': 'Natural',
    '5': 'Love',
    'others': 'Custom URL provided via `musicUrl`'
  };

  const storyTypeOptions = [
    "African Folktales",
    "History",
    "News",
    "Bedtime Stories"
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 border-b pb-4">API Documentation</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Welcome to the StoryTime Africa Developer API! This API allows you to programmatically generate videos based on story text, voice selection, background music, and story type.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          The API follows REST principles and uses JSON for request and response bodies. Authentication is handled via Bearer tokens using your unique API key.
        </p>
         <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm text-blue-800 dark:text-blue-200">
           <strong>Note:</strong> Replace `YOUR_DOMAIN` in the endpoint URL examples with "https://storytime.ericfranzee.com" when deployed.
         </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Authentication</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          All API requests must be authenticated using an API key provided in the `Authorization` header as a Bearer token.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          You can find your API key in the <Link href="/#account-settings" className="text-blue-600 hover:underline">Account Settings</Link> modal under the 'API' tab. The key is prefixed with `sk_`.
        </p>
        <div className="text-white"><CodeBlock language="http" code={`Authorization: Bearer sk_YOUR_USER_ID`} /></div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Generate Video Endpoint</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          This endpoint initiates the video generation process.
        </p>
        <div className="mb-4">
          <span className="font-semibold bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded mr-2">POST</span>
          <code className="bg-gray-100 dark:bg-gray-700 p-1 rounded">{API_ENDPOINT}</code>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-2">Request Body Parameters</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border dark:border-gray-600">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Parameter</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Required</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-4 py-2 whitespace-nowrap"><code className="text-sm">story</code></td>
                <td className="px-4 py-2 whitespace-nowrap"><code className="text-sm">string</code></td>
                <td className="px-4 py-2 whitespace-nowrap">Yes</td>
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">The main text content/summary for the video. Max 1500 characters. Note: For processing, the following characters will be replaced with spaces: newlines (\\n), double quotes ("), colons (:), hyphens (-), underscores (_), and periods (.).</td>
              </tr>
              <tr>
                <td className="px-4 py-2 whitespace-nowrap"><code className="text-sm">voice</code></td>
                <td className="px-4 py-2 whitespace-nowrap"><code className="text-sm">string</code></td>
                <td className="px-4 py-2 whitespace-nowrap">Yes</td>
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">The voice identifier for text-to-speech generation. See the full list below.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 whitespace-nowrap"><code className="text-sm">music</code></td>
                <td className="px-4 py-2 whitespace-nowrap"><code className="text-sm">string</code></td>
                <td className="px-4 py-2 whitespace-nowrap">Yes</td>
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">Identifier for the background music. Options: '1' (Joyful), '2' (Horror), '3' (Piano), '4' (Natural), '5' (Love), or 'others'.</td>
              </tr>
               <tr>
                <td className="px-4 py-2 whitespace-nowrap"><code className="text-sm">musicUrl</code></td>
                <td className="px-4 py-2 whitespace-nowrap"><code className="text-sm">string</code></td>
                <td className="px-4 py-2 whitespace-nowrap">If `music` is 'others'</td>
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">A publicly accessible URL to an audio file (e.g., MP3) to use as background music. Required only when `music` is set to 'others'.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 whitespace-nowrap"><code className="text-sm">storyType</code></td>
                <td className="px-4 py-2 whitespace-nowrap"><code className="text-sm">string</code></td>
                <td className="px-4 py-2 whitespace-nowrap">Yes</td>
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">The type of story. Options: "African Folktales", "History", "News", "Bedtime Stories".</td>
              </tr>
              <tr>
                <td className="px-4 py-2 whitespace-nowrap"><code className="text-sm">isVertical</code></td>
                <td className="px-4 py-2 whitespace-nowrap"><code className="text-sm">boolean</code></td>
                <td className="px-4 py-2 whitespace-nowrap">No</td>
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">Specifies video orientation. `true` for vertical (9:16), `false` (default) for landscape (16:9).</td>
              </tr>
               {/* Add video_length parameter */}
               <tr>
                 <td className="px-4 py-2 whitespace-nowrap"><code className="text-sm">video_length</code></td>
                 <td className="px-4 py-2 whitespace-nowrap"><code className="text-sm">string</code></td>
                 <td className="px-4 py-2 whitespace-nowrap">No</td>
                 <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">Desired video length. Options: 'default' (~2 min, 1 credit), 'medium' (2-5 min, 2 credits), 'long' (5+ min, 3 credits). Only available for Pro/Elite plans. Defaults to 'default'.</td>
               </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-2">Example Request Body</h3>
        <div className="text-white"><CodeBlock language="json" code={`{
  "story": "The wise owl shared its knowledge with the forest animals.",
  "voice": "en-NG-Ezinne",
  "music": "4",
  "storyType": "Bedtime Stories",
  "isVertical": true,
  "video_length": "medium" // Optional: Request medium length video
}`} /></div>

        <h3 className="text-xl font-semibold mt-6 mb-2">Responses</h3>
        <h4 className="text-lg font-medium mt-4 mb-1">Success (202 Accepted)</h4>
        <p className="text-gray-700 dark:text-gray-300 mb-2">Indicates the video generation process has been successfully initiated.</p>
        <div className="text-white"><CodeBlock language="json" code={`{
  "success": true,
  "message": "Video generation started. If connection drops, check the provided URL after ~10 minutes.",
  "videoUrl": "https://storage.googleapis.com/..." // or null if not immediately available
}`} /></div>

        <h4 className="text-lg font-medium mt-4 mb-1">Error Responses</h4>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
            <li><code className="text-sm">400 Bad Request</code>: Invalid input data (e.g., missing fields, story too long). Response body includes details.</li>
            <li><code className="text-sm">401 Unauthorized</code>: Missing, invalid, or unknown API key.</li>
            <li><code className="text-sm">403 Forbidden</code>: User subscription not found or video generation limit reached.</li>
            <li><code className="text-sm">500 Internal Server Error</code>: An unexpected error occurred on the server.</li>
            <li><code className="text-sm">502 Bad Gateway</code>: Error communicating with the backend video generation service (n8n).</li>
        </ul>
        <div className="text-white"><CodeBlock language="json" code={`// Example 400 Bad Request
{
  "success": false,
  "error": "Invalid input.",
  "details": {
    "story": "Story content is required."
  }
}

// Example 403 Forbidden
{
  "success": false,
  "error": "Video generation limit reached for your current plan."
}`} /></div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Code Examples</h2>
         <Tabs defaultValue="curl" className="w-full">
           <TabsList>
             <TabsTrigger value="curl">cURL</TabsTrigger>
             <TabsTrigger value="python">Python</TabsTrigger>
             <TabsTrigger value="node">Node.js</TabsTrigger>
           </TabsList>
           <TabsContent value="curl">
           <div className="text-white"><CodeBlock language="bash" code={apiExamples.curl} /></div>
           </TabsContent>
           <TabsContent value="python">
           <div className="text-white"><CodeBlock language="python" code={apiExamples.python} /></div>
           </TabsContent>
           <TabsContent value="node">
           <div className="text-white"><CodeBlock language="javascript" code={apiExamples.node} /></div>
           </TabsContent>
         </Tabs>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Parameter Options</h2>

        <h3 className="text-xl font-semibold mt-6 mb-2">Music Options (`music`)</h3>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 mb-4">
          {Object.entries(musicOptionsMap).map(([value, label]) => (
            <li key={value}><code className="text-sm">{value}</code>: {label}</li>
          ))}
        </ul>
        <p className="text-gray-700 dark:text-gray-300">If you select <code className="text-sm">'others'</code>, you must also provide a valid, publicly accessible URL in the <code className="text-sm">musicUrl</code> parameter.</p>

        <h3 className="text-xl font-semibold mt-6 mb-2">Story Type Options (`storyType`)</h3>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
          {storyTypeOptions.map((type) => (
            <li key={type}><code className="text-sm">{type}</code></li>
          ))}
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-2">Voice Options (`voice`)</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Choose one of the following identifiers for the desired voice:
        </p>
        <div className="max-h-96 overflow-y-auto border dark:border-gray-600 rounded-md p-4 bg-gray-50 dark:bg-gray-800">
          <ul className="space-y-1 text-sm">
            {voiceOptions.map(option => (
              <li key={option.value}>
                <code className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">{option.value}</code> - {option.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <p className="text-gray-600 dark:text-gray-300">
        Don&apos;t worry! We&apos;ll help you get started with our API. Here&apos;s what you need to know:
      </p>

      <p>Here&apos;s a quick example of making an API call:</p>

      <p>That&apos;s it! You&apos;re all set to start using our API.</p>

    </div>
  );
};

export default DocumentationPage;
