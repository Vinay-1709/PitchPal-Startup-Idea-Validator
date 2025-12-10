import React, { useState } from 'react';
import { X, CheckCircle, Smartphone, Lock, Download, FileText, File } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const upiId = "8309121805@ibl";
  const amount = "10.00";
  const name = "PitchPal";
  const upiLink = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR&tn=PitchPalReport`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

  const handlePaymentComplete = () => {
    setIsVerifying(true);
    // Simulate verification delay
    setTimeout(() => {
      setIsVerifying(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm no-print">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up border border-slate-200 dark:border-slate-700">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Unlock Full Report
            </h2>
            <p className="text-indigo-100 text-sm mt-1">Get PDF, Word & detailed insights.</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 flex flex-col items-center">
          <div className="text-center mb-6">
            <p className="text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider font-semibold mb-1">Total Amount</p>
            <p className="text-4xl font-extrabold text-slate-900 dark:text-white">₹10<span className="text-lg text-slate-500 font-normal">.00</span></p>
          </div>

          <div className="bg-white p-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 shadow-sm mb-6">
            <img src={qrCodeUrl} alt="Payment QR Code" className="w-48 h-48 object-contain" />
          </div>

          <p className="text-slate-600 dark:text-slate-300 text-sm text-center mb-6 px-4">
            Scan with any UPI App (GPay, PhonePe, Paytm) to pay <span className="font-bold text-slate-900 dark:text-white">₹10</span>
          </p>

          <div className="w-full space-y-3">
            <a 
              href={upiLink} 
              className="flex items-center justify-center w-full py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold rounded-xl border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
            >
              <Smartphone className="w-5 h-5 mr-2" />
              Pay via UPI App
            </a>
            
            <button
              onClick={handlePaymentComplete}
              disabled={isVerifying}
              className="flex items-center justify-center w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all active:scale-[0.98]"
            >
              {isVerifying ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verifying Payment...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  I have made the payment
                </>
              )}
            </button>
          </div>
          
          <div className="mt-6 flex items-center justify-center space-x-4 text-xs text-slate-400">
             <span className="flex items-center"><File className="w-3 h-3 mr-1" /> PDF</span>
             <span className="flex items-center"><FileText className="w-3 h-3 mr-1" /> Word</span>
             <span className="flex items-center"><Lock className="w-3 h-3 mr-1" /> Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;