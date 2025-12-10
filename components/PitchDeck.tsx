import React from 'react';
import { PitchDeckSlide } from '../types';
import { MonitorPlay } from 'lucide-react';

interface PitchDeckProps {
  slides: PitchDeckSlide[];
}

const PitchDeck: React.FC<PitchDeckProps> = ({ slides }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 md:p-8 transition-colors print-content">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
            <MonitorPlay className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
            Generated Pitch Deck
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Structure generated based on investor best practices.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {slides.map((slide, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all avoid-break print-content">
            <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Slide {index + 1}</span>
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded border border-indigo-100 dark:border-indigo-900/50">
                {slide.title}
              </span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{slide.title}</h3>
              <ul className="space-y-2 mb-6">
                {slide.content.map((point, i) => (
                  <li key={i} className="flex items-start text-slate-600 dark:text-slate-300">
                    <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-indigo-500 dark:bg-indigo-400 rounded-full flex-shrink-0"></span>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                  <span className="font-semibold not-italic text-slate-700 dark:text-slate-300 mr-2">Speaker Notes:</span>
                  {slide.notes}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PitchDeck;