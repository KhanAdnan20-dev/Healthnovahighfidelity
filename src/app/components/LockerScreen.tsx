import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Plus, FileText, Info, BarChart2, CheckCircle2, Upload, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { LineChart, Line, ResponsiveContainer, Tooltip as RechartsTooltip, YAxis } from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type LockerTab = "records" | "family" | "doctor-emergency";

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

type SecureVaultType = "important" | "semi-private";

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
  {
    id: "emergency",
    title: "Upload emergency report",
    description: "Add urgent MRI, oncology, trauma, or ICU documents with detailed context.",
  },
];

const secureVaultLabels: Record<SecureVaultType, string> = {
  important: "Important Reports",
  "semi-private": "Semi-Private Reports",
};

const initialSecureUploads: Record<SecureVaultType, UploadRecord[]> = {
  important: [
    {
      id: "mri-brain-2024",
      title: "MRI Brain Screening",
      date: "Feb 19, 2024",
      type: "MRI",
      facility: "Neuro Imaging Center",
      summary: "High-priority neuro scan shared under protected access for specialist review.",
    },
    {
      id: "oncology-histopath",
      title: "Oncology Histopathology",
      date: "Jan 08, 2024",
      type: "Cancer Workup",
      facility: "Regional Oncology Unit",
      summary: "Biopsy and pathology findings requiring controlled doctor-only access.",
    },
  ],
  "semi-private": [
    {
      id: "cardiac-ct",
      title: "Cardiac CT Follow-up",
      date: "Dec 15, 2023",
      type: "CT Scan",
      facility: "Metro Heart Lab",
      summary: "Semi-private imaging data restricted to verified providers.",
    },
  ],
};

