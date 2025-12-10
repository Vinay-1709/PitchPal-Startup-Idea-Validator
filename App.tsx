import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import IdeaInput from './components/IdeaInput';
import Loading from './components/Loading';
import ResultPage from './components/ResultPage';
import { AppState, AnalysisResponse } from './types';
import { analyzeIdeaAndGenerateDeck } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>(AppState.INPUT);
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [currentIdea, setCurrentIdea] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  
  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleAnalyze = async (text: string) => {
    setView(AppState.LOADING);
    setCurrentIdea(text);
    setError(null);
    try {
      const result = await analyzeIdeaAndGenerateDeck(text);
      setData(result);
      setView(AppState.RESULT);
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate analysis. Please check your API key and try again.");
      setView(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setData(null);
    setCurrentIdea("");
    setView(AppState.INPUT);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        {view === AppState.INPUT && (
          <div className="flex flex-col items-center">
            <div className="text-center mb-12 max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                Turn Your Idea Into a <span className="text-indigo-600 dark:text-indigo-400">Startup</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Instant AI validation, market research, and a professional pitch deck generated in seconds.
              </p>
            </div>
            <IdeaInput onAnalyze={handleAnalyze} isProcessing={false} />
          </div>
        )}

        {view === AppState.LOADING && (
          <Loading />
        )}

        {view === AppState.RESULT && data && (
          <ResultPage data={data} onReset={handleReset} originalIdea={currentIdea} />
        )}

        {view === AppState.ERROR && (
           <div className="flex flex-col items-center justify-center py-20">
             <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800 text-center max-w-md">
               <h3 className="text-red-800 dark:text-red-300 font-bold text-lg mb-2">Something went wrong</h3>
               <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
               <button 
                onClick={handleReset}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
               >
                 Try Again
               </button>
             </div>
           </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;