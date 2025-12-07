import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AppMode, MessageRole } from "../types";

// Initialize the client strictly as per guidelines
// Expects process.env.API_KEY to be available in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateResponse = async (
  prompt: string,
  mode: AppMode,
  history: { role: string; content: string }[]
): Promise<{ text: string; imageData?: string }> => {
  
  try {
    // IMAGE GENERATION MODE
    if (mode === AppMode.IMAGE) {
      // Using gemini-2.5-flash-image for standard image generation as per guidelines
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          // No responseMimeType for this model
        }
      });

      // Extract image from response parts
      const candidates = response.candidates;
      if (candidates && candidates.length > 0) {
        const parts = candidates[0].content.parts;
        let foundImage = null;
        let foundText = "";

        for (const part of parts) {
          if (part.inlineData) {
            foundImage = `data:image/png;base64,${part.inlineData.data}`;
          } else if (part.text) {
            foundText += part.text;
          }
        }

        if (foundImage) {
          return { text: foundText || "Here is your generated image.", imageData: foundImage };
        }
      }
      return { text: "Sorry, I couldn't generate an image for that prompt." };
    }

    // TEXT & CODE GENERATION MODE
    // Using gemini-2.5-flash for speed and efficiency for general chat
    // Using gemini-3-pro-preview for complex coding tasks
    const modelName = mode === AppMode.CODE ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';
    
    // Construct history for context (simplified)
    const contents = history.map(h => ({
      role: h.role === MessageRole.USER ? 'user' : 'model',
      parts: [{ text: h.content }]
    }));

    // Add current prompt
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: {
        systemInstruction: mode === AppMode.CODE 
          ? "You are an expert software engineer. Provide clean, efficient, and well-documented code."
          : "You are InterGen, a helpful AI assistant. Be concise and witty.",
      }
    });

    return { text: response.text || "No response generated." };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};