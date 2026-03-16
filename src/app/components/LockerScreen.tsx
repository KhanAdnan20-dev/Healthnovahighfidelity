import { ChevronLeft, Plus, FileText, Info, BarChart2, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { LineChart, Line, ResponsiveContainer, Tooltip as RechartsTooltip, YAxis } from 'recharts';
import { api, type MedicalRecord, type HbA1cReading } from "@/data/mockDatabase";

const FAMILY_MEMBERS = [
  { label: "Self", color: "bg-teal-100", text: "text-teal-700" },
  { label: "Mother", color: "bg-pink-100", text: "text-pink-700" },
  { label: "Father", color: "bg-blue-100", text: "text-blue-700" },
  { label: "Child", color: "bg-amber-100", text: "text-amber-700" },
];

export function LockerScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"my" | "family">("my");
  const [activeOwner, setActiveOwner] = useState("Self");
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [chartData, setChartData] = useState<HbA1cReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const owner = activeTab === "family" ? undefined : activeOwner;
    Promise.all([
      api.getMedicalRecords(owner),
      api.getHbA1cReadings(),
    ]).then(([recs, hba1c]) => {
      setRecords(recs);
      setChartData(hba1c);
      setLoading(false);
    });
  }, [activeTab, activeOwner]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;
    setIsUploading(true);
    await api.addMedicalRecord(uploadTitle.trim(), activeOwner);
    const updated = await api.getMedicalRecords(activeTab === "family" ? undefined : activeOwner);
    setRecords(updated);
    toast.success("Record uploaded successfully!");
    setUploadTitle("");
    setIsUploading(false);
    setShowUploadModal(false);
  };

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
        <h1 className="text-lg font-bold text-gray-900 flex-1">Digital Locker</h1>
      </header>

      {/* Top Tab Bar */}
      <div className="flex bg-white border-b border-teal-100 sticky top-[73px] z-10">
        <button
          onClick={() => { setActiveTab("my"); setActiveOwner("Self"); }}
          className={`flex-1 text-sm py-3 transition-colors ${activeTab === "my" ? "font-bold text-teal-700 border-b-2 border-teal-600" : "font-medium text-gray-400 hover:text-teal-600"}`}
        >
          My Records
        </button>
        <button
          onClick={() => setActiveTab("family")}
          className={`flex-1 text-sm py-3 transition-colors ${activeTab === "family" ? "font-bold text-teal-700 border-b-2 border-teal-600" : "font-medium text-gray-400 hover:text-teal-600"}`}
        >
          Family Members
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-0 relative pb-24">
        
        {/* Horizontal Scroll Avatars */}
        {activeTab === "my" && (
          <div className="flex overflow-x-auto gap-4 p-4 no-scrollbar border-b border-teal-100 bg-white/50">
            {FAMILY_MEMBERS.map((member) => (
              <AvatarItem
                key={member.label}
                active={activeOwner === member.label}
                label={member.label}
                color={member.color}
                text={member.text}
                onClick={() => setActiveOwner(member.label)}
              />
            ))}
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-4 space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
            </div>
          ) : (
            <>
              {/* Graph (only on My Records tab) */}
              {activeTab === "my" && activeOwner === "Self" && (
                <div className="bg-white border border-teal-100 rounded-2xl p-4 shadow-sm relative hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 text-gray-800">
                      <BarChart2 className="w-5 h-5 text-teal-600" />
                      <h3 className="font-bold text-base">HbA1c Levels Over Time</h3>
                    </div>
                    
                    {/* AI Tooltip Mock */}
                    <div className="relative group cursor-help">
                      <Info className="w-5 h-5 text-teal-400 hover:text-teal-600 transition-colors" />
                      <div className="absolute right-0 top-6 w-48 bg-teal-900 text-white text-[10px] p-2.5 rounded-lg shadow-lg invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-20 font-medium">
                        <span className="font-bold text-teal-300 uppercase tracking-wider text-[8px] block mb-1">AI Insight</span>
                        Consistent downward trend indicates excellent dietary adherence. Keep it up!
                      </div>
                    </div>
                  </div>

                  <div className="h-40 w-full ml-[-15px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
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
                          strokeWidth={4}
                          dot={{ fill: '#0d9488', r: 5, strokeWidth: 2, stroke: '#fff' }}
                          activeDot={{ r: 7, fill: '#0f766e', stroke: '#fff', strokeWidth: 2 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-400 font-bold mt-2 px-2">
                    <span>Jan</span>
                    <span>Mar</span>
                    <span>Jun</span>
                  </div>
                </div>
              )}

              {/* Recent Uploads List */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
                  {activeTab === "family" ? "All Family Records" : "Recent Uploads"}
                </h3>
                <div className="space-y-3">
                  {records.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-6">No records found</p>
                  ) : (
                    records.map((rec) => (
                      <UploadItem key={rec.id} title={rec.title} date={rec.date} />
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* FAB */}
        <button
          onClick={() => setShowUploadModal(true)}
          className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-200 flex items-center justify-center hover:from-teal-600 hover:to-teal-700 active:scale-95 transition-all z-20"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="absolute inset-0 bg-black/40 z-50 flex items-end justify-center">
          <div className="bg-white w-full rounded-t-3xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900">Upload Record</h3>
              <button onClick={() => setShowUploadModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1.5">Document Title</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g., Blood Test Report"
                  className="w-full border border-teal-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <button
                type="submit"
                disabled={isUploading || !uploadTitle.trim()}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading…
                  </>
                ) : (
                  "Upload Record"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AvatarItem({ label, active = false, color, text, onClick }: { label: string, active?: boolean, color?: string, text?: string, onClick?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group" onClick={onClick}>
      <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all group-hover:scale-105 ${active ? 'border-teal-500 bg-white shadow-sm' : 'border-transparent bg-gray-100'} ${color}`}>
        <span className={`text-lg font-bold ${text}`}>{label[0]}</span>
      </div>
      <span className={`text-[10px] uppercase tracking-wider ${active ? 'font-bold text-teal-700' : 'font-semibold text-gray-400 group-hover:text-gray-600'}`}>
        {label}
      </span>
    </div>
  );
}

function UploadItem({ title, date }: { title: string, date: string }) {
  return (
    <div className="bg-white border border-teal-100/60 p-3 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md hover:border-teal-200 cursor-pointer transition-all group">
      <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100 transition-colors">
        <FileText className="w-6 h-6 text-teal-600" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-sm text-gray-900 line-clamp-1 group-hover:text-teal-700 transition-colors">{title}</h4>
        <p className="text-xs text-gray-500 font-medium mt-0.5">{date}</p>
      </div>
    </div>
  );
}
