import { GoogleGenAI } from "@google/genai";
import { aIFieldGeneratorPrompt } from "./prompt";

// IMPORTANT: Set your Gemini API key in the environment as GEMINI_API_KEY

export async function generateBookingFormFields(description: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key not set. Please set GEMINI_API_KEY in your environment.");
  }

  const genAI = new GoogleGenAI({ apiKey });
  const model = genAI.models.generateContent;

  const prompt = aIFieldGeneratorPrompt.replace("{{USER_SERVICE_DESCRIPTION}}", description);

  try {
    const result = await model({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const content = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      throw new Error('No content received from Gemini API');
    }

    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonContent = jsonMatch ? jsonMatch[1] : content;
    if (!jsonContent) {
      throw new Error('No JSON content found in response');
    }
    
    const cleanedJson = jsonContent.replace(/\/\/.*$/gm, '').replace(/,(\s*[}\]])/g, '$1').trim();
    console.log(cleanedJson);
    
    return JSON.parse(cleanedJson);
  } catch (error) {
    console.error('Gemini API error:', error);
    return null;
  }
} 