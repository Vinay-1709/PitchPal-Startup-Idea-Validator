import React, { useState } from 'react';
import { Mail, MessageCircle, X, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    issue: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `PitchPal Support Request: ${formData.issue.substring(0, 30)}...`;
    const body = `Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0AContact: ${formData.contact}%0D%0A%0D%0AIssue/Request:%0D%0A${formData.issue}`;
    window.location.href = `mailto:saivinaykunapareddy@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleSendWhatsApp = () => {
    const text = `Hi, I need support regarding PitchPal.%0A%0AName: ${formData.name}%0AEmail: ${formData.email}%0AIssue: ${formData.issue}`;
    window.open(`https://wa.me/918309121805?text=${text}`, '_blank');
  };

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 mt-auto transition-colors duration-300 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="text-slate-500 dark:text-slate-400 text-sm mb-4 md:mb-0">
          {/* Removed All Rights Reserved */}
          <span>PitchPal AI Validator</span>
        </div>
        <div className="flex space-x-6 text-sm font-medium text-slate-600 dark:text-slate-400">
          <button 
            onClick={() => setShowSupportModal(true)}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center"
          >
            Contact Support
          </button>
        </div>
      </div>

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Contact Support</h3>
              <button onClick={() => setShowSupportModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSendEmail} className="p-6 space-y-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Fill in the details below. You can send your request via Email or WhatsApp.
              </p>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Contact No</label>
                  <input 
                    type="tel" 
                    name="contact" 
                    value={formData.contact} 
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">How can we help?</label>
                <textarea 
                  name="issue" 
                  value={formData.issue} 
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none" 
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  type="submit"
                  className="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send via Email
                </button>
                <button 
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;