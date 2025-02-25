export interface GeminiResponse {
  text: string;
  success: boolean;
  error?: string;
}

export interface GeminiConfig {
  temperature: number;
  topK: number;
  topP: number;
  maxOutputTokens: number;
}
