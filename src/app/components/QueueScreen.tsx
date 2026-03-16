import { ChevronLeft, AlertTriangle, FileText, XCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { api, type Appointment } from "@/data/mockDatabase";

export function QueueScreen() {
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    api.getActiveAppointment().then((data) => {
      setAppointment(data ?? null);
      setLoading(false);
    });
  }, []);

  const handleCancel = async () => {
    if (!appointment) return;
    setCancelling(true);
    const success = await api.cancelAppointment(appointment.id);
    if (success) {
      toast.success("Appointment cancelled successfully.");
      setAppointment(null);
    } else {
      toast.error("Failed to cancel appointment.");
    }
    setCancelling(false);
    setShowCancelConfirm(false);
  };

  const queueNumber = appointment?.queueNumber ?? 14;
  const currentToken = 11;
  const totalInQueue = queueNumber - currentToken + 1;
  const progress = (queueNumber - currentToken) / totalInQueue;
  const circumference = 2 * Math.PI * 45; // ~283
  const dashOffset = circumference * (1 - (1 - progress));

  return (
    <div className="flex-1 bg-teal-50/30 flex flex-col h-full relative">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 border-b border-teal-100 bg-white sticky top-0 z-10 shadow-sm">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-teal-50 active:bg-teal-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-teal-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 flex-1">Live Appointment Status</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 flex flex-col">
        
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
          </div>
        ) : !appointment || appointment.status === "cancelled" ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
              <FileText className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No active appointment</p>
            <button
              onClick={() => navigate("/search")}
              className="bg-teal-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-teal-700 transition-colors"
            >
              Find a Doctor
            </button>
          </div>
        ) : (
          <>
            {/* Centerpiece: Circular Progress */}
            <div className="flex flex-col items-center justify-center mt-4">
              <div className="relative w-56 h-56 flex items-center justify-center">
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-teal-400/20 blur-2xl"></div>
                
                <svg className="w-full h-full transform -rotate-90 relative z-10 drop-shadow-sm" viewBox="0 0 100 100">
                  {/* Background track */}
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e0f2fe" strokeWidth="8" />
                  {/* Progress track */}
                  <circle 
                    cx="50" cy="50" r="45" fill="none" stroke="#0d9488" strokeWidth="8" 
                    strokeDasharray={String(circumference)} strokeDashoffset={String(dashOffset)} strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute flex flex-col items-center text-center z-20">
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-1">Queue Number</span>
                  <span className="text-5xl font-extrabold text-gray-900 tracking-tight">#{queueNumber}</span>
                </div>
              </div>
            </div>

            {/* Status Text */}
            <div className="text-center space-y-2">
              <p className="text-xl font-bold text-gray-900">Doctor is seeing Token <span className="text-blue-600">#{currentToken}</span></p>
              <p className="text-gray-600 font-medium">Estimated wait: <span className="text-teal-700 font-bold bg-teal-50 px-2 py-1 rounded-md">25 mins</span></p>
            </div>

            {/* Alert Box */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 shadow-sm flex gap-3 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-orange-400 to-red-500"></div>
              <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5 ml-1" />
              <div>
                <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wider bg-white/50 px-1.5 py-0.5 rounded">AI Insight</span>
                <p className="text-sm font-medium text-orange-900 mt-1.5 leading-snug">
                  AI predicts a 15-minute delay. You should leave for the clinic in 10 minutes.
                </p>
              </div>
            </div>

            <div className="flex-1"></div>

            {/* Bottom Buttons */}
            <div className="space-y-3 pb-4">
              <button 
                disabled
                className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-400 border border-gray-200 font-bold py-3.5 rounded-xl cursor-not-allowed"
              >
                <FileText className="w-5 h-5" />
                View Digital Prescription
              </button>
              
              <button 
                onClick={() => setShowCancelConfirm(true)}
                className="w-full flex items-center justify-center gap-2 bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 font-bold py-3.5 rounded-xl transition-colors active:scale-[0.98] shadow-sm"
              >
                <XCircle className="w-5 h-5" />
                Cancel / Reschedule
              </button>
            </div>
          </>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="absolute inset-0 bg-black/40 z-50 flex items-end justify-center">
          <div className="bg-white w-full rounded-t-3xl p-6 space-y-4 shadow-xl animate-in slide-in-from-bottom">
            <h3 className="font-bold text-lg text-gray-900">Cancel Appointment?</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to cancel your appointment? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Keep It
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {cancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Cancelling…
                  </>
                ) : (
                  "Yes, Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
