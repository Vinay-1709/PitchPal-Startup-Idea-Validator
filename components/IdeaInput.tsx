import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface IdeaInputProps {
  onAnalyze: (text: string) => void;
  isProcessing: boolean;
}

const IdeaInput: React.FC<IdeaInputProps> = ({ onAnalyze, isProcessing }) => {
  const [idea, setIdea] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim()) {
      onAnalyze(idea);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-300" />
              Validate Your Next Big Thing
            </h2>
            <p className="text-indigo-100 text-lg">
              Enter your startup idea. Our AI will analyze the market, viability, and generate a pitch deck for you.
            </p>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Describe your idea
            </label>
            <textarea
              className="w-full h-40 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none text-lg bg-black text-yellow-400 caret-yellow-400 placeholder-slate-500"
              placeholder="e.g. A marketplace for renting high-end camera gear with insurance included..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              required
            ></textarea>
            <div className="flex justify-end mt-2">
              <span className="text-xs text-slate-400 font-medium">
                {idea.length} characters
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isProcessing || !idea.trim()}
              className={`
                group flex items-center justify-center space-x-2 px-8 py-4 rounded-xl text-lg font-bold text-white transition-all transform w-full sm:w-auto
                ${isProcessing || !idea.trim() 
                  ? 'bg-slate-300 dark:bg-slate-600 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1 shadow-lg hover:shadow-indigo-500/30'}
              `}
            >
              <span>{isProcessing ? 'Analyzing...' : 'Generate Analysis'}</span>
              {!isProcessing && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>

          <div className="flex items-center justify-center space-x-6 text-sm text-slate-400 dark:text-slate-500 mt-6">
             <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>Instant Validation</span>
             <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>Market Data</span>
             <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></span>Pitch Deck</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IdeaInput;