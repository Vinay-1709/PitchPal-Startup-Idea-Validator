import { GoogleGenerativeAI } from "@google/generative-ai";
import { Type, Schema } from "@google/genai/schemas";
import { AnalysisResponse } from "../types";

// Initialize Gemini Client (Browser safe)
const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// ----------------------- SCHEMAS --------------------------
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.INTEGER },
    feasibility: { type: Type.STRING },
    marketAnalysis: { type: Type.STRING },
    customerSegments: { type: Type.ARRAY, items: { type: Type.STRING }},
    problemSolution: { type: Type.STRING },
    competitors: { type: Type.ARRAY, items: { type: Type.STRING }},
    businessModel: { type: Type.STRING },
    sources: { type: Type.ARRAY, items: { type: Type.STRING }},
    estimatedInvestment: { type: Type.STRING },
    costBreakdown: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          amount: { type: Type.NUMBER }
        },
        required: ["category", "amount"]
      }
    },
    suggestions: { type: Type.ARRAY, items: { type: Type.STRING }}
  },
  required: [
    "score",
    "feasibility",
    "marketAnalysis",
    "customerSegments",
    "problemSolution",
    "competitors",
    "businessModel",
    "sources",
    "estimatedInvestment",
    "costBreakdown",
    "suggestions"
  ]
};

const pitchDeckSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      content: { type: Type.ARRAY, items: { type: Type.STRING }},
      notes: { type: Type.STRING }
    },
    required: ["title", "content", "notes"]
  }
};

const combinedSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    analysis: analysisSchema,
    pitchDeck: pitchDeckSchema
  },
  required: ["analysis", "pitchDeck"]
};

// ----------------------- MAIN FUNCTION ----------------------

export const analyzeIdeaAndGenerateDeck = async (
  ideaText: string
): Promise<AnalysisResponse> => {
  try {
    const modelInstance = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
        responseSchema: combinedSchema
      }
    });

    const prompt = `
Analyze the following startup idea and generate a pitch deck:

Idea: "${ideaText}"

Output:
1. Full viability analysis
2. Structured 10-slide pitch deck
3. INR investment estimate
4. INR cost breakdown
5. 3–5 recommendations
`;

    const result = await modelInstance.generateContent(prompt);

    const text = result.response.text();
    return JSON.parse(text) as AnalysisResponse;

  } catch (error) {
    console.error("AI error:", error);
    throw error;
  }
};

// ----------------------- CHAT FUNCTION ----------------------

export const createConsultantChat = (analysisData: AnalysisResponse, idea: string) => {
  const modelInstance = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

  const chat = modelInstance.startChat({
    history: [
      {
        role: "user",
        parts: [{
          text: `
You are a startup consultant.
Idea: "${idea}"

Analysis Summary:
Score: ${analysisData.analysis.score}
Feasibility: ${analysisData.analysis.feasibility}
Market: ${analysisData.analysis.marketAnalysis}
Competitors: ${analysisData.analysis.competitors.join(", ")}
Business Model: ${analysisData.analysis.businessModel}
Investment: ${analysisData.analysis.estimatedInvestment}

Provide helpful, concise advice.
`
        }]
      }
    ]
  });

  return chat;
};
