import { LayoutDashboard, Users, Activity, FileText, Settings, Sparkles, CheckCircle2, Home, Search, User, BookOpen, ArrowLeft, ChevronRight, Clock, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { api, type Patient } from "@/data/mockDatabase";

export function ClinicDashboard() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingDone, setMarkingDone] = useState<number | null>(null);
  const [applyingOverbook, setApplyingOverbook] = useState(false);

  useEffect(() => {
    api.getPatients(6).then((data) => {
      setPatients(data);
      setLoading(false);
    });
  }, []);

  const handleMarkDone = async (patient: Patient) => {
    setMarkingDone(patient.id);
    const success = await api.markPatientDone(patient.id);
    if (success) {
      setPatients((prev) => prev.filter((p) => p.id !== patient.id));
      toast.success(`${patient.name} marked as done!`);
    } else {
      toast.error("Failed to update patient status.");
    }
    setMarkingDone(null);
  };

  const handleApplyOverbook = async () => {
    setApplyingOverbook(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Overbook setting applied for 10:00 AM slot!");
    setApplyingOverbook(false);
  };

  const activePatients = patients.filter((p) => p.status !== "done");

  return (
    <div className="flex-1 bg-gray-50 flex flex-col relative h-full">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-teal-100 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')}
            className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center border border-teal-100 hover:bg-teal-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-teal-700" />
          </button>
          <div className="flex flex-col">
            <span className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-700 tracking-tight">Clinic Dashboard</span>
            <span className="text-[10px] text-teal-600 font-medium">Dr. Sarah Jenkins</span>
          </div>
        </div>

        {/* Settings Icon */}
        <button className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center border border-teal-100 hover:bg-teal-100 transition-colors">
          <Settings className="w-5 h-5 text-teal-700" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 bg-teal-50/30">
        
        {/* Date & Time Info */}
        <section className="flex items-center gap-2 text-xs text-gray-600 font-medium">
          <Clock className="w-4 h-4 text-teal-600" />
          <span>Today, Oct 24 • Live Operations</span>
        </section>

        {/* Top Metric Cards */}
        <section className="space-y-3">
          <MetricCard 
            title="Total Patients Today" 
            value={String(activePatients.length > 0 ? 42 : 38)} 
            trend="+5 from avg" 
            trendColor="text-blue-700 bg-blue-50" 
            icon={<Users className="w-5 h-5 text-blue-600" />}
          />
          <MetricCard 
            title="Current Wait Time" 
            value="25 min" 
            trend="-10 min" 
            trendColor="text-emerald-700 bg-emerald-50" 
            icon={<Clock className="w-5 h-5 text-emerald-600" />}
          />
          <MetricCard 
            title="AI No-Show Prediction" 
            value="3" 
            trend="Low risk" 
            trendColor="text-teal-700 bg-teal-50" 
            icon={<AlertCircle className="w-5 h-5 text-teal-600" />}
          />
        </section>

        {/* AI Insights Card */}
        <section>
          <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-teal-600" />
            AI Operations Insight
          </h3>
          
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 p-4 rounded-2xl shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-2xl"></div>
            
            <div className="flex gap-3 items-start relative z-10 mb-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-indigo-100 shadow-sm flex-shrink-0">
                <Activity className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-bold text-indigo-900 text-sm">Drop-off Warning</h4>
                <p className="text-xs text-indigo-800 mt-1.5 leading-relaxed font-medium">
                  Mondays at 10 AM typically have a high patient drop-off rate based on historical data.
                </p>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-white relative z-10 shadow-sm mb-3">
              <span className="text-[9px] uppercase tracking-widest font-bold text-indigo-500">Recommendation</span>
              <p className="text-xs font-semibold text-gray-900 mt-1">
                Overbook the 10:00 AM slot by 1 patient to optimize clinic throughput.
              </p>
            </div>
            
            <button 
              onClick={handleApplyOverbook}
              disabled={applyingOverbook}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-colors shadow-sm relative z-10 shadow-indigo-200 text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {applyingOverbook ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Applying…
                </>
              ) : (
                "Apply Overbook Setting"
              )}
            </button>
          </div>
        </section>

        {/* Live Patient Queue */}
        <section>
          <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-teal-600" />
            Live Patient Queue
          </h3>
          
          <div className="space-y-2">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
              </div>
            ) : activePatients.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm font-medium">No patients in queue</div>
            ) : (
              activePatients.map((p) => (
                <PatientCard
                  key={p.id}
                  token={p.token}
                  name={p.name}
                  reason={p.reason}
                  highlight={p.token === "#14"}
                  isMarking={markingDone === p.id}
                  onMarkDone={() => handleMarkDone(p)}
                />
              ))
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h3 className="font-bold text-gray-800 text-sm mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <QuickActionCard icon={<LayoutDashboard />} label="View Analytics" />
            <QuickActionCard icon={<FileText />} label="Patient Records" />
          </div>
        </section>

      </div>

      {/* Bottom Navigation Bar */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-teal-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex justify-around items-center pt-3 pb-safe-bottom min-h-[64px] z-40">
        <NavItem onClick={() => navigate('/')} icon={<Home />} label="Home" />
        <NavItem onClick={() => navigate('/search')} icon={<Search />} label="Search" />
        <NavItem onClick={() => navigate('/locker')} icon={<BookOpen />} label="Locker" />
        <NavItem onClick={() => navigate('/clinic')} icon={<User />} label="Clinic" active />
      </nav>
    </div>
  );
}

