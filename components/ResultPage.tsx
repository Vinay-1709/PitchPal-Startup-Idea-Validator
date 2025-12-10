import React, { useState, useRef, useEffect } from 'react';
import { AnalysisResponse, ChatMessage } from '../types';
import MetricPie from './MetricPie';
import PitchDeck from './PitchDeck';
import CostBreakdownChart from './CostBreakdownChart';
import PaymentModal from './PaymentModal';
import { CheckCircle2, TrendingUp, Users, ShieldAlert, BadgeDollarSign, BookOpen, MessageSquare, Send, User, Bot, IndianRupee, PieChart as PieIcon, Lightbulb, Download } from 'lucide-react';
import { createConsultantChat } from '../services/geminiService';
import { Chat, GenerateContentResponse } from '@google/genai';

interface ResultPageProps {
  data: AnalysisResponse;
  onReset: () => void;
  originalIdea?: string;
}

const ResultPage: React.FC<ResultPageProps> = ({ data, onReset, originalIdea = "" }) => {
  const { analysis, pitchDeck } = data;
  
  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const chatSessionRef = useRef<Chat | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatSessionRef.current) {
      chatSessionRef.current = createConsultantChat(data, originalIdea);
      setChatMessages([{ role: 'model', text: "I've analyzed your idea. Ask me anything about the market, competitors, or financial breakdown!" }]);
    }
  }, [data, originalIdea]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !chatSessionRef.current || isChatLoading) return;

    const userMsg = inputMessage;
    setInputMessage("");
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatLoading(true);

    try {
      const response: GenerateContentResponse = await chatSessionRef.current.sendMessage({ message: userMsg });
      if (response.text) {
        setChatMessages(prev => [...prev, { role: 'model', text: response.text || "I couldn't generate a response." }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleExportSuccess = () => {
    setIsPaymentModalOpen(false);
    
    // 1. Trigger PDF Print
    setTimeout(() => {
      window.print();
    }, 500);

    // 2. Generate Word Doc Download
    try {
      if (reportRef.current) {
        const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
            "xmlns:w='urn:schemas-microsoft-com:office:word' " +
            "xmlns='http://www.w3.org/TR/REC-html40'>" +
            "<head><meta charset='utf-8'><title>PitchPal Report</title></head><body>";
        const footer = "</body></html>";
        // Simple cleanup for the export
        const content = reportRef.current.innerHTML.replace(/<button.*?>.*?<\/button>/g, ""); // Remove buttons
        const sourceHTML = header + content + footer;

        const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
        const fileDownload = document.createElement("a");
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = 'PitchPal_Report.doc';
        fileDownload.click();
        document.body.removeChild(fileDownload);
      }
    } catch (e) {
      console.error("Word export failed", e);
    }
  };

  const CardHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">
      <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      <h3 className="font-bold text-slate-800 dark:text-white">{title}</h3>
    </div>
  );

  return (
    <>
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        onSuccess={handleExportSuccess}
      />
      
      <div className="max-w-7xl mx-auto pb-20" ref={reportRef}>
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 no-print">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Analysis Results</h2>
          <div className="flex space-x-3">
             <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="flex items-center text-white bg-indigo-600 hover:bg-indigo-700 font-medium px-5 py-2 rounded-lg shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report (₹10)
            </button>
            <button
              onClick={onReset}
              className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Analyze Another
            </button>
          </div>
        </div>

        {/* Print Only Title */}
        <div className="hidden print:block mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">PitchPal Report</h1>
            <p className="text-slate-500">Generated for idea: "{originalIdea}"</p>
        </div>

        {/* Top Section: Score & Feasibility */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 avoid-break">
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors print-content">
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

          <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors print-content">
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
          <div className="mb-8 bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 transition-colors avoid-break print-content">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 avoid-break">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors print-content">
              <CardHeader icon={IndianRupee} title="Investment Required" />
              <div className="flex flex-col justify-center h-full pb-8">
                  <div className="text-center">
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Estimated Initial Capital</p>
                      <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{analysis.estimatedInvestment}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Based on current market rates in India</p>
                  </div>
              </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors print-content">
              <CardHeader icon={PieIcon} title="Cost Breakdown" />
              <CostBreakdownChart data={analysis.costBreakdown} />
          </div>
        </div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors avoid-break print-content">
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

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors avoid-break print-content">
            <CardHeader icon={BadgeDollarSign} title="Business Model" />
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{analysis.businessModel}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors avoid-break print-content">
            <CardHeader icon={Users} title="Customer Segments" />
            <div className="flex flex-wrap gap-2">
              {analysis.customerSegments.map((seg, i) => (
                <span key={i} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-100 dark:border-blue-800">
                  {seg}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors avoid-break print-content">
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
        <div className="mb-12 page-break">
           <PitchDeck slides={pitchDeck} />
        </div>

        {/* Chat Section - Hidden when printing */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-indigo-100 dark:border-indigo-900 overflow-hidden transition-colors no-print">
          <div className="bg-indigo-600 p-4 flex items-center text-white">
            <MessageSquare className="w-6 h-6 mr-2" />
            <h3 className="text-lg font-bold">Consultant Chat</h3>
          </div>
          
          <div className="h-96 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900 space-y-4">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mx-2 ${msg.role === 'user' ? 'bg-indigo-200 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'bg-green-200 dark:bg-green-900 text-green-700 dark:text-green-300'}`}>
                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-tl-none shadow-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-4 py-2 rounded-2xl rounded-tl-none shadow-sm ml-12">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex gap-2 transition-colors">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask specific questions about your market, competitors, or deck..."
              className="flex-grow px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              disabled={isChatLoading}
            />
            <button 
              type="submit" 
              disabled={!inputMessage.trim() || isChatLoading}
              className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResultPage;