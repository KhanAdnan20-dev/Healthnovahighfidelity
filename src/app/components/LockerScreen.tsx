import { useState } from "react";
import { ChevronLeft, Plus, FileText, Info, BarChart2, CheckCircle2, Upload, Users } from "lucide-react";
import { useNavigate } from "react-router";
import { LineChart, Line, ResponsiveContainer, Tooltip as RechartsTooltip, YAxis } from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type LockerTab = "records" | "family";

type RecordPoint = {
  name: string;
  value: number;
};

type UploadRecord = {
  id: string;
  title: string;
  date: string;
  type: string;
  facility: string;
  summary: string;
};

type FamilyMember = {
  id: string;
  label: string;
  color: string;
  text: string;
  chartTitle: string;
  chartData: RecordPoint[];
  insight: string;
  status: string;
  uploads: UploadRecord[];
};

const familyMembers: FamilyMember[] = [
  {
    id: "self",
    label: "Self",
    color: "bg-teal-100",
    text: "text-teal-700",
    chartTitle: "HbA1c Levels Over Time",
    chartData: [
      { name: "Jan", value: 7.2 },
      { name: "Feb", value: 6.8 },
      { name: "Mar", value: 6.5 },
      { name: "Apr", value: 6.1 },
      { name: "May", value: 5.9 },
      { name: "Jun", value: 5.7 },
    ],
    insight: "Consistent downward trend indicates excellent dietary adherence. Keep current nutrition and exercise routines steady.",
    status: "4 records updated this year",
    uploads: [
      {
        id: "apollo-blood-report",
        title: "Apollo Blood Report",
        date: "Oct 24, 2023",
        type: "Lab Report",
        facility: "Apollo Diagnostics",
        summary: "Latest blood panel shows improved glucose management and no urgent abnormalities.",
      },
      {
        id: "thyroid-panel",
        title: "Thyroid Panel",
        date: "Sep 12, 2023",
        type: "Lab Report",
        facility: "HealthNova Labs",
        summary: "TSH and T4 are within the target range with no medication adjustment suggested.",
      },
      {
        id: "dermatology-prescription",
        title: "Dermatology Prescription",
        date: "Aug 05, 2023",
        type: "Prescription",
        facility: "CareSkin Clinic",
        summary: "Topical treatment plan renewed for six weeks with review advised if irritation persists.",
      },
      {
        id: "annual-physical-summary",
        title: "Annual Physical Summary",
        date: "Jan 10, 2023",
        type: "Visit Summary",
        facility: "Downtown Clinic",
        summary: "Preventive screening completed. Continue routine follow-up and repeat annual labs next quarter.",
      },
    ],
  },
  {
    id: "mother",
    label: "Mother",
    color: "bg-pink-100",
    text: "text-pink-700",
    chartTitle: "Blood Pressure Trend",
    chartData: [
      { name: "Jan", value: 142 },
      { name: "Feb", value: 138 },
      { name: "Mar", value: 136 },
      { name: "Apr", value: 132 },
      { name: "May", value: 130 },
      { name: "Jun", value: 128 },
    ],
    insight: "Blood pressure is improving steadily after the medication adjustment. Evening readings remain the best indicator to track.",
    status: "2 follow-ups due this month",
    uploads: [
      {
        id: "cardiology-review",
        title: "Cardiology Review",
        date: "Nov 02, 2023",
        type: "Specialist Review",
        facility: "HeartCare Center",
        summary: "Cardiologist recommended continued monitoring and sodium reduction for the next 8 weeks.",
      },
      {
        id: "medication-refill",
        title: "Medication Refill",
        date: "Oct 10, 2023",
        type: "Prescription",
        facility: "Downtown Pharmacy",
        summary: "Refill approved for antihypertensive regimen with same dosage maintained.",
      },
    ],
  },
  {
    id: "father",
    label: "Father",
    color: "bg-blue-100",
    text: "text-blue-700",
    chartTitle: "Cholesterol Trend",
    chartData: [
      { name: "Jan", value: 210 },
      { name: "Feb", value: 201 },
      { name: "Mar", value: 194 },
      { name: "Apr", value: 188 },
      { name: "May", value: 184 },
      { name: "Jun", value: 179 },
    ],
    insight: "LDL is trending in the right direction. Walking consistency appears to correlate well with better readings.",
    status: "1 screening recommended",
    uploads: [
      {
        id: "lipid-profile",
        title: "Lipid Profile",
        date: "Oct 18, 2023",
        type: "Lab Report",
        facility: "Apollo Diagnostics",
        summary: "Cholesterol levels improved since last quarter, though lifestyle monitoring should continue.",
      },
      {
        id: "ecg-summary",
        title: "ECG Summary",
        date: "Jul 26, 2023",
        type: "Diagnostic Test",
        facility: "Metro Heart Lab",
        summary: "No acute rhythm concerns found. Annual follow-up remains sufficient.",
      },
    ],
  },
  {
    id: "child",
    label: "Child",
    color: "bg-amber-100",
    text: "text-amber-700",
    chartTitle: "Vaccination Completion",
    chartData: [
      { name: "Jan", value: 40 },
      { name: "Feb", value: 52 },
      { name: "Mar", value: 60 },
      { name: "Apr", value: 74 },
      { name: "May", value: 84 },
      { name: "Jun", value: 92 },
    ],
    insight: "Vaccination schedule is nearly complete. One booster remains due before the next school health review.",
    status: "Booster due in 6 days",
    uploads: [
      {
        id: "immunization-card",
        title: "Immunization Card",
        date: "Nov 08, 2023",
        type: "Vaccination Record",
        facility: "Pediatric Center",
        summary: "All standard immunizations logged except the next booster in the routine schedule.",
      },
      {
        id: "school-fitness-note",
        title: "School Fitness Note",
        date: "Sep 01, 2023",
        type: "Medical Certificate",
        facility: "KidsCare Clinic",
        summary: "Cleared for school sports participation with no active restrictions.",
      },
    ],
  },
];

