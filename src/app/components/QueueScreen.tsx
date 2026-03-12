import { ChevronLeft, AlertTriangle, FileText, XCircle } from "lucide-react";
import { useNavigate } from "react-router";

export function QueueScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-teal-50/30 flex flex-col h-full relative">
      {/* Header */}
      <header className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-b border-teal-100 bg-white sticky top-0 z-10 shadow-sm">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-teal-50 active:bg-teal-100 transition-colors flex-shrink-0 min-w-[40px] min-h-[40px]"
        >
          <ChevronLeft className="w-6 h-6 text-teal-700" />
        </button>
        <h1 className="text-base sm:text-lg font-bold text-gray-900 flex-1 truncate">Live Appointment Status</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 flex flex-col">
        
        {/* Centerpiece: Circular Progress */}
        <div className="flex flex-col items-center justify-center mt-2 sm:mt-4">
          <div className="relative w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-teal-400/20 blur-2xl"></div>
            
            <svg className="w-full h-full transform -rotate-90 relative z-10 drop-shadow-sm" viewBox="0 0 100 100">
              {/* Background track */}
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e0f2fe" strokeWidth="8" />
              {/* Progress track */}
              <circle 
                cx="50" cy="50" r="45" fill="none" stroke="#0d9488" strokeWidth="8" 
                strokeDasharray="283" strokeDashoffset="140" strokeLinecap="round" 
              />
            </svg>
            <div className="absolute flex flex-col items-center text-center z-20">
              <span className="text-[10px] sm:text-xs font-bold text-teal-600 uppercase tracking-widest mb-1">Queue Number</span>
              <span className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">#14</span>
            </div>
          </div>
        </div>

        {/* Status Text */}
        <div className="text-center space-y-2">
          <p className="text-lg sm:text-xl font-bold text-gray-900">Doctor is seeing Token <span className="text-blue-600">#11</span></p>
          <p className="text-sm sm:text-base text-gray-600 font-medium">Estimated wait: <span className="text-teal-700 font-bold bg-teal-50 px-2 py-1 rounded-md">25 mins</span></p>
        </div>

        {/* Alert Box */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3 sm:p-4 shadow-sm flex gap-3 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-orange-400 to-red-500"></div>
          <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 flex-shrink-0 mt-0.5 ml-2" />
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wider bg-white/50 px-1.5 py-0.5 rounded">AI Insight</span>
            <p className="text-xs sm:text-sm font-medium text-orange-900 mt-1.5 leading-snug">
              AI predicts a 15-minute delay. You should leave for the clinic in 10 minutes.
            </p>
          </div>
        </div>

        <div className="flex-1"></div>

        {/* Bottom Buttons */}
        <div className="space-y-3 pb-4">
          <button 
            disabled
            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-400 border border-gray-200 font-bold py-3 sm:py-3.5 rounded-xl cursor-not-allowed text-sm sm:text-base min-h-[44px]"
          >
            <FileText className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">View Digital Prescription</span>
          </button>
          
          <button className="w-full flex items-center justify-center gap-2 bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 font-bold py-3 sm:py-3.5 rounded-xl transition-colors active:scale-[0.98] shadow-sm text-sm sm:text-base min-h-[44px]">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">Cancel / Reschedule</span>
          </button>
        </div>

      </div>
    </div>
  );
}
