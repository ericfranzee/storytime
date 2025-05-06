import { getGeminiModel, getGeminiVisionModel } from './gemini-provider';
import { GeminiResponse } from '@/types/gemini';

export async function generateGeminiResponse(prompt: string): Promise<GeminiResponse> {
  try {
    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return {
      text: response.text(),
      success: true,
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      text: 'An error occurred while generating the response.',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function generateGeminiVisionResponse(
  prompt: string,
  imageUrl: string
): Promise<GeminiResponse> {
  try {
    const model = getGeminiVisionModel();
    // const imageResponse = await fetch(imageUrl);
    // const imageBlob = await imageResponse.blob();
    
    const result = await model.generateContent([prompt]);
    const response = await result.response;
    
    return {
      text: response.text(),
      success: true,
    };
  } catch (error) {
    console.error('Gemini Vision API Error:', error);
    return {
      text: 'An error occurred while processing the image.',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
