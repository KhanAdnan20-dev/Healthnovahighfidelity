import { useMemo, useState } from "react";
import { ChevronLeft, Star, MapPin, Clock, BadgeCheck, Stethoscope, Search } from "lucide-react";
import { useNavigate } from "react-router";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  clinic: string;
  reviews: number;
  distance: string;
  nextSlot: string;
  avatarColor: string;
  conditions: string[];
  symptomAreas: string[];
  durations: string[];
  severitySupport: string[];
  ageGroups: string[];
  urgencySupport: string[];
  visitType: string[];
  budgetTier: string;
};

const doctors: Doctor[] = [
  {
    id: "dr-aris",
    name: "Dr. Aris Thorne",
    specialty: "Gastroenterology",
    clinic: "Downtown Digestive Care",
    reviews: 142,
    distance: "1.2 km",
    nextSlot: "11:30 AM Today",
    avatarColor: "bg-teal-100",
    conditions: ["stomach", "acid reflux", "nausea"],
    symptomAreas: ["abdomen", "general"],
    durations: ["12h", "24h", "3d"],
    severitySupport: ["moderate", "high"],
    ageGroups: ["adult", "senior"],
    urgencySupport: ["high", "moderate"],
    visitType: ["in-person", "video"],
    budgetTier: "medium",
  },
  {
    id: "dr-elena",
    name: "Dr. Elena Rostova",
    specialty: "Internal Medicine",
    clinic: "HealthNova Internal Center",
    reviews: 89,
    distance: "2.5 km",
    nextSlot: "2:15 PM Today",
    avatarColor: "bg-blue-100",
    conditions: ["fever", "infection", "fatigue"],
    symptomAreas: ["general", "chest", "head"],
    durations: ["12h", "24h", "3d", "1w"],
    severitySupport: ["moderate", "high", "critical"],
    ageGroups: ["adult", "senior"],
    urgencySupport: ["critical", "high", "moderate"],
    visitType: ["in-person"],
    budgetTier: "medium",
  },
  {
    id: "dr-marcus",
    name: "Dr. Marcus Webb",
    specialty: "Cardiology",
    clinic: "Metro Heart Institute",
    reviews: 310,
    distance: "3.8 km",
    nextSlot: "9:00 AM Tomorrow",
    avatarColor: "bg-indigo-100",
    conditions: ["chest pain", "bp", "heart"],
    symptomAreas: ["chest", "general"],
    durations: ["12h", "24h", "3d"],
    severitySupport: ["high", "critical"],
    ageGroups: ["adult", "senior"],
    urgencySupport: ["critical", "high"],
    visitType: ["in-person", "video"],
    budgetTier: "high",
  },
  {
    id: "dr-chloe",
    name: "Dr. Chloe Vance",
    specialty: "General Physician",
    clinic: "Riverside Family Clinic",
    reviews: 56,
    distance: "4.1 km",
    nextSlot: "10:45 AM Tomorrow",
    avatarColor: "bg-emerald-100",
    conditions: ["general", "cough", "cold", "fever"],
    symptomAreas: ["general", "head", "chest"],
    durations: ["12h", "24h", "3d", "1w"],
    severitySupport: ["low", "moderate"],
    ageGroups: ["child", "adult", "senior"],
    urgencySupport: ["low", "moderate"],
    visitType: ["video", "in-person"],
    budgetTier: "low",
  },
  {
    id: "dr-imran",
    name: "Dr. Imran Haleem",
    specialty: "Neurology",
    clinic: "NeuroPoint Specialty Care",
    reviews: 198,
    distance: "2.0 km",
    nextSlot: "4:10 PM Today",
    avatarColor: "bg-cyan-100",
    conditions: ["migraine", "dizziness", "headache"],
    symptomAreas: ["head", "general"],
    durations: ["24h", "3d", "1w"],
    severitySupport: ["moderate", "high"],
    ageGroups: ["adult", "senior"],
    urgencySupport: ["moderate", "high"],
    visitType: ["in-person", "video"],
    budgetTier: "high",
  },
  {
    id: "dr-anya",
    name: "Dr. Anya Mercer",
    specialty: "Pediatrics",
    clinic: "KidsCare Central",
    reviews: 127,
    distance: "1.6 km",
    nextSlot: "12:20 PM Today",
    avatarColor: "bg-amber-100",
    conditions: ["fever", "vomiting", "child pain"],
    symptomAreas: ["general", "abdomen", "head"],
    durations: ["12h", "24h", "3d"],
    severitySupport: ["low", "moderate", "high"],
    ageGroups: ["child"],
    urgencySupport: ["moderate", "high"],
    visitType: ["in-person", "video"],
    budgetTier: "medium",
  },
  {
    id: "dr-kiran",
    name: "Dr. Kiran Nambiar",
    specialty: "Pulmonology",
    clinic: "Lung & Airway Clinic",
    reviews: 173,
    distance: "3.1 km",
    nextSlot: "8:40 AM Tomorrow",
    avatarColor: "bg-sky-100",
    conditions: ["breathless", "asthma", "cough"],
    symptomAreas: ["chest", "general"],
    durations: ["24h", "3d", "1w"],
    severitySupport: ["moderate", "high", "critical"],
    ageGroups: ["adult", "senior"],
    urgencySupport: ["high", "critical", "moderate"],
    visitType: ["in-person"],
    budgetTier: "medium",
  },
  {
    id: "dr-lia",
    name: "Dr. Lia Fernandez",
    specialty: "Dermatology",
    clinic: "SkinWell Clinic",
    reviews: 104,
    distance: "4.8 km",
    nextSlot: "1:30 PM Tomorrow",
    avatarColor: "bg-rose-100",
    conditions: ["rash", "itching", "skin"],
    symptomAreas: ["general"],
    durations: ["3d", "1w"],
    severitySupport: ["low", "moderate"],
    ageGroups: ["adult", "senior", "child"],
    urgencySupport: ["low", "moderate"],
    visitType: ["video", "in-person"],
    budgetTier: "low",
  },
  {
    id: "dr-ravi",
    name: "Dr. Ravi Kulkarni",
    specialty: "Emergency Medicine",
    clinic: "City Trauma & ER",
    reviews: 267,
    distance: "1.0 km",
    nextSlot: "Immediate Walk-in",
    avatarColor: "bg-red-100",
    conditions: ["trauma", "bleeding", "severe pain"],
    symptomAreas: ["head", "chest", "abdomen", "general"],
    durations: ["12h", "24h"],
    severitySupport: ["high", "critical"],
    ageGroups: ["child", "adult", "senior"],
    urgencySupport: ["critical", "high"],
    visitType: ["in-person"],
    budgetTier: "high",
  },
  {
    id: "dr-sara",
    name: "Dr. Sara Coleman",
    specialty: "ENT Specialist",
    clinic: "Voice & Sinus Center",
    reviews: 91,
    distance: "2.9 km",
    nextSlot: "3:05 PM Today",
    avatarColor: "bg-violet-100",
    conditions: ["sinus", "throat", "ear pain"],
    symptomAreas: ["head", "general"],
    durations: ["24h", "3d", "1w"],
    severitySupport: ["low", "moderate", "high"],
    ageGroups: ["child", "adult"],
    urgencySupport: ["low", "moderate", "high"],
    visitType: ["in-person", "video"],
    budgetTier: "medium",
  },
  {
    id: "dr-yuna",
    name: "Dr. Yuna Park",
    specialty: "Geriatric Medicine",
    clinic: "SilverAge Care Unit",
    reviews: 118,
    distance: "3.3 km",
    nextSlot: "11:00 AM Tomorrow",
    avatarColor: "bg-lime-100",
    conditions: ["weakness", "falls", "bp"],
    symptomAreas: ["general", "chest", "head"],
    durations: ["3d", "1w", "24h"],
    severitySupport: ["low", "moderate", "high"],
    ageGroups: ["senior"],
    urgencySupport: ["moderate", "high"],
    visitType: ["in-person", "video"],
    budgetTier: "medium",
  },
  {
    id: "dr-nina",
    name: "Dr. Nina Patel",
    specialty: "Family Medicine",
    clinic: "GreenCross Family Health",
    reviews: 76,
    distance: "5.0 km",
    nextSlot: "5:15 PM Tomorrow",
    avatarColor: "bg-fuchsia-100",
    conditions: ["general", "checkup", "minor pain"],
    symptomAreas: ["general", "abdomen", "chest", "head"],
    durations: ["12h", "24h", "3d", "1w"],
    severitySupport: ["low", "moderate"],
    ageGroups: ["child", "adult", "senior"],
    urgencySupport: ["low", "moderate"],
    visitType: ["video", "in-person"],
    budgetTier: "low",
  },
];

