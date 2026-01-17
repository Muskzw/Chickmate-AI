
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzePoop = async (base64Image: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: "Act as an expert poultry veterinarian. Analyze this image of chicken droppings. Identify possible health issues (Coccidiosis, Newcastle, etc.), explain why, suggest immediate first-aid steps, and list necessary precautions. Return the response in clear Markdown." }
      ]
    },
    config: {
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
  return response.text;
};

export const generateSpeech = async (text: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Read the following poultry health report clearly and calmly: ${text.substring(0, 500)}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' }, // Warm, helpful voice
        },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

export const estimateWeight = async (base64Image: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: "Estimate the weight of the broiler chicken in this image. Compare it to standard Ross 308/Cobb 500 sizes. Provide an estimated range in grams as a single number or range. Respond in clear Markdown with the estimated weight clearly highlighted." }
      ]
    },
    config: {
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
  return response.text;
};

export const optimizeFeed = async (params: {
  day: number;
  weight: number;
  temp: number;
  humidity: number;
  location: string;
  birdCount: number;
  feedType: string;
  feedCost: number;
}) => {
  const ai = getAI();
  const prompt = `Act as a Poultry Nutrition Specialist. Optimize feeding for ${params.birdCount} broiler chickens.
Current Stats: Day ${params.day}, Weight ${params.weight}g, Temp ${params.temp}°C, Humidity ${params.humidity}%. 
Current Feed Phase: ${params.feedType}.
Current Feed Cost: $${params.feedCost}/kg.
Location: ${params.location}.

Tasks:
1. Compare current weight against Ross 308/Cobb 500 standards.
2. Calculate daily feed intake adjustment based on temperature/humidity.
3. Search for competitive feed prices in ${params.location}.
4. Provide a cost-benefit analysis comparing the user's cost ($${params.feedCost}/kg) to regional averages.
5. Predict FCR (Feed Conversion Ratio) and potential profit.

Return the response in clear Markdown.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 16384 }
    }
  });
  
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const getAICompanionResponse = async (history: { role: string; message: string }[], currentMessage: string) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are ChickMate AI, a smart poultry management assistant. You provide expert veterinary, nutritional, and financial advice to broiler farmers. Keep responses concise, supportive, and practical for rural farmers.',
    }
  });
  
  const response = await chat.sendMessage({ message: currentMessage });
  return response.text;
};

export const audioAnalysis = async (base64Audio: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'audio/pcm;rate=16000', data: base64Audio } },
        { text: "Listen to this coop recording. Detect any 'snicking', coughing, or gasping sounds indicative of Chronic Respiratory Disease (CRD). Provide a risk assessment level and immediate management advice." }
      ]
    }
  });
  return response.text;
};
