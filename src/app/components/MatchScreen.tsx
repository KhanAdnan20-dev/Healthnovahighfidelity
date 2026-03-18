import { ChevronLeft, Star, MapPin, Clock, BadgeCheck, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router";

export function MatchScreen() {
  const navigate = useNavigate();

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
        {/* Top Banner: AI Summary */}
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-100 rounded-xl p-4 flex gap-3 shadow-sm">
          <div className="mt-0.5">
            <Stethoscope className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <p className="text-sm text-gray-700 leading-snug font-medium">
              Based on <span className="font-bold text-teal-800">"sharp stomach pain"</span>, recommending top Gastroenterologists near you.
            </p>
          </div>
        </div>

        {/* Listings */}
        <div className="space-y-4 mt-2">
          <DoctorCard 
            name="Dr. Aris Thorne"
            specialty="Gastroenterology"
            reviews={142}
            distance="1.2 km"
            nextSlot="11:30 AM Today"
            avatarColor="bg-teal-100"
          />
          <DoctorCard 
            name="Dr. Elena Rostova"
            specialty="Gastroenterology • Internal Med"
            reviews={89}
            distance="2.5 km"
            nextSlot="2:15 PM Today"
            avatarColor="bg-blue-100"
          />
          <DoctorCard 
            name="Dr. Marcus Webb"
            specialty="Gastroenterology"
            reviews={310}
            distance="3.8 km"
            nextSlot="9:00 AM Tomorrow"
            avatarColor="bg-indigo-100"
          />
          <DoctorCard 
            name="Dr. Chloe Vance"
            specialty="Digestive Health Specialist"
            reviews={56}
            distance="4.1 km"
            nextSlot="10:45 AM Tomorrow"
            avatarColor="bg-emerald-100"
          />
        </div>
      </div>
    </div>
  );
}

function DoctorCard({ 
  name, 
  specialty, 
  reviews, 
  distance, 
  nextSlot,
  avatarColor 
}: { 
  name: string, 
  specialty: string, 
  reviews: number, 
  distance: string, 
  nextSlot: string,
  avatarColor: string
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
        
        <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl transition-colors active:scale-[0.98] shadow-sm shadow-teal-200">
          Book & Join Queue
        </button>
      </div>
    </div>
  );
}