export function MatchScreen() {
  const navigate = useNavigate();
  const [condition, setCondition] = useState("sharp stomach pain");
  const [symptomArea, setSymptomArea] = useState("abdomen");
  const [duration, setDuration] = useState("24h");
  const [severity, setSeverity] = useState("high");
  const [ageGroup, setAgeGroup] = useState("adult");
  const [visitType, setVisitType] = useState("in-person");
  const [urgency, setUrgency] = useState("high");
  const [budget, setBudget] = useState("medium");
  const [submitted, setSubmitted] = useState(false);
  const [bookingDoctorId, setBookingDoctorId] = useState<string | null>(null);
  const [bookedDoctorIds, setBookedDoctorIds] = useState<Record<string, string>>({});

  const filteredDoctors = useMemo(() => {
    const normalized = condition.trim().toLowerCase();

    const scored = doctors.map((doctor) => {
      let score = 0;

      if (
        normalized.length > 0 &&
        doctor.conditions.some((item) => normalized.includes(item) || item.includes(normalized))
      ) {
        score += 4;
      }
      if (doctor.symptomAreas.includes(symptomArea)) {
        score += 2;
      }
      if (doctor.durations.includes(duration)) {
        score += 1;
      }
      if (doctor.severitySupport.includes(severity)) {
        score += 2;
      }
      if (doctor.ageGroups.includes(ageGroup)) {
        score += 1;
      }
      if (doctor.urgencySupport.includes(urgency)) {
        score += 3;
      }
      if (doctor.visitType.includes(visitType)) {
        score += 2;
      }
      if (budget === "any" || doctor.budgetTier === budget) {
        score += 1;
      }

      return { doctor, score };
    });

    // Always return doctors by best score so users get matches for nearly all filter combinations.
    return scored
      .sort((a, b) => b.score - a.score || b.doctor.reviews - a.doctor.reviews)
      .slice(0, 6)
      .map((entry) => entry.doctor);
  }, [ageGroup, budget, condition, duration, severity, symptomArea, urgency, visitType]);

  const runSearch = () => {
    setSubmitted(true);
  };

  const topRecommendation = filteredDoctors[0] ?? null;
  const topRecommendationBookedLabel = topRecommendation
    ? bookedDoctorIds[topRecommendation.id]
    : undefined;
  const topRecommendationIsBooking = topRecommendation
    ? bookingDoctorId === topRecommendation.id
    : false;

  const handleBookAppointment = (doctor: Doctor) => {
    if (bookingDoctorId || bookedDoctorIds[doctor.id]) {
      return;
    }

    setBookingDoctorId(doctor.id);
    setTimeout(() => {
      setBookedDoctorIds((current) => ({
        ...current,
        [doctor.id]: `Booked at ${doctor.nextSlot}`,
      }));
      setBookingDoctorId(null);
    }, 700);
  };

  const handleBookTopRecommendation = () => {
    if (!topRecommendation) {
      return;
    }

    handleBookAppointment(topRecommendation);
  };

  return (
    <div className="flex-1 bg-teal-50/30 flex flex-col h-full relative">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 border-b border-teal-100 bg-white sticky top-0 z-10 shadow-sm">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-teal-50 text-teal-700 active:bg-teal-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 flex-1">AI Recommendations</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-8">
        <section className="bg-white border border-teal-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-bold text-gray-900">Detailed Condition Search</h2>
          </div>

          <div className="space-y-2">
            <input
              value={condition}
              onChange={(event) => setCondition(event.target.value)}
              placeholder="Describe condition in detail"
              className="w-full rounded-xl border border-teal-100 px-3 py-2 text-sm outline-none focus:border-teal-300"
            />

            <div className="grid grid-cols-2 gap-2">
              <FilterSelect label="1. Symptom Area" value={symptomArea} onChange={setSymptomArea} options={[
                { value: "abdomen", label: "Abdomen" },
                { value: "chest", label: "Chest" },
                { value: "head", label: "Head" },
                { value: "general", label: "General" },
              ]} />
              <FilterSelect label="2. Duration" value={duration} onChange={setDuration} options={[
                { value: "12h", label: "Under 12 hrs" },
                { value: "24h", label: "24 hrs" },
                { value: "3d", label: "2-3 days" },
                { value: "1w", label: "1 week+" },
              ]} />
              <FilterSelect label="3. Severity" value={severity} onChange={setSeverity} options={[
                { value: "low", label: "Low" },
                { value: "moderate", label: "Moderate" },
                { value: "high", label: "High" },
                { value: "critical", label: "Critical" },
              ]} />
              <FilterSelect label="4. Age Group" value={ageGroup} onChange={setAgeGroup} options={[
                { value: "child", label: "Child" },
                { value: "adult", label: "Adult" },
                { value: "senior", label: "Senior" },
              ]} />
              <FilterSelect label="5. Visit Type" value={visitType} onChange={setVisitType} options={[
                { value: "in-person", label: "In-person" },
                { value: "video", label: "Video" },
              ]} />
              <FilterSelect label="6. Urgency" value={urgency} onChange={setUrgency} options={[
                { value: "low", label: "Low" },
                { value: "moderate", label: "Moderate" },
                { value: "high", label: "High" },
                { value: "critical", label: "Critical" },
              ]} />
              <FilterSelect label="7. Budget" value={budget} onChange={setBudget} options={[
                { value: "any", label: "Any" },
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
              ]} />
            </div>

            <button
              onClick={runSearch}
              className="w-full rounded-xl bg-teal-600 text-white font-bold py-2.5 hover:bg-teal-700"
            >
              Analyze and Show Matches
            </button>
          </div>
        </section>

        {submitted && (
          <>
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-100 rounded-xl p-4 flex gap-3 shadow-sm">
              <div className="mt-0.5">
                <Stethoscope className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-700 leading-snug font-medium">
                  Based on <span className="font-bold text-teal-800">"{condition || "provided details"}"</span>
                  , with {severity} severity and {urgency} urgency, here are the best matched doctors.
                </p>
              </div>
            </div>

            {topRecommendation && (
              <button
                onClick={handleBookTopRecommendation}
                disabled={topRecommendationIsBooking || Boolean(topRecommendationBookedLabel)}
                className={`w-full rounded-2xl border p-4 text-left transition-all shadow-sm ${
                  topRecommendationBookedLabel
                    ? "border-emerald-200 bg-emerald-50"
                    : topRecommendationIsBooking
                      ? "border-teal-200 bg-teal-50"
                      : "border-cyan-200 bg-cyan-50/70 hover:bg-cyan-50 hover:border-cyan-300"
                }`}
              >
                <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-700">
                  AI Top Recommendation
                </p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{topRecommendation.name}</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {topRecommendation.specialty} • {topRecommendation.clinic}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                      topRecommendationBookedLabel
                        ? "bg-emerald-100 text-emerald-800"
                        : topRecommendationIsBooking
                          ? "bg-teal-100 text-teal-800"
                          : "bg-cyan-100 text-cyan-800"
                    }`}
                  >
                    {topRecommendationBookedLabel
                      ? "Booked"
                      : topRecommendationIsBooking
                        ? "Booking..."
                        : "Click to Book"}
                  </span>
                </div>
              </button>
            )}

            <div className="space-y-4 mt-2">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    name={doctor.name}
                    specialty={doctor.specialty}
                    clinic={doctor.clinic}
                    reviews={doctor.reviews}
                    distance={doctor.distance}
                    nextSlot={doctor.nextSlot}
                    avatarColor={doctor.avatarColor}
                    isBooking={bookingDoctorId === doctor.id}
                    bookedLabel={bookedDoctorIds[doctor.id]}
                    onBook={() => handleBookAppointment(doctor)}
                  />
                ))
              ) : (
                <div className="bg-white border border-red-100 rounded-2xl p-4 text-sm text-red-700 font-semibold">
                  No exact doctor matches found for this filter combination. Try reducing urgency or changing visit type.
                </div>
              )}
            </div>
          </>
        )}
        {!submitted && (
          <div className="bg-white border border-teal-100 rounded-2xl p-4 text-sm text-gray-600">
            Choose all filters above and click Analyze and Show Matches to get recommendations.
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-bold text-gray-600">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-teal-100 bg-white px-2.5 py-2 text-sm outline-none focus:border-teal-300"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function DoctorCard({ 
  name, 
  specialty, 
  clinic,
  reviews, 
  distance, 
  nextSlot,
  avatarColor,
  isBooking,
  bookedLabel,
  onBook,
}: { 
  name: string, 
  specialty: string, 
  clinic: string,
  reviews: number, 
  distance: string, 
  nextSlot: string,
  avatarColor: string,
  isBooking: boolean,
  bookedLabel?: string,
  onBook: () => void,
}) {
  return (
    <div className="bg-white border border-teal-100/60 rounded-2xl p-4 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4 items-start">
        {/* Avatar Placeholder */}
        <div className={`w-16 h-16 rounded-2xl flex-shrink-0 border border-teal-200/50 ${avatarColor} flex items-center justify-center text-teal-600 font-bold text-xl`}>
          {name.split(' ')[1][0]}
        </div>
        
        {/* Info */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-gray-900 text-base leading-tight">{name}</h3>
            {/* Verified Badge */}
            <div className="flex items-center gap-1 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-blue-700">
              <BadgeCheck className="w-3 h-3" />
              Verified
            </div>
          </div>
          
          <p className="text-sm text-teal-700 font-medium mt-1">{specialty}</p>
          <p className="text-xs text-gray-500 font-semibold mt-1">{clinic}</p>
          
          <div className="flex items-center gap-3 mt-2 text-xs font-medium text-gray-500">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{reviews} Reviews</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span>{distance}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Next Slot Indicator & Action */}
      <div className="pt-3 border-t border-gray-100 flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 font-bold text-[10px] uppercase tracking-wider">Next Available Slot</span>
          <div className="flex items-center gap-1.5 font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
            <Clock className="w-4 h-4 text-teal-600" />
            {nextSlot}
          </div>
        </div>
        
        <button
          onClick={onBook}
          disabled={isBooking || Boolean(bookedLabel)}
          className={`w-full font-bold py-3.5 rounded-xl transition-colors active:scale-[0.98] shadow-sm ${
            bookedLabel
              ? "bg-emerald-100 text-emerald-800 shadow-emerald-100"
              : isBooking
                ? "bg-teal-300 text-white shadow-teal-100"
                : "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-200"
          }`}
        >
          {bookedLabel ? `${bookedLabel} • Open Queue` : isBooking ? "Booking Appointment..." : "Book & Join Queue"}
        </button>
      </div>
    </div>
  );
}
