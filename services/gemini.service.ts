import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || '' });

export async function askGeminiFlash(message: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: message,
    });
    
    return response.text ?? '';
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to get response from Gemini');
  }
}