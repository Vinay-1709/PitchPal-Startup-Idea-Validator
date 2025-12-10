import React, { useState, useEffect } from 'react';

const LOADING_MESSAGES = [
  "Analyzing market trends and data...",
  "Scouting potential competitors...",
  "Validating your business model...",
  "Structuring the perfect pitch deck...",
  "Calculating viability score...",
  "Identifying customer personas...",
  "Drafting financial projections...",
  "Polishing the final report..."
];

const Loading: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Cycle messages
    const msgInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);

    // Increment progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99) return 99; // Wait for actual completion
        // Slow down as we get closer to 99
        const increment = Math.max(0.5, (100 - prev) / 40); 
        return Math.min(prev + increment, 99);
      });
    }, 100);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-100 dark:bg-indigo-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-100 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-6">
        <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-indigo-100 dark:border-slate-700 rounded-full"></div>
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              className="text-indigo-600 dark:text-indigo-400 transition-all duration-300 ease-out"
              strokeDasharray="289" // 2 * pi * 46
              strokeDashoffset={289 - (289 * progress) / 100}
            />
          </svg>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">
            {Math.round(progress)}%
          </div>
        </div>

        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4 tracking-tight text-center">Analyzing Your Vision</h2>
        
        <div className="h-8 overflow-hidden text-center w-full">
          <p className="text-indigo-600 dark:text-indigo-400 font-medium text-lg animate-fade-in-up transition-all duration-500">
            {LOADING_MESSAGES[messageIndex]}
          </p>
        </div>
        
        <div className="mt-8 w-64 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;