const uploadActions = [
  {
    id: "scan",
    title: "Scan a report",
    description: "Use your camera to digitize a printed prescription or lab report.",
  },
  {
    id: "upload",
    title: "Upload a PDF",
    description: "Add a document from your phone or cloud storage into the locker.",
  },
  {
    id: "share",
    title: "Request from clinic",
    description: "Ask your clinic to share the latest consultation summary directly.",
  },
];

export function LockerScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<LockerTab>("records");
  const [selectedMemberId, setSelectedMemberId] = useState("self");
  const [selectedUpload, setSelectedUpload] = useState<UploadRecord | null>(null);
  const [showInsight, setShowInsight] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const selectedMember =
    familyMembers.find((member) => member.id === selectedMemberId) ?? familyMembers[0];

  const chartData = selectedMember.chartData;
  const firstLabel = chartData[0]?.name ?? "";
  const middleLabel = chartData[Math.floor(chartData.length / 2)]?.name ?? "";
  const lastLabel = chartData[chartData.length - 1]?.name ?? "";

  const handleMemberSelect = (memberId: string) => {
    setSelectedMemberId(memberId);
    setShowInsight(false);
  };

  return (
    <div className="flex-1 bg-teal-50/30 flex flex-col h-full relative">
      <header className="flex items-center gap-4 p-4 border-b border-teal-100 bg-white sticky top-0 z-10 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-teal-50 active:bg-teal-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-teal-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 flex-1">Digital Locker</h1>
      </header>

      <div className="flex bg-white border-b border-teal-100 sticky top-[73px] z-10">
        <TabButton
          active={activeTab === "records"}
          label="My Records"
          onClick={() => setActiveTab("records")}
        />
        <TabButton
          active={activeTab === "family"}
          label="Family Members"
          onClick={() => setActiveTab("family")}
        />
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-0 relative pb-24">
        <div className="flex overflow-x-auto gap-4 p-4 no-scrollbar border-b border-teal-100 bg-white/50">
          {familyMembers.map((member) => (
            <AvatarItem
              key={member.id}
              active={selectedMember.id === member.id}
              label={member.label}
              color={member.color}
              text={member.text}
              onClick={() => handleMemberSelect(member.id)}
            />
          ))}
        </div>

        <div className="p-4 space-y-6">
          {activeTab === "family" && (
            <section className="bg-white border border-teal-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-gray-800">
                    <Users className="w-4 h-4 text-teal-600" />
                    <h3 className="font-bold text-base">Family Overview</h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Select a member to switch charts, uploads, and care reminders.
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-1 rounded-full">
                  {selectedMember.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                {familyMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => handleMemberSelect(member.id)}
                    className={`rounded-2xl border p-3 text-left transition-all ${
                      selectedMember.id === member.id
                        ? "border-teal-300 bg-teal-50 shadow-sm"
                        : "border-teal-100 bg-white hover:border-teal-200 hover:bg-teal-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${member.color} ${member.text}`}
                      >
                        {member.label[0]}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-900">{member.label}</p>
                        <p className="text-xs text-gray-500">{member.uploads.length} documents</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          <div className="bg-white border border-teal-100 rounded-2xl p-4 shadow-sm relative hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4 gap-3">
              <div className="flex items-center gap-2 text-gray-800">
                <BarChart2 className="w-5 h-5 text-teal-600" />
                <div>
                  <h3 className="font-bold text-base">{selectedMember.chartTitle}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{selectedMember.label}'s trend snapshot</p>
                </div>
              </div>

              <button
                onClick={() => setShowInsight((current) => !current)}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors ${
                  showInsight
                    ? "border-teal-200 bg-teal-50 text-teal-700"
                    : "border-transparent text-teal-400 hover:text-teal-600 hover:bg-teal-50"
                }`}
                aria-label="Toggle AI insight"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>

            {showInsight && (
              <div className="mb-4 rounded-2xl bg-teal-900 text-white p-3 shadow-lg">
                <span className="font-bold text-teal-300 uppercase tracking-wider text-[10px] block mb-1">
                  AI Insight
                </span>
                <p className="text-xs font-medium leading-relaxed">{selectedMember.insight}</p>
              </div>
            )}

            <div className="h-40 w-full ml-[-15px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <YAxis domain={["dataMin - 0.5", "dataMax + 0.5"]} hide />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #ccfbf1",
                      fontSize: "12px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    labelStyle={{ color: "#0d9488", fontWeight: "bold" }}
                    itemStyle={{ color: "#134e4a", fontWeight: "bold" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0d9488"
                    strokeWidth={4}
                    dot={{ fill: "#0d9488", r: 5, strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 7, fill: "#0f766e", stroke: "#fff", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-between text-xs text-gray-400 font-bold mt-2 px-2">
              <span>{firstLabel}</span>
              <span>{middleLabel}</span>
              <span>{lastLabel}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="font-bold text-gray-800 text-sm">Recent Uploads</h3>
              <button
                onClick={() => setShowAddDialog(true)}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 transition-colors"
              >
                Add New
              </button>
            </div>
            <div className="space-y-3">
              {selectedMember.uploads.map((upload) => (
                <UploadItem
                  key={upload.id}
                  title={upload.title}
                  date={upload.date}
                  type={upload.type}
                  onClick={() => setSelectedUpload(upload)}
                />
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAddDialog(true)}
          className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-200 flex items-center justify-center hover:from-teal-600 hover:to-teal-700 active:scale-95 transition-all z-20"
          aria-label="Add new record"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <Dialog open={Boolean(selectedUpload)} onOpenChange={(open) => !open && setSelectedUpload(null)}>
        <DialogContent className="max-w-md rounded-3xl border-teal-100 p-0 overflow-hidden">
          {selectedUpload && (
            <>
              <div className="bg-gradient-to-r from-teal-600 to-blue-700 p-5 text-white">
                <DialogHeader className="text-left">
                  <DialogTitle className="text-xl">{selectedUpload.title}</DialogTitle>
                  <DialogDescription className="text-white/80">
                    {selectedMember.label} | {selectedUpload.date}
                  </DialogDescription>
                </DialogHeader>
              </div>
              <div className="p-5 space-y-4">
                <DetailRow label="Document Type" value={selectedUpload.type} />
                <DetailRow label="Uploaded From" value={selectedUpload.facility} />
                <DetailRow label="Summary" value={selectedUpload.summary} />
                <DialogFooter className="sm:justify-start">
                  <button
                    onClick={() => setSelectedUpload(null)}
                    className="w-full rounded-xl bg-teal-600 py-3 text-sm font-bold text-white hover:bg-teal-700 transition-colors"
                  >
                    Close Preview
                  </button>
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md rounded-3xl border-teal-100 p-0 overflow-hidden">
          <div className="bg-teal-50 border-b border-teal-100 p-5">
            <DialogHeader className="text-left">
              <DialogTitle className="text-xl text-gray-900">Add To Locker</DialogTitle>
              <DialogDescription className="text-gray-600">
                Choose how you want to add a new health record for {selectedMember.label.toLowerCase()}.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-5 space-y-3">
            {uploadActions.map((action) => (
              <button
                key={action.id}
                onClick={() => setShowAddDialog(false)}
                className="w-full rounded-2xl border border-teal-100 bg-white p-4 text-left hover:border-teal-200 hover:bg-teal-50/60 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 flex-shrink-0">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{action.title}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{action.description}</p>
                  </div>
                </div>
              </button>
            ))}
            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-900 font-medium leading-relaxed">
                This prototype now supports the full add-record interaction path, even though it does not persist files yet.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 text-sm py-3 transition-colors ${
        active
          ? "font-bold text-teal-700 border-b-2 border-teal-600"
          : "font-medium text-gray-400 hover:text-teal-600"
      }`}
    >
      {label}
    </button>
  );
}

function AvatarItem({
  label,
  active = false,
  color,
  text,
  onClick,
}: {
  label: string;
  active?: boolean;
  color?: string;
  text?: string;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all group-hover:scale-105 ${
          active ? "border-teal-500 bg-white shadow-sm" : "border-transparent bg-gray-100"
        } ${color}`}
      >
        <span className={`text-lg font-bold ${text}`}>{label[0]}</span>
      </div>
      <span
        className={`text-[10px] uppercase tracking-wider ${
          active ? "font-bold text-teal-700" : "font-semibold text-gray-400 group-hover:text-gray-600"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

function UploadItem({
  title,
  date,
  type,
  onClick,
}: {
  title: string;
  date: string;
  type: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white border border-teal-100/60 p-3 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md hover:border-teal-200 cursor-pointer transition-all group text-left"
    >
      <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100 transition-colors">
        <FileText className="w-6 h-6 text-teal-600" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm text-gray-900 line-clamp-1 group-hover:text-teal-700 transition-colors">
          {title}
        </h4>
        <p className="text-xs text-gray-500 font-medium mt-0.5">{date}</p>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-1 rounded-full">
        {type}
      </span>
    </button>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-900 leading-relaxed">{value}</p>
    </div>
  );
}
