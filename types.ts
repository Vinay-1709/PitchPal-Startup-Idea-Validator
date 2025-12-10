export interface CostItem {
  category: string;
  amount: number;
}

export interface AnalysisResult {
  score: number;
  feasibility: string;
  marketAnalysis: string;
  customerSegments: string[];
  problemSolution: string;
  competitors: string[];
  businessModel: string;
  sources: string[];
  estimatedInvestment: string;
  costBreakdown: CostItem[];
  suggestions: string[];
}

export interface PitchDeckSlide {
  title: string;
  content: string[];
  notes: string;
}

export interface AnalysisResponse {
  analysis: AnalysisResult;
  pitchDeck: PitchDeckSlide[];
}

export enum AppState {
  INPUT = 'INPUT',
  LOADING = 'LOADING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}