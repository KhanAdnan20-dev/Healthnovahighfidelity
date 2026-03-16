import { Bell, MapPin, ChevronDown, Calendar, FolderHeart, Users, Pill, Clock, Activity, Search, Home, User, BookOpen, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { api, type Appointment, type Doctor, db } from "@/data/mockDatabase";

export function HomeScreen() {
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [showClinicDropdown, setShowClinicDropdown] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState("Downtown Clinic");
  const [showNotifications, setShowNotifications] = useState(false);

  const clinics = [...new Set(db.doctors.map((d) => d.clinic))];

  useEffect(() => {
    api.getActiveAppointment().then(async (appt) => {
      if (appt) {
        setAppointment(appt);
        const doc = await api.getDoctorById(appt.doctorId);
        setDoctor(doc ?? null);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex-1 bg-gray-50 flex flex-col relative h-full">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-teal-100 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          {/* HealthNova Logo */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-md">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-700 tracking-tight">HealthNova</span>
            <div className="flex items-center gap-1 cursor-pointer mt-[-2px] relative" onClick={() => setShowClinicDropdown(!showClinicDropdown)}>
              <MapPin className="w-3 h-3 text-teal-600" />
              <span className="text-xs text-gray-500 font-medium">{selectedClinic}</span>
              <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${showClinicDropdown ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center border border-teal-100 relative hover:bg-teal-100 transition-colors"
        >
          <Bell className="w-5 h-5 text-teal-700" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 shadow-sm border border-white"></span>
        </button>
      </header>

      {/* Clinic Dropdown */}
      {showClinicDropdown && (
        <div className="absolute top-[72px] left-4 bg-white border border-teal-100 rounded-xl shadow-lg z-50 w-56 py-1">
          {clinics.map((c) => (
            <div
              key={c}
              onClick={() => { setSelectedClinic(c); setShowClinicDropdown(false); }}
              className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-teal-50 transition-colors ${c === selectedClinic ? 'font-bold text-teal-700 bg-teal-50' : 'text-gray-700'}`}
            >
              {c}
            </div>
          ))}
        </div>
      )}

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="absolute top-[72px] right-4 bg-white border border-teal-100 rounded-xl shadow-lg z-50 w-72 p-4 space-y-3">
          <h4 className="font-bold text-sm text-gray-800">Notifications</h4>
          <div className="space-y-2">
            <div className="p-2.5 bg-teal-50 rounded-lg text-xs text-gray-700 font-medium">
              <span className="font-bold text-teal-700">Reminder:</span> Appointment with Dr. Sarah Jenkins at 2:45 PM
            </div>
            <div className="p-2.5 bg-blue-50 rounded-lg text-xs text-gray-700 font-medium">
              <span className="font-bold text-blue-700">Lab Result:</span> Your blood work results are ready
            </div>
            <div className="p-2.5 bg-gray-50 rounded-lg text-xs text-gray-700 font-medium">
              <span className="font-bold text-gray-500">System:</span> App updated to latest version
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24 bg-teal-50/30" onClick={() => { setShowClinicDropdown(false); setShowNotifications(false); }}>
        
        {/* Hero Section: AI Search */}
        <section className="bg-gradient-to-br from-teal-600 to-blue-700 rounded-3xl p-6 shadow-lg relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-[-20%] right-[-10%] w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-[-30%] left-[-20%] w-56 h-56 rounded-full bg-teal-400/20 blur-3xl"></div>
          
          <h2 className="text-2xl font-bold text-white mb-4 leading-tight relative z-10 drop-shadow-sm">How can we help<br />you today?</h2>
          <div 
            onClick={() => navigate('/search')}
            className="flex items-center gap-3 w-full bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-inner cursor-text transition-transform hover:scale-[1.02]"
          >
            <Search className="w-5 h-5 text-teal-600" />
            <span className="text-gray-500 text-sm font-medium line-clamp-1">Type your symptoms (e.g., sharp stomach pain & fever)...</span>
          </div>
        </section>

        {/* Quick Actions (Icon Grid) */}
        <section>
          <div className="grid grid-cols-4 gap-3">
            <ActionItem onClick={() => navigate('/queue')} icon={<Calendar className="text-blue-600" />} label="Book Appt" />
            <ActionItem onClick={() => navigate('/locker')} icon={<FolderHeart className="text-teal-600" />} label="Locker" />
            <ActionItem icon={<Users className="text-indigo-500" />} label="Family" />
            <ActionItem icon={<Pill className="text-emerald-500" />} label="Meds" />
          </div>
        </section>

        {/* Active Status Card */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              Active Queue Status
            </h3>
            <span onClick={() => navigate('/queue')} className="text-xs font-bold text-teal-600 cursor-pointer hover:underline">View All</span>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
            </div>
          ) : appointment && appointment.status !== "cancelled" && doctor ? (
            <div 
              onClick={() => navigate('/queue')}
              className="bg-white border border-teal-100 rounded-2xl p-4 shadow-md relative overflow-hidden cursor-pointer hover:shadow-lg hover:border-teal-200 transition-all group"
            >
              {/* Left accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-teal-400 to-blue-500 group-hover:w-2 transition-all"></div>
              
              <div className="flex justify-between items-start mb-3 pl-1.5">
                <div>
                  <span className="text-[10px] text-teal-600 font-bold uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded-full">Upcoming Appointment</span>
                  <h4 className="font-bold text-gray-900 mt-2 text-lg">{doctor.name}</h4>
                  <p className="text-xs font-medium text-gray-500">{doctor.specialty}</p>
                </div>
                
                {/* Live Status Tag */}
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-50 border border-orange-200 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                  <span className="text-[10px] font-bold text-orange-700">15 Min Delay</span>
                </div>
              </div>

              <div className="flex items-center gap-5 text-sm mt-4 pt-4 border-t border-gray-100 pl-1.5">
                <div className="flex items-center gap-2 font-semibold text-blue-900 bg-blue-50 px-3 py-1.5 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>{appointment.time}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <span className="text-xs truncate">{appointment.room}, {selectedClinic}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-sm text-center">
              <p className="text-gray-400 text-sm font-medium">No active appointments</p>
              <button onClick={() => navigate('/search')} className="mt-3 text-teal-600 font-bold text-sm hover:underline">
                Book an Appointment →
              </button>
            </div>
          )}
        </section>
        
        {/* Placeholder for more content to show scrolling */}
        <section className="opacity-70 pointer-events-none">
          <h3 className="font-bold text-gray-800 mb-3 text-sm mt-4">Recent Reports</h3>
          <div className="space-y-3">
            <div className="h-16 bg-white border border-teal-100/50 rounded-xl shadow-sm flex items-center px-4 gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                <div className="w-5 h-5 bg-teal-200 rounded"></div>
              </div>
              <div className="space-y-2 flex-1">
                <div className="h-3 w-32 bg-gray-200 rounded"></div>
                <div className="h-2 w-20 bg-gray-100 rounded"></div>
              </div>
            </div>
            <div className="h-16 bg-white border border-teal-100/50 rounded-xl shadow-sm flex items-center px-4 gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                <div className="w-5 h-5 bg-teal-200 rounded"></div>
              </div>
              <div className="space-y-2 flex-1">
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
                <div className="h-2 w-16 bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-teal-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex justify-around items-center pt-3 pb-safe-bottom min-h-[64px] z-40">
        <NavItem onClick={() => navigate('/')} icon={<Home />} label="Home" active />
        <NavItem onClick={() => navigate('/search')} icon={<Search />} label="Search" />
        <NavItem onClick={() => navigate('/locker')} icon={<BookOpen />} label="Locker" />
        <NavItem onClick={() => navigate('/clinic')} icon={<User />} label="Clinic" />
      </nav>
    </div>
  );
}

function ActionItem({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={onClick}>
      <div className="w-14 h-14 rounded-2xl bg-white border border-teal-100/60 shadow-sm flex items-center justify-center transition-all group-hover:bg-teal-50 group-hover:border-teal-200 group-hover:shadow-md group-active:scale-95">
        <div className="scale-110 group-hover:scale-125 transition-transform">
          {icon}
        </div>
      </div>
      <span className="text-[10px] text-gray-700 text-center font-bold leading-tight px-1 group-hover:text-teal-700 transition-colors">
        {label}
      </span>
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
