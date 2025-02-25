import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!geminiApiKey) {
  throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not set');
}

if (!geminiApiKey.startsWith('AIza')) {
  throw new Error('Invalid API key format. Key should start with "AIza"');
}

export const gemini = new GoogleGenerativeAI(geminiApiKey);

export const geminiConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

export const getGeminiModel = () => {
  return gemini.getGenerativeModel({ model: "gemini-2.0-flash" });
};

export const getGeminiVisionModel = () => {
  return gemini.getGenerativeModel({ model: "gemini-pro-vision" });
};
