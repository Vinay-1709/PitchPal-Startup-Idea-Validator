import React, { useRef } from 'react';
import { AnalysisResponse } from '../types';
import MetricPie from './MetricPie';
import PitchDeck from './PitchDeck';
import CostBreakdownChart from './CostBreakdownChart';
import { CheckCircle2, TrendingUp, Users, ShieldAlert, BadgeDollarSign, BookOpen, IndianRupee, PieChart as PieIcon, Lightbulb } from 'lucide-react';

interface ResultPageProps {
  data: AnalysisResponse;
  onReset: () => void;
  originalIdea?: string;
}

const ResultPage: React.FC<ResultPageProps> = ({ data, onReset, originalIdea = "" }) => {
  const { analysis, pitchDeck } = data;
  
  const CardHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">
      <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      <h3 className="font-bold text-slate-800 dark:text-white">{title}</h3>
    </div>
  );

  return (
    <>
      <div className="max-w-7xl mx-auto pb-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Analysis Results</h2>
          <div className="flex space-x-3">
            <button
              onClick={onReset}
              className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Analyze Another
            </button>
          </div>
        </div>

        {/* Top Section: Score & Feasibility */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
            <h3 className="text-center font-bold text-slate-800 dark:text-white mb-6">Viability Score</h3>
            <MetricPie score={analysis.score} />
            <div className="mt-6 text-center">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                analysis.score > 75 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                analysis.score > 50 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {analysis.score > 75 ? 'High Potential' : analysis.score > 50 ? 'Needs Refinement' : 'High Risk'}
              </span>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
            <CardHeader icon={CheckCircle2} title="Feasibility & Problem/Solution Fit" />
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Feasibility</h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{analysis.feasibility}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Problem-Solution Fit</h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{analysis.problemSolution}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions Section - Only if there are suggestions */}
        {analysis.suggestions && analysis.suggestions.length > 0 && (
          <div className="mb-8 bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 transition-colors">
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-bold text-slate-800 dark:text-white">Suggestions for Improvement</h3>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1">
               {analysis.suggestions.map((suggestion, idx) => (
                 <div key={idx} className="flex items-start">
                   <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                     {idx + 1}
                   </span>
                   <p className="text-slate-700 dark:text-slate-300">{suggestion}</p>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* Financial Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
              <CardHeader icon={IndianRupee} title="Investment Required" />
              <div className="flex flex-col justify-center h-full pb-8">
                  <div className="text-center">
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Estimated Initial Capital</p>
                      <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{analysis.estimatedInvestment}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Based on current market rates in India</p>
                  </div>
              </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
              <CardHeader icon={PieIcon} title="Cost Breakdown" />
              <CostBreakdownChart data={analysis.costBreakdown} />
          </div>
        </div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
            <CardHeader icon={TrendingUp} title="Market Analysis" />
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">{analysis.marketAnalysis}</p>
            {analysis.sources && analysis.sources.length > 0 && (
               <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">
                    <BookOpen className="w-3 h-3 mr-1" />
                    References / Sources
                  </div>
                  <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
                    {analysis.sources.map((source, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-2">•</span>
                        {source}
                      </li>
                    ))}
                  </ul>
               </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
            <CardHeader icon={BadgeDollarSign} title="Business Model" />
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{analysis.businessModel}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
            <CardHeader icon={Users} title="Customer Segments" />
            <div className="flex flex-wrap gap-2">
              {analysis.customerSegments.map((seg, i) => (
                <span key={i} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-100 dark:border-blue-800">
                  {seg}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
            <CardHeader icon={ShieldAlert} title="Competitors" />
            <div className="flex flex-wrap gap-2">
              {analysis.competitors.map((comp, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-600">
                  {comp}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Pitch Deck Section */}
        <div className="mb-12">
           <PitchDeck 
             slides={pitchDeck} 
           />
        </div>
      </div>
    </>
  );
};

export default ResultPage;