function MetricCard({ title, value, trend, trendColor, icon }: { title: string, value: string, trend: string, trendColor: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-teal-100 p-4 rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-100">
          {icon}
        </div>
        <div>
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{title}</h3>
          <span className="text-2xl font-extrabold text-gray-900">{value}</span>
        </div>
      </div>
      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${trendColor}`}>{trend}</span>
    </div>
  );
}

function PatientCard({ token, name, reason, highlight = false, isMarking, onMarkDone }: { token: string, name: string, reason: string, highlight?: boolean, isMarking: boolean, onMarkDone: () => void }) {
  return (
    <div className={`bg-white border ${highlight ? 'border-orange-200 bg-orange-50/30' : 'border-teal-100'} p-4 rounded-2xl shadow-sm hover:shadow-md transition-all`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm font-bold ${highlight ? 'bg-orange-100 border-orange-200 text-orange-700' : 'bg-teal-100 border-teal-200 text-teal-700'}`}>
            {name[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${highlight ? 'text-orange-600' : 'text-teal-600'}`}>{token}</span>
            </div>
            <h4 className="font-semibold text-gray-900 text-sm">{name}</h4>
          </div>
        </div>
      </div>
      
      <div className="mb-3 pl-13">
        <p className="text-xs text-gray-600 font-medium">{reason}</p>
      </div>
      
      <button 
        onClick={onMarkDone}
        disabled={isMarking}
        className="w-full inline-flex items-center justify-center gap-2 bg-white border border-teal-200 hover:bg-teal-50 hover:border-teal-300 text-teal-700 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isMarking ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <CheckCircle2 className="w-4 h-4" />
        )}
        {isMarking ? "Updating…" : "Mark as Done"}
      </button>
    </div>
  );
}

function QuickActionCard({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="bg-white border border-teal-100 p-4 rounded-2xl shadow-sm flex items-center gap-3 hover:shadow-md hover:border-teal-200 transition-all cursor-pointer group">
      <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-100 text-teal-600 group-hover:bg-teal-100 transition-colors">
        {icon}
      </div>
      <span className="text-xs font-bold text-gray-900 flex-1">{label}</span>
      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600 transition-colors" />
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 cursor-pointer transition-all ${active ? 'text-teal-600' : 'text-gray-400 hover:text-teal-500'}`}
    >
      <div className={`${active ? 'scale-110 drop-shadow-sm bg-teal-50 p-1.5 rounded-xl' : 'p-1.5'}`}>
        {icon}
      </div>
      <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </div>
  );
}