import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";
import { AnalysisResult, PitchDeckSlide, AnalysisResponse } from "../types";

// Initialize Gemini Client (FIXED)
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
});

// Analysis Schema
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.INTEGER, description: "A viability score from 0 to 100" },
    feasibility: { type: Type.STRING, description: "Analysis of technical and operational feasibility" },
    marketAnalysis: { type: Type.STRING, description: "Market size, trends, and growth potential" },
    customerSegments: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Target audience segments" },
    problemSolution: { type: Type.STRING, description: "Validation of the problem and proposed solution fit" },
    competitors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key competitors in the space" },
    businessModel: { type: Type.STRING, description: "Revenue streams and cost structure insights" },
    sources: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of real or general sources/references used for data" },
    estimatedInvestment: { type: Type.STRING, description: "Estimated initial investment range in INR (₹…)" },
    costBreakdown: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: "Cost category (e.g., Labor, Raw Materials, SaaS, Marketing)" },
          amount: { type: Type.NUMBER, description: "Estimated cost amount in INR" }
        },
        required: ["category", "amount"]
      },
      description: "Breakdown of initial costs in INR"
    },
    suggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3–5 actionable suggestions to improve the idea"
    }
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

// Pitch Deck Schema
const pitchDeckSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      content: { type: Type.ARRAY, items: { type: Type.STRING } },
      notes: { type: Type.STRING }
    },
    required: ["title", "content", "notes"]
  }
};

// Combined Schema
const combinedSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    analysis: analysisSchema,
    pitchDeck: pitchDeckSchema
  },
  required: ["analysis", "pitchDeck"]
};

// Main Analysis + Pitch Deck Function
export const analyzeIdeaAndGenerateDeck = async (ideaText: string): Promise<AnalysisResponse> => {
  try {
    const model = "gemini-2.5-flash";

    let promptText = `Analyze the following startup idea and generate a pitch deck.

Startup Idea: "${ideaText}"

Provide a JSON response containing:
1. Detailed analysis (feasibility, market, customer segments, problem/solution, competitors, business model, and score 0–100)
2. A structured 10-slide pitch deck (Title, Problem, Solution, Market, Product, Business Model, Competitors, GTM, Financials, Team/Summary)
3. Sources/references used
4. Estimated initial investment range (INR)
5. Cost breakdown (INR)
6. Actionable suggestions to improve the idea`;

    const response = await ai.models.generateContent({
      model: model,
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        responseSchema: combinedSchema,
        temperature: 0.7
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResponse;
    } else {
      throw new Error("No data received from AI");
    }

  } catch (error) {
    console.error("Error generating analysis:", error);
    throw error;
  }
};

// Consultant Chat Session
export const createConsultantChat = (analysisData: AnalysisResponse, originalIdea: string): Chat => {
  const context = `
You are a startup consultant helping the user refine their idea: "${originalIdea}".

Analysis Summary:
Score: ${analysisData.analysis.score}/100
Feasibility: ${analysisData.analysis.feasibility}
Market: ${analysisData.analysis.marketAnalysis}
Competitors: ${analysisData.analysis.competitors.join(", ")}
Business Model: ${analysisData.analysis.businessModel}
Estimated Investment: ${analysisData.analysis.estimatedInvestment}

Answer follow-up questions concisely and helpfully.
`;

  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: "You are an expert startup consultant. Use the context provided to help the user."
    },
    history: [
      { role: "user", parts: [{ text: context }] },
      { role: "model", parts: [{ text: "I have reviewed the analysis. Ask me anything!" }] }
    ]
  });
};
