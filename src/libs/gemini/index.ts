import { GoogleGenAI } from "@google/genai";

type PromptOptions = {
  rawText: string;
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("Missing GEMINI_API_KEY in environment variables");
/* ```ts
 * import {GoogleGenAI, setDefaultBaseUrls} from '@google/genai';
 * // Override the base URL for the Gemini API.
 * setDefaultBaseUrls({geminiUrl:'https://gemini.google.com'});
 *
 * // Override the base URL for the Vertex AI API.
 * setDefaultBaseUrls({vertexUrl: 'https://vertexai.googleapis.com'});
 *
 * const ai = new GoogleGenAI({apiKey: 'GEMINI_API_KEY'});
 * ```
 */

class GeminiAIService extends GoogleGenAI {
   constructor() {
    super({ apiKey });
    
  }

  public customizeRawText(  options: PromptOptions) {
    const prompt =
      "Improve the text, make it more concise and to the point. \n" + options.rawText;
    return ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
  }
}

const ai = new GeminiAIService();
export default ai;