export function LockerScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<LockerTab>("records");
  const [selectedMemberId, setSelectedMemberId] = useState("self");
  const [selectedUpload, setSelectedUpload] = useState<UploadRecord | null>(null);
  const [selectedUploadOwnerLabel, setSelectedUploadOwnerLabel] = useState("Self");
  const [showInsight, setShowInsight] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [uploadsByMember, setUploadsByMember] = useState<Record<string, UploadRecord[]>>(
    Object.fromEntries(familyMembers.map((member) => [member.id, member.uploads])) as Record<
      string,
      UploadRecord[]
    >,
  );
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [secureVaultType, setSecureVaultType] = useState<SecureVaultType>("important");
  const [secureUploads, setSecureUploads] =
    useState<Record<SecureVaultType, UploadRecord[]>>(initialSecureUploads);
  const [verifiedVaults, setVerifiedVaults] = useState<Record<SecureVaultType, boolean>>({
    important: false,
    "semi-private": false,
  });
  const [pendingVaultVerification, setPendingVaultVerification] =
    useState<SecureVaultType>("important");
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [openEmergencyAfterVerification, setOpenEmergencyAfterVerification] = useState(false);
  const [doctorId, setDoctorId] = useState("");
  const [doctorCode, setDoctorCode] = useState("");
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [emergencyTitle, setEmergencyTitle] = useState("");
  const [emergencyCondition, setEmergencyCondition] = useState("");
  const [emergencyUrgency, setEmergencyUrgency] = useState("Critical");
  const [emergencyHospital, setEmergencyHospital] = useState("");
  const [emergencySummary, setEmergencySummary] = useState("");
  const [emergencyAttachmentName, setEmergencyAttachmentName] = useState("");
  const [emergencyReports, setEmergencyReports] = useState<UploadRecord[]>([]);
  const [lastSavedEmergency, setLastSavedEmergency] = useState<UploadRecord | null>(null);
  const [isSavingEmergency, setIsSavingEmergency] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emergencyFileInputRef = useRef<HTMLInputElement>(null);

  const selectedMemberBase =
    familyMembers.find((member) => member.id === selectedMemberId) ?? familyMembers[0];
  const selectedMember = {
    ...selectedMemberBase,
    uploads: uploadsByMember[selectedMemberBase.id] ?? [],
  };

  const chartData = selectedMember.chartData;
  const firstLabel = chartData[0]?.name ?? "";
  const middleLabel = chartData[Math.floor(chartData.length / 2)]?.name ?? "";
  const lastLabel = chartData[chartData.length - 1]?.name ?? "";

  const handleMemberSelect = (memberId: string) => {
    setSelectedMemberId(memberId);
    setShowInsight(false);
    setUploadError(null);
    setUploadFeedback(null);
  };

  const requestSecureAccess = (vaultType: SecureVaultType) => {
    setSecureVaultType(vaultType);

    if (verifiedVaults[vaultType]) {
      return;
    }

    setPendingVaultVerification(vaultType);
    setDoctorId("");
    setDoctorCode("");
    setVerifyError(null);
    setShowVerifyDialog(true);
  };

  const verifyDoctorAccess = () => {
    const hasDoctorId = doctorId.trim().length > 0;
    const hasAccessCode = doctorCode.trim().length > 0;

    if (!hasDoctorId || !hasAccessCode) {
      setVerifyError("Enter doctor identity and access code to continue.");
      return;
    }

    setVerifiedVaults({ important: true, "semi-private": true });
    setSecureVaultType(pendingVaultVerification);
    setShowVerifyDialog(false);
    setVerifyError(null);
    setUploadFeedback("Doctor verification successful. Emergency options are now unlocked.");

    if (pendingVaultVerification === "important" && openEmergencyAfterVerification) {
      setShowEmergencyDialog(true);
      setShowAddDialog(false);
    }

    setOpenEmergencyAfterVerification(false);
  };

  const openEmergencyFlow = () => {
    setSecureVaultType("important");
    setUploadError(null);

    if (verifiedVaults.important) {
      setShowEmergencyDialog(true);
      return;
    }

    setPendingVaultVerification("important");
    setDoctorId("");
    setDoctorCode("");
    setVerifyError(null);
    setOpenEmergencyAfterVerification(true);
    setShowVerifyDialog(true);
  };

  const openPdfPicker = () => {
    setUploadError(null);
    fileInputRef.current?.click();
  };

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setUploadError("Only PDF files are allowed.");
      setUploadFeedback(null);
      event.target.value = "";
      return;
    }

    const recordId = `upload-${Date.now()}`;
    const cleanTitle = file.name.replace(/\.pdf$/i, "").trim() || "Uploaded Report";
    const sizeMb = file.size / (1024 * 1024);
    const newRecord: UploadRecord = {
      id: recordId,
      title: cleanTitle,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      type: "PDF Report",
      facility: "Manual Upload",
      summary: `${file.name} uploaded from device (${sizeMb.toFixed(2)} MB).`,
    };

    setUploadsByMember((current) => ({
      ...current,
      [selectedMemberBase.id]: [newRecord, ...(current[selectedMemberBase.id] ?? [])],
    }));
    setSelectedUploadOwnerLabel(selectedMember.label);
    setSelectedUpload(newRecord);
    setShowAddDialog(false);
    setUploadError(null);
    setUploadFeedback(`Uploaded ${file.name}`);
    event.target.value = "";
  };

  const handleEmergencyAttachmentSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setUploadError("Emergency attachment must be a PDF file.");
      event.target.value = "";
      return;
    }

    setUploadError(null);
    setEmergencyAttachmentName(file.name);
    event.target.value = "";
  };

  const submitEmergencyReport = () => {
    const title = emergencyTitle.trim();
    const condition = emergencyCondition.trim();
    const hospital = emergencyHospital.trim();
    const summary = emergencySummary.trim();

    if (!title || !condition || !hospital || !summary) {
      setUploadError("Fill all emergency report details before submitting.");
      return;
    }

    if (isSavingEmergency) {
      return;
    }

    setIsSavingEmergency(true);

    const emergencyRecord: UploadRecord = {
      id: `emergency-${Date.now()}`,
      title,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      type: `Emergency | ${emergencyUrgency}`,
      facility: hospital,
      summary: `${condition}. ${summary}${
        emergencyAttachmentName ? ` Attachment: ${emergencyAttachmentName}.` : ""
      }`,
    };
    const shortDescription = buildShortDescription(emergencyRecord.summary);

    setSecureUploads((current) => ({
      ...current,
      important: [emergencyRecord, ...current.important],
    }));
    setEmergencyReports((current) => [emergencyRecord, ...current]);
    setLastSavedEmergency(emergencyRecord);
    setVerifiedVaults((current) => ({ ...current, important: true }));
    setSecureVaultType("important");
    setSelectedUploadOwnerLabel("Important Reports Vault");
    setSelectedUpload(emergencyRecord);
    setUploadFeedback(`Emergency report saved: ${shortDescription}`);
    setUploadError(null);
    setEmergencyTitle("");
    setEmergencyCondition("");
    setEmergencyUrgency("Critical");
    setEmergencyHospital("");
    setEmergencySummary("");
    setEmergencyAttachmentName("");
    setShowEmergencyDialog(false);
    setShowAddDialog(false);
    setIsSavingEmergency(false);
  };

  const isEmergencyFormValid =
    emergencyTitle.trim().length > 0 &&
    emergencyCondition.trim().length > 0 &&
    emergencyHospital.trim().length > 0 &&
    emergencySummary.trim().length > 0;

  useEffect(() => {
    const requestedTab = new URLSearchParams(location.search).get("tab");

    if (requestedTab === "records" || requestedTab === "family" || requestedTab === "doctor-emergency") {
      setActiveTab(requestedTab);
    }
  }, [location.search]);

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
        <TabButton
          active={activeTab === "doctor-emergency"}
          label="Doctor Emergency"
          onClick={() => setActiveTab("doctor-emergency")}
        />
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-0 relative pb-24">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={handlePdfUpload}
        />
        <input
          ref={emergencyFileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={handleEmergencyAttachmentSelect}
        />

        {activeTab !== "doctor-emergency" && (
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
        )}

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

          {activeTab !== "doctor-emergency" && (
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
          )}

          {activeTab === "doctor-emergency" && (
            <section className="bg-white border border-teal-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Step 1: Doctor Verification</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Verify once, then unlock emergency actions and protected vault options.
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                  Doctor-only access
                </span>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 mb-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-1">
                  Verification Status
                </p>
                <p className="text-xs text-amber-900 font-semibold">
                  {verifiedVaults.important
                    ? "Verified. Step 2 actions are now available."
                    : "Pending. Complete verification to continue to Step 2."}
                </p>
                {!verifiedVaults.important && (
                  <button
                    onClick={() => requestSecureAccess("important")}
                    className="mt-2 rounded-lg bg-amber-600 px-3 py-2 text-xs font-bold text-white hover:bg-amber-700"
                  >
                    Verify Doctor Credentials
                  </button>
                )}
              </div>

              {verifiedVaults.important && (
                <>
                  <div className="pt-2 border-t border-teal-100">
                    <h4 className="text-sm font-bold text-gray-900 mb-2">Step 2: Choose Protected Vault</h4>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <button
                        onClick={() => setSecureVaultType("important")}
                        className={`rounded-xl border p-2.5 text-left transition-colors ${
                          secureVaultType === "important"
                            ? "border-teal-300 bg-teal-50"
                            : "border-teal-100 hover:border-teal-200"
                        }`}
                      >
                        <p className="text-xs font-bold text-gray-900">Important Reports</p>
                        <p className="text-[11px] text-gray-500 mt-1">MRI, oncology, critical scans</p>
                      </button>
                      <button
                        onClick={() => setSecureVaultType("semi-private")}
                        className={`rounded-xl border p-2.5 text-left transition-colors ${
                          secureVaultType === "semi-private"
                            ? "border-teal-300 bg-teal-50"
                            : "border-teal-100 hover:border-teal-200"
                        }`}
                      >
                        <p className="text-xs font-bold text-gray-900">Semi-Private Reports</p>
                        <p className="text-[11px] text-gray-500 mt-1">Follow-up diagnostics, specialty notes</p>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {(secureUploads[secureVaultType] ?? []).map((record) => (
                      <UploadItem
                        key={record.id}
                        title={record.title}
                        date={record.date}
                        type={record.type}
                        onClick={() => {
                          setSelectedUploadOwnerLabel(secureVaultLabels[secureVaultType]);
                          setSelectedUpload(record);
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </section>
          )}

          {activeTab === "doctor-emergency" && (
            <section className="bg-red-50/80 border-2 border-red-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-bold text-red-900 text-sm">Emergency Report Center</h3>
                  <p className="text-xs text-red-800 mt-1">
                    Separate high-priority area for emergency-oriented reports with short care summaries.
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-white px-2 py-1 rounded-full border border-red-200">
                  Critical Boundary
                </span>
              </div>

              <div className="rounded-xl border border-red-200 bg-white p-3 mb-3">
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 mb-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-1">
                    Doctor Verification Status
                  </p>
                  <p className="text-xs text-amber-900 font-semibold">
                    {verifiedVaults.important
                      ? "Verified doctor access active. You can now save emergency reports."
                      : "Locked: doctor verification required before adding emergency reports."}
                  </p>
                </div>
                <p className="text-[11px] font-bold text-red-700 uppercase tracking-wider mb-1">
                  Saved Emergency Reports ({emergencyReports.length})
                </p>
                {lastSavedEmergency && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 mb-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-1">
                      Recently Saved
                    </p>
                    <p className="text-xs font-bold text-gray-900 line-clamp-1">{lastSavedEmergency.title}</p>
                    <p className="text-[11px] text-emerald-900 mt-1 line-clamp-2">
                      {buildShortDescription(lastSavedEmergency.summary)}
                    </p>
                    <p className="text-[11px] text-gray-600 mt-1">
                      {lastSavedEmergency.type} | {lastSavedEmergency.facility}
                    </p>
                  </div>
                )}
                {emergencyReports.length === 0 ? (
                  <p className="text-xs text-gray-600">
                    No emergency reports saved yet. Add one to create a rapid-access emergency file.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {emergencyReports.map((report) => (
                      <button
                        key={report.id}
                        onClick={() => {
                          setSelectedUploadOwnerLabel("Emergency Report Center");
                          setSelectedUpload(report);
                        }}
                        className="w-full text-left rounded-xl border border-red-100 bg-red-50/40 p-2.5 hover:bg-red-50"
                      >
                        <p className="text-xs font-bold text-gray-900 line-clamp-1">{report.title}</p>
                        <p className="text-[11px] text-red-800 mt-1 line-clamp-2">
                          {buildShortDescription(report.summary)}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={openEmergencyFlow}
                className={`w-full rounded-xl py-2.5 text-sm font-bold text-white ${
                  verifiedVaults.important ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700"
                }`}
              >
                {verifiedVaults.important ? "Save Emergency Report" : "Verify Doctor to Save Emergency Report"}
              </button>
            </section>
          )}

          {activeTab !== "doctor-emergency" && (
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
            {uploadFeedback && (
              <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 mb-3">
                {uploadFeedback}
              </p>
            )}
            {uploadError && (
              <p className="text-xs font-semibold text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3">
                {uploadError}
              </p>
            )}
            <div className="space-y-3">
              {selectedMember.uploads.map((upload) => (
                <UploadItem
                  key={upload.id}
                  title={upload.title}
                  date={upload.date}
                  type={upload.type}
                  onClick={() => {
                    setSelectedUploadOwnerLabel(selectedMember.label);
                    setSelectedUpload(upload);
                  }}
                />
              ))}
            </div>
          </div>
          )}
        </div>

        {activeTab !== "doctor-emergency" && (
          <button
            onClick={() => setShowAddDialog(true)}
            className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-200 flex items-center justify-center hover:from-teal-600 hover:to-teal-700 active:scale-95 transition-all z-20"
            aria-label="Add new record"
          >
            <Plus className="w-6 h-6" />
          </button>
        )}
      </div>

      <Dialog open={Boolean(selectedUpload)} onOpenChange={(open) => !open && setSelectedUpload(null)}>
        <DialogContent className="max-w-md rounded-3xl border-teal-100 p-0 overflow-hidden">
          {selectedUpload && (
            <>
              <div className="bg-gradient-to-r from-teal-600 to-blue-700 p-5 text-white">
                <DialogHeader className="text-left">
                  <DialogTitle className="text-xl">{selectedUpload.title}</DialogTitle>
                  <DialogDescription className="text-white/80">
                    {selectedUploadOwnerLabel} | {selectedUpload.date}
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
                onClick={() => {
                  if (action.id === "upload") {
                    openPdfPicker();
                    return;
                  }
                  if (action.id === "emergency") {
                    openEmergencyFlow();
                    return;
                  }
                  setShowAddDialog(false);
                }}
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
                Upload a PDF report to instantly place it in Recent Uploads for the selected member.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showVerifyDialog}
        onOpenChange={(open) => {
          setShowVerifyDialog(open);
          if (!open) {
            setOpenEmergencyAfterVerification(false);
          }
        }}
      >
        <DialogContent className="max-w-md rounded-3xl border-teal-100 p-0 overflow-hidden">
          <div className="bg-amber-50 border-b border-amber-100 p-5">
            <DialogHeader className="text-left">
              <DialogTitle className="text-xl text-gray-900">Doctor Verification Required</DialogTitle>
              <DialogDescription className="text-gray-700">
                Enter dummy credentials to unlock {secureVaultLabels[pendingVaultVerification]}.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-5 space-y-3">
            <input
              value={doctorId}
              onChange={(event) => setDoctorId(event.target.value)}
              placeholder="Doctor ID (e.g., DR-1234)"
              className="w-full rounded-xl border border-teal-100 px-3 py-2 text-sm outline-none focus:border-teal-300"
            />
            <input
              value={doctorCode}
              onChange={(event) => setDoctorCode(event.target.value)}
              placeholder="Access Code"
              type="password"
              className="w-full rounded-xl border border-teal-100 px-3 py-2 text-sm outline-none focus:border-teal-300"
            />
            {verifyError && (
              <p className="text-xs font-semibold text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {verifyError}
              </p>
            )}
            <button
              onClick={verifyDoctorAccess}
              className="w-full rounded-xl bg-amber-600 py-2.5 text-sm font-bold text-white hover:bg-amber-700"
            >
              Verify and Unlock
            </button>
            <p className="text-[11px] text-gray-500">
              Dummy method: enter any doctor identity and any non-empty access code.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
        <DialogContent className="max-w-md rounded-3xl border-teal-100 p-0 overflow-hidden">
          <div className="bg-red-50 border-b border-red-100 p-5">
            <DialogHeader className="text-left">
              <DialogTitle className="text-xl text-gray-900">Emergency-Oriented Report</DialogTitle>
              <DialogDescription className="text-gray-700">
                Capture urgent details for MRI, cancer care, trauma, or ICU handoff.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-5 space-y-3">
            <input
              value={emergencyTitle}
              onChange={(event) => {
                setEmergencyTitle(event.target.value);
                if (uploadError) {
                  setUploadError(null);
                }
              }}
              placeholder="Report title (e.g., MRI Stroke Emergency)"
              className="w-full rounded-xl border border-teal-100 px-3 py-2 text-sm outline-none focus:border-teal-300"
            />
            <input
              value={emergencyCondition}
              onChange={(event) => {
                setEmergencyCondition(event.target.value);
                if (uploadError) {
                  setUploadError(null);
                }
              }}
              placeholder="Primary condition"
              className="w-full rounded-xl border border-teal-100 px-3 py-2 text-sm outline-none focus:border-teal-300"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={emergencyUrgency}
                onChange={(event) => setEmergencyUrgency(event.target.value)}
                className="rounded-xl border border-teal-100 px-3 py-2 text-sm outline-none focus:border-teal-300"
              >
                <option>Critical</option>
                <option>High</option>
                <option>Moderate</option>
              </select>
              <input
                value={emergencyHospital}
                onChange={(event) => {
                  setEmergencyHospital(event.target.value);
                  if (uploadError) {
                    setUploadError(null);
                  }
                }}
                placeholder="Hospital / Facility"
                className="rounded-xl border border-teal-100 px-3 py-2 text-sm outline-none focus:border-teal-300"
              />
            </div>
            <textarea
              value={emergencySummary}
              onChange={(event) => {
                setEmergencySummary(event.target.value);
                if (uploadError) {
                  setUploadError(null);
                }
              }}
              placeholder="Detailed emergency notes: vitals, diagnosis summary, immediate care instructions, escalation path"
              className="w-full min-h-24 rounded-xl border border-teal-100 px-3 py-2 text-sm outline-none focus:border-teal-300 resize-none"
            />
            <div className="rounded-xl border border-red-100 bg-red-50/60 p-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-red-700 mb-1">
                Save Preview
              </p>
              <p className="text-xs font-semibold text-gray-900 line-clamp-1">
                {emergencyTitle.trim() || "Untitled Emergency Report"}
              </p>
              <p className="text-[11px] text-red-900 mt-1 line-clamp-2">
                {buildShortDescription(emergencySummary.trim() || "Summary will appear here after you type details.")}
              </p>
              <p className="text-[11px] text-gray-600 mt-1">
                {emergencyUrgency} | {emergencyHospital.trim() || "Facility pending"}
              </p>
            </div>
            <div className="rounded-xl border border-dashed border-red-200 bg-red-50/50 p-3">
              <button
                onClick={() => emergencyFileInputRef.current?.click()}
                className="w-full rounded-lg bg-white border border-red-100 py-2 text-xs font-bold text-red-700 hover:bg-red-50"
              >
                Attach Emergency PDF
              </button>
              {emergencyAttachmentName && (
                <p className="text-xs text-red-700 mt-2 font-semibold">Attached: {emergencyAttachmentName}</p>
              )}
            </div>
            {uploadError && (
              <p className="text-xs font-semibold text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {uploadError}
              </p>
            )}
            <button
              onClick={submitEmergencyReport}
              disabled={isSavingEmergency || !isEmergencyFormValid}
              className="w-full rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSavingEmergency ? "Saving Emergency Report..." : "Save Emergency Report"}
            </button>
            {!isEmergencyFormValid && (
              <p className="text-[11px] text-gray-500 text-center">
                Complete title, condition, hospital, and summary to enable saving.
              </p>
            )}
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

function buildShortDescription(text: string): string {
  const compact = text.replace(/\s+/g, " ").trim();
  if (compact.length <= 95) {
    return compact;
  }
  return `${compact.slice(0, 92)}...`;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-900 leading-relaxed">{value}</p>
    </div>
  );
}
