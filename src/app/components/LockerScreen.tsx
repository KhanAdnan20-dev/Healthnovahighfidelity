import { ChevronLeft, Plus, FileText, Info, BarChart2 } from "lucide-react";
import { useNavigate } from "react-router";
import { LineChart, Line, ResponsiveContainer, Tooltip as RechartsTooltip, YAxis } from 'recharts';

const dummyData = [
  { name: 'Jan', value: 7.2 },
  { name: 'Feb', value: 6.8 },
  { name: 'Mar', value: 6.5 },
  { name: 'Apr', value: 6.1 },
  { name: 'May', value: 5.9 },
  { name: 'Jun', value: 5.7 }
];

export function LockerScreen() {
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
        <h1 className="text-base sm:text-lg font-bold text-gray-900 flex-1 truncate">Digital Locker</h1>
      </header>

      {/* Top Tab Bar */}
      <div className="flex bg-white border-b border-teal-100 sticky top-[49px] sm:top-[57px] z-10">
        <button className="flex-1 text-sm font-bold text-teal-700 border-b-2 border-teal-600 py-2.5 sm:py-3 min-h-[40px] active:bg-teal-50 transition-colors">
          My Records
        </button>
        <button className="flex-1 text-sm font-medium text-gray-400 py-2.5 sm:py-3 min-h-[40px] hover:text-teal-600 active:bg-gray-50 transition-colors">
          Family Members
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-0 relative pb-20 sm:pb-24">
        
        {/* Horizontal Scroll Avatars */}
        <div className="flex overflow-x-auto gap-3 sm:gap-4 p-3 sm:p-4 no-scrollbar border-b border-teal-100 bg-white/50">
          <AvatarItem active label="Self" color="bg-teal-100" text="text-teal-700" />
          <AvatarItem label="Mother" color="bg-pink-100" text="text-pink-700" />
          <AvatarItem label="Father" color="bg-blue-100" text="text-blue-700" />
          <AvatarItem label="Child" color="bg-amber-100" text="text-amber-700" />
        </div>

        {/* Main Content Area: Graph */}
        <div className="p-3 sm:p-4 space-y-5 sm:space-y-6">
          <div className="bg-white border border-teal-100 rounded-2xl p-3 sm:p-4 shadow-sm relative hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
              <div className="flex items-center gap-2 text-gray-800 min-w-0">
                <BarChart2 className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <h3 className="font-bold text-sm sm:text-base truncate">HbA1c Levels Over Time</h3>
              </div>
              
              {/* AI Tooltip Mock */}
              <div className="relative group cursor-help flex-shrink-0">
                <Info className="w-5 h-5 text-teal-400 hover:text-teal-600 transition-colors" />
                <div className="absolute right-0 top-6 w-44 sm:w-48 bg-teal-900 text-white text-[10px] p-2.5 rounded-lg shadow-lg invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-20 font-medium">
                  <span className="font-bold text-teal-300 uppercase tracking-wider text-[8px] block mb-1">AI Insight</span>
                  Consistent downward trend indicates excellent dietary adherence. Keep it up!
                </div>
              </div>
            </div>

            <div className="h-36 sm:h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dummyData} margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
                  <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} hide />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #ccfbf1', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    labelStyle={{ color: '#0d9488', fontWeight: 'bold' }}
                    itemStyle={{ color: '#134e4a', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0d9488" 
                    strokeWidth={3}
                    dot={{ fill: '#0d9488', r: 4, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, fill: '#0f766e', stroke: '#fff', strokeWidth: 2 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-between text-xs text-gray-400 font-bold mt-2 px-1 sm:px-2">
              <span>Jan</span>
              <span>Mar</span>
              <span>Jun</span>
            </div>
          </div>

          {/* Recent Uploads List */}
          <div>
            <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
              Recent Uploads
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <UploadItem title="Apollo Blood Report" date="Oct 24, 2023" />
              <UploadItem title="Thyroid Panel" date="Sep 12, 2023" />
              <UploadItem title="Dermatology Prescription" date="Aug 05, 2023" />
              <UploadItem title="Annual Physical Summary" date="Jan 10, 2023" />
            </div>
          </div>
        </div>

        {/* FAB */}
        <button className="fixed bottom-5 right-5 sm:absolute sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-200 flex items-center justify-center hover:from-teal-600 hover:to-teal-700 active:scale-95 transition-all z-20 min-w-[44px] min-h-[44px]">
          <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
}

function AvatarItem({ label, active = false, color, text }: { label: string, active?: boolean, color?: string, text?: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border-2 transition-all group-hover:scale-105 group-active:scale-95 ${active ? 'border-teal-500 bg-white shadow-sm' : 'border-transparent bg-gray-100'} ${color}`}>
        <span className={`text-base sm:text-lg font-bold ${text}`}>{label[0]}</span>
      </div>
      <span className={`text-[10px] uppercase tracking-wider ${active ? 'font-bold text-teal-700' : 'font-semibold text-gray-400 group-hover:text-gray-600'}`}>
        {label}
      </span>
    </div>
  );
}

function UploadItem({ title, date }: { title: string, date: string }) {
  return (
    <div className="bg-white border border-teal-100/60 p-2.5 sm:p-3 rounded-2xl flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:border-teal-200 cursor-pointer transition-all group active:scale-[0.99] min-h-[44px]">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100 transition-colors">
        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm text-gray-900 line-clamp-1 group-hover:text-teal-700 transition-colors">{title}</h4>
        <p className="text-xs text-gray-500 font-medium mt-0.5">{date}</p>
      </div>
    </div>
  );
}
