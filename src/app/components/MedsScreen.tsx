import { useMemo, useState } from "react";
import { ChevronLeft, Pill, Search, Plus, CheckCircle2, AlertTriangle, Clock3, ShoppingCart, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router";

type TimeSlot = "morning" | "afternoon" | "night";

type Medication = {
  id: string;
  name: string;
  dosage: string;
  schedule: TimeSlot[];
  stockLeft: number;
  refillDate: string;
  takenToday: boolean;
  notes: string;
};

type MedicineToBuy = {
  id: string;
  name: string;
  dosage: string;
  quantity: number;
  reason: "out-of-stock" | "required" | "new";
  addedDate: string;
  price?: number;
};

const initialMeds: Medication[] = [
  {
    id: "metformin",
    name: "Metformin",
    dosage: "500 mg",
    schedule: ["morning", "night"],
    stockLeft: 14,
    refillDate: "Apr 04",
    takenToday: true,
    notes: "Take after meals",
  },
  {
    id: "atorvastatin",
    name: "Atorvastatin",
    dosage: "10 mg",
    schedule: ["night"],
    stockLeft: 6,
    refillDate: "Mar 29",
    takenToday: false,
    notes: "Take at bedtime",
  },
  {
    id: "vitamin-d",
    name: "Vitamin D3",
    dosage: "1000 IU",
    schedule: ["morning"],
    stockLeft: 25,
    refillDate: "Apr 20",
    takenToday: false,
    notes: "Weekly review with clinician",
  },
  {
    id: "omeprazole",
    name: "Omeprazole",
    dosage: "20 mg",
    schedule: ["morning"],
    stockLeft: 9,
    refillDate: "Apr 01",
    takenToday: true,
    notes: "Take 30 minutes before breakfast",
  },
];

export function MedsScreen() {
  const navigate = useNavigate();
  const [medications, setMedications] = useState<Medication[]>(initialMeds);
  const [medicinesToBuy, setMedicinesToBuy] = useState<MedicineToBuy[]>([]);
  const [query, setQuery] = useState("");
  const [activeSlot, setActiveSlot] = useState<"all" | TimeSlot>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDose, setNewDose] = useState("");
  const [newSlot, setNewSlot] = useState<TimeSlot>("morning");
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [buyMedicineName, setBuyMedicineName] = useState("");
  const [buyMedicineDose, setBuyMedicineDose] = useState("");
  const [buyMedicineQty, setBuyMedicineQty] = useState("1");
  const [buyReason, setBuyReason] = useState<"out-of-stock" | "required" | "new">("required");
  const [showBuyCart, setShowBuyCart] = useState(false);

  const visibleMeds = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return medications.filter((med) => {
      const matchesQuery =
        med.name.toLowerCase().includes(normalized) ||
        med.dosage.toLowerCase().includes(normalized) ||
        med.notes.toLowerCase().includes(normalized);

      const matchesSlot = activeSlot === "all" || med.schedule.includes(activeSlot);

      return matchesQuery && matchesSlot;
    });
  }, [activeSlot, medications, query]);

  const adherencePct = useMemo(() => {
    if (medications.length === 0) {
      return 0;
    }

    const taken = medications.filter((med) => med.takenToday).length;
    return Math.round((taken / medications.length) * 100);
  }, [medications]);

  const aiMessage = useMemo(() => {
    const lowStockMeds = medications.filter((med) => med.stockLeft <= 7);
    const missedToday = medications.filter((med) => !med.takenToday);

    if (missedToday.length > 0) {
      return `AI Alert: ${missedToday.length} dose${missedToday.length > 1 ? "s" : ""} still pending today. Consider enabling reminders for better adherence.`;
    }

    if (lowStockMeds.length > 0) {
      return `AI Refill Tip: ${lowStockMeds[0].name} is running low. Place a refill request before ${lowStockMeds[0].refillDate}.`;
    }

    return "AI Insight: Great consistency today. Keep the same timing to maintain treatment effectiveness.";
  }, [medications]);

  const toggleTaken = (id: string) => {
    setMedications((current) =>
      current.map((med) => (med.id === id ? { ...med, takenToday: !med.takenToday } : med)),
    );
  };

  const addMedication = () => {
    const cleanName = newName.trim();
    const cleanDose = newDose.trim();

    if (!cleanName || !cleanDose) {
      return;
    }

    const newMed: Medication = {
      id: `med-${Date.now()}`,
      name: cleanName,
      dosage: cleanDose,
      schedule: [newSlot],
      stockLeft: 30,
      refillDate: "Apr 30",
      takenToday: false,
      notes: "Added manually",
    };

    setMedications((current) => [newMed, ...current]);
    setNewName("");
    setNewDose("");
    setNewSlot("morning");
    setShowAddForm(false);
  };

  const addMedicineToBuy = () => {
    const cleanName = buyMedicineName.trim();
    const cleanDose = buyMedicineDose.trim();
    const qty = parseInt(buyMedicineQty, 10);

    if (!cleanName || !cleanDose || qty <= 0) {
      return;
    }

    const newMedicineToBuy: MedicineToBuy = {
      id: `buy-${Date.now()}`,
      name: cleanName,
      dosage: cleanDose,
      quantity: qty,
      reason: buyReason,
      addedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };

    setMedicinesToBuy((current) => [newMedicineToBuy, ...current]);
    setBuyMedicineName("");
    setBuyMedicineDose("");
    setBuyMedicineQty("1");
    setBuyReason("required");
    setShowBuyDialog(false);
  };

  const removeMedicineToBuy = (id: string) => {
    setMedicinesToBuy((current) => current.filter((med) => med.id !== id));
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
        <h1 className="text-lg font-bold text-gray-900 flex-1">Medication Manager</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
        <section className="bg-white border border-teal-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-gray-800">Today&apos;s Adherence</p>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded-full">
              {adherencePct}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal-500 to-blue-500" style={{ width: `${adherencePct}%` }} />
          </div>
          <div className="mt-3 rounded-xl bg-teal-900 text-white p-3">
            <p className="text-[10px] uppercase tracking-wider text-teal-200 font-bold">AI Assistant</p>
            <p className="text-xs mt-1 leading-relaxed">{aiMessage}</p>
          </div>
        </section>

        <section className="bg-white border border-teal-100 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-teal-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search medicine, dose, note"
              className="w-full rounded-xl border border-teal-100 pl-9 pr-3 py-2 text-sm outline-none focus:border-teal-300"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            <FilterChip label="All" active={activeSlot === "all"} onClick={() => setActiveSlot("all")} />
            <FilterChip
              label="Morning"
              active={activeSlot === "morning"}
              onClick={() => setActiveSlot("morning")}
            />
            <FilterChip
              label="Afternoon"
              active={activeSlot === "afternoon"}
              onClick={() => setActiveSlot("afternoon")}
            />
            <FilterChip label="Night" active={activeSlot === "night"} onClick={() => setActiveSlot("night")} />
          </div>

          <button
            onClick={() => setShowAddForm((current) => !current)}
            className="w-full rounded-xl border border-dashed border-teal-300 bg-teal-50/60 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-100/70"
          >
            {showAddForm ? "Close Add Form" : "Add New Medication"}
          </button>

          {showAddForm && (
            <div className="rounded-xl border border-teal-100 p-3 bg-white space-y-2">
              <input
                value={newName}
                onChange={(event) => setNewName(event.target.value)}
                placeholder="Medication name"
                className="w-full rounded-lg border border-teal-100 px-3 py-2 text-sm outline-none focus:border-teal-300"
              />
              <input
                value={newDose}
                onChange={(event) => setNewDose(event.target.value)}
                placeholder="Dosage (e.g., 500 mg)"
                className="w-full rounded-lg border border-teal-100 px-3 py-2 text-sm outline-none focus:border-teal-300"
              />
              <div className="flex gap-2">
                <select
                  value={newSlot}
                  onChange={(event) => setNewSlot(event.target.value as TimeSlot)}
                  className="flex-1 rounded-lg border border-teal-100 px-3 py-2 text-sm outline-none focus:border-teal-300"
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="night">Night</option>
                </select>
                <button
                  onClick={addMedication}
                  className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700"
                >
                  <span className="inline-flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                    Add
                  </span>
                </button>
              </div>
            </div>
          )}
        </section>
        {/* Buy Medicines Section */}
        <section className="bg-white border border-amber-100 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-amber-600" />
              <h2 className="text-sm font-bold text-gray-900">Buy Medicines</h2>
            </div>
            {medicinesToBuy.length > 0 && (
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                {medicinesToBuy.length} item{medicinesToBuy.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <button
            onClick={() => setShowBuyDialog((current) => !current)}
            className="w-full rounded-xl border border-dashed border-amber-300 bg-amber-50/60 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100/70"
          >
            {showBuyDialog ? "Close" : "Add Medicine to Shopping List"}
          </button>

          {showBuyDialog && (
            <div className="rounded-xl border border-amber-100 p-3 bg-white space-y-2">
              <input
                value={buyMedicineName}
                onChange={(event) => setBuyMedicineName(event.target.value)}
                placeholder="Medicine name (e.g., Aspirin)"
                className="w-full rounded-lg border border-amber-100 px-3 py-2 text-sm outline-none focus:border-amber-300"
              />
              <input
                value={buyMedicineDose}
                onChange={(event) => setBuyMedicineDose(event.target.value)}
                placeholder="Dosage (e.g., 500 mg)"
                className="w-full rounded-lg border border-amber-100 px-3 py-2 text-sm outline-none focus:border-amber-300"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={buyMedicineQty}
                  onChange={(event) => setBuyMedicineQty(event.target.value)}
                  type="number"
                  min="1"
                  placeholder="Quantity"
                  className="rounded-lg border border-amber-100 px-3 py-2 text-sm outline-none focus:border-amber-300"
                />
                <select
                  value={buyReason}
                  onChange={(event) => setBuyReason(event.target.value as any)}
                  className="rounded-lg border border-amber-100 px-3 py-2 text-sm outline-none focus:border-amber-300"
                >
                  <option value="required">Required</option>
                  <option value="out-of-stock">Out of Stock</option>
                  <option value="new">New Medicine</option>
                </select>
              </div>
              <button
                onClick={addMedicineToBuy}
                className="w-full rounded-lg bg-amber-600 px-4 py-2 text-sm font-bold text-white hover:bg-amber-700"
              >
                <span className="inline-flex items-center justify-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  Add to Cart
                </span>
              </button>
            </div>
          )}

          {medicinesToBuy.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {medicinesToBuy.map((med) => (
                <div key={med.id} className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50 border border-amber-100">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-gray-900">{med.name}</p>
                      <span className="text-[9px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                        {med.dosage}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] font-semibold text-gray-600">Qty: {med.quantity}</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        med.reason === "out-of-stock" ? "bg-red-100 text-red-700" :
                        med.reason === "required" ? "bg-blue-100 text-blue-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {med.reason === "out-of-stock" ? "Out of Stock" : 
                         med.reason === "required" ? "Required" : "New"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeMedicineToBuy(med.id)}
                    className="ml-2 p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setShowBuyCart(!showBuyCart)}
                className="w-full rounded-lg bg-amber-600 text-white py-2 text-sm font-bold hover:bg-amber-700 mt-2"
              >
                {showBuyCart ? "Hide" : "View Shopping Cart"}
              </button>
            </div>
          )}

          {medicinesToBuy.length === 0 && (
            <p className="text-xs text-gray-500 text-center py-4">
              No medicines in shopping list. Add medicines you need to buy.
            </p>
          )}
        </section>
        <section className="space-y-3">
          {visibleMeds.map((med) => (
            <article key={med.id} className="bg-white border border-teal-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700">
                  <Pill className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{med.name}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
                      {med.dosage}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {med.schedule.map((slot) => (
                      <span
                        key={slot}
                        className="text-[10px] font-semibold text-gray-600 bg-gray-50 border border-gray-100 rounded-full px-2 py-1"
                      >
                        {slot}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-amber-50 border border-amber-100 px-2.5 py-1.5 text-amber-800 font-semibold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Stock: {med.stockLeft} left
                    </div>
                    <div className="rounded-lg bg-blue-50 border border-blue-100 px-2.5 py-1.5 text-blue-800 font-semibold flex items-center gap-1.5">
                      <Clock3 className="w-3.5 h-3.5" />
                      Refill by {med.refillDate}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">{med.notes}</p>
                </div>
              </div>

              <button
                onClick={() => toggleTaken(med.id)}
                className={`mt-3 w-full rounded-xl py-2.5 text-sm font-bold transition-colors ${
                  med.takenToday
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {med.takenToday ? "Marked as taken" : "Mark as taken"}
                </span>
              </button>
            </article>
          ))}

          {visibleMeds.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center text-sm text-gray-500">
              No medications found for this search and filter.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border px-2 py-1.5 text-[11px] font-bold transition-colors ${
        active
          ? "border-teal-200 bg-teal-50 text-teal-700"
          : "border-gray-200 bg-white text-gray-500 hover:border-teal-100 hover:text-teal-700"
      }`}
    >
      {label}
    </button>
  );
}
