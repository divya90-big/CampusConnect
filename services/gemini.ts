
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, ResumeData, ATSAnalysis, CriticReview, ColorPalette, TrendsResult } from "../types";

async function executeWithRetry<T>(fn: (ai: GoogleGenAI) => Promise<T>, maxRetries = 2): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // In VS Code environment, process.env.API_KEY is standard.
      const key = process.env.API_KEY;
      if (!key) throw new Error("API_KEY_MISSING");
      const ai = new GoogleGenAI({ apiKey: key });
      return await fn(ai);
    } catch (error: any) {
      lastError = error;
      const message = error?.message || "";
      if ((message.includes("429") || message.toLowerCase().includes("quota")) && attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export const generateResumeData = async (prompt: string, fileData?: { data: string, mimeType: string }): Promise<ResumeData | null> => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { 
        parts: [
          { text: `Parse this resume content into the exact JSON schema provided. \nContent: ${prompt}` },
          ...(fileData ? [{ inlineData: { mimeType: fileData.mimeType, data: fileData.data } }] : [])
        ]
      },
      config: {
        systemInstruction: "You are a specialized HR agent. Extract specific resume details including Core Competencies and Technical Projects into a clean JSON format. If fields are missing from the source, return empty strings.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullName: { type: Type.STRING },
            email: { type: Type.STRING },
            mobile: { type: Type.STRING },
            socialLinks: { type: Type.STRING },
            objective: { type: Type.STRING },
            skills: { type: Type.STRING },
            coreCompetence: { type: Type.STRING },
            projects: { type: Type.STRING },
            experience: { type: Type.STRING },
            achievements: { type: Type.STRING },
            birthDate: { type: Type.STRING },
            martialStatus: { type: Type.STRING },
            languages: { type: Type.STRING },
            address: { type: Type.STRING },
            academics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  course: { type: Type.STRING },
                  institution: { type: Type.STRING },
                  board: { type: Type.STRING },
                  year: { type: Type.STRING },
                  score: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return response.text ? JSON.parse(response.text) : null;
  });
};

export const analyzeATS = async (resumeData: ResumeData): Promise<ATSAnalysis | null> => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Scan this resume: ${JSON.stringify(resumeData)}. Provide score and feedback in JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            formattingFeedback: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedImprovements: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return response.text ? JSON.parse(response.text) : null;
  });
};

export const generateMockExam = async (type: 'aptitude' | 'technical'): Promise<QuizQuestion[]> => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate exactly 30 high-quality ${type} MCQs for campus recruitment. Each must have exactly 4 options and a detailed explanation. Return as a JSON array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING }, minItems: 4, maxItems: 4 },
              correctAnswer: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  });
};

export const generateImage = async (prompt: string): Promise<string | null> => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    return null;
  });
};

export const critiqueDesign = async (image: string, focus: string): Promise<CriticReview | null> => {
  return executeWithRetry(async (ai) => {
    const base64Data = image.split(',')[1];
    const mimeType = image.split(';')[0].split(':')[1];
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: `Critique UI: ${focus}. Return JSON.` }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rating: { type: Type.NUMBER },
            accessibilityScore: { type: Type.NUMBER },
            positives: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING }
          }
        }
      }
    });
    return response.text ? JSON.parse(response.text) : null;
  });
};

export const generatePalette = async (prompt: string): Promise<ColorPalette | null> => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Color palette for: ${prompt}. Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            colors: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { hex: { type: Type.STRING }, label: { type: Type.STRING } } } },
            usage: { type: Type.STRING }
          }
        }
      }
    });
    return response.text ? JSON.parse(response.text) : null;
  });
};

// Performs market trend analysis using Google Search grounding to fetch real-time data.
export const searchTrends = async (query: string): Promise<TrendsResult | null> => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return {
      text: response.text || "",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  });
};
