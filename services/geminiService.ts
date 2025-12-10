import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";
import { AnalysisResult, PitchDeckSlide, AnalysisResponse } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
    estimatedInvestment: { type: Type.STRING, description: "Estimated initial investment range in INR (e.g., ₹5,00,000 - ₹10,00,000)" },
    costBreakdown: { 
      type: Type.ARRAY, 
      items: { 
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: "Cost category (e.g., Labor, Raw Materials, Server/SaaS, Marketing, Legal)" },
          amount: { type: Type.NUMBER, description: "Estimated cost amount in INR" }
        },
        required: ["category", "amount"]
      },
      description: "Breakdown of initial costs in INR"
    },
    suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-5 actionable suggestions to improve the idea, especially if viability is low." }
  },
  required: ["score", "feasibility", "marketAnalysis", "customerSegments", "problemSolution", "competitors", "businessModel", "sources", "estimatedInvestment", "costBreakdown", "suggestions"]
};

const pitchDeckSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      content: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Bullet points for the slide" },
      notes: { type: Type.STRING, description: "Speaker notes" }
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

export const analyzeIdeaAndGenerateDeck = async (ideaText: string): Promise<AnalysisResponse> => {
  try {
    const model = "gemini-2.5-flash";
    
    let promptText = `Analyze the following startup idea and generate a pitch deck.
    
    Startup Idea: "${ideaText}"
    
    Provide a JSON response containing:
    1. A detailed analysis (feasibility, market, customers, problem/solution, competitors, business model, and a 0-100 score).
    2. A structured 10-slide pitch deck (Title, Problem, Solution, Market, Product, Business Model, Competitors, GTM, Financials, Team/Summary).
    3. A list of sources or references (e.g., "Industry Reports", "Public Market Data") in the 'sources' field.
    4. An estimated initial investment range specifically in INR (Indian Rupees).
    5. A cost breakdown in INR. 
       - If the idea requires a physical location (e.g., shop, factory), include breakdown for Rent, Interior, Labor, Raw Materials, Licenses, etc.
       - If the idea is digital/SaaS, include breakdown for Server costs, Development, Marketing, Legal, Software Subscriptions, etc.
    6. Actionable suggestions to improve the idea, especially if the viability score is low or there are obvious gaps.`;

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