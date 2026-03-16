// ─── TypeScript Interfaces (mirrors future MySQL schema) ───

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  reviews: number;
  distance: string;
  nextSlot: string;
  avatarColor: string;
  verified: boolean;
  clinic: string;
  room: string;
}

export interface Patient {
  id: number;
  name: string;
  reason: string;
  token: string;
  status: "waiting" | "in-progress" | "done";
  doctorId: number;
}

export interface Appointment {
  id: number;
  patientName: string;
  doctorId: number;
  time: string;
  date: string;
  status: "upcoming" | "in-queue" | "completed" | "cancelled";
  queueNumber: number;
  room: string;
}

export interface MedicalRecord {
  id: number;
  title: string;
  date: string;
  category: string;
  owner: string;
}

export interface HbA1cReading {
  name: string;
  value: number;
}

// ─── Static "Database" (acts as MySQL tables) ───

export const db = {
  doctors: [
    {
      id: 1,
      name: "Dr. Aris Thorne",
      specialty: "Gastroenterology",
      reviews: 142,
      distance: "1.2 km",
      nextSlot: "11:30 AM Today",
      avatarColor: "bg-teal-100",
      verified: true,
      clinic: "Downtown Clinic",
      room: "Room 101",
    },
    {
      id: 2,
      name: "Dr. Elena Rostova",
      specialty: "Gastroenterology • Internal Med",
      reviews: 89,
      distance: "2.5 km",
      nextSlot: "2:15 PM Today",
      avatarColor: "bg-blue-100",
      verified: true,
      clinic: "Downtown Clinic",
      room: "Room 204",
    },
    {
      id: 3,
      name: "Dr. Marcus Webb",
      specialty: "Gastroenterology",
      reviews: 310,
      distance: "3.8 km",
      nextSlot: "9:00 AM Tomorrow",
      avatarColor: "bg-indigo-100",
      verified: true,
      clinic: "Uptown Medical",
      room: "Room 305",
    },
    {
      id: 4,
      name: "Dr. Chloe Vance",
      specialty: "Digestive Health Specialist",
      reviews: 56,
      distance: "4.1 km",
      nextSlot: "10:45 AM Tomorrow",
      avatarColor: "bg-emerald-100",
      verified: true,
      clinic: "Westside Health",
      room: "Room 112",
    },
    {
      id: 5,
      name: "Dr. Anurag",
      specialty: "General Practice • Internal Med",
      reviews: 203,
      distance: "0.8 km",
      nextSlot: "3:00 PM Today",
      avatarColor: "bg-pink-100",
      verified: true,
      clinic: "Downtown Clinic",
      room: "Room 108",
    },
    {
      id: 6,
      name: "Dr. Sarah Jenkins",
      specialty: "General Practice",
      reviews: 175,
      distance: "1.0 km",
      nextSlot: "2:45 PM Today",
      avatarColor: "bg-amber-100",
      verified: true,
      clinic: "Downtown Clinic",
      room: "Room 204",
    },
  ] as Doctor[],

  patients: [
    { id: 1, name: "Marcus Webb", reason: "General Checkup", token: "#11", status: "in-progress", doctorId: 6 },
    { id: 2, name: "Elena Rostova", reason: "Follow-up: Blood Work", token: "#12", status: "waiting", doctorId: 6 },
    { id: 3, name: "David Chen", reason: "Migraine Assessment", token: "#13", status: "waiting", doctorId: 6 },
    { id: 4, name: "Aria Vance", reason: "Sharp Stomach Pain", token: "#14", status: "waiting", doctorId: 6 },
  ] as Patient[],

  appointments: [
    {
      id: 1,
      patientName: "You",
      doctorId: 6,
      time: "2:45 PM",
      date: "Today, Oct 24",
      status: "upcoming",
      queueNumber: 14,
      room: "Room 204",
    },
  ] as Appointment[],

  medicalRecords: [
    { id: 1, title: "Apollo Blood Report", date: "Oct 24, 2023", category: "blood", owner: "Self" },
    { id: 2, title: "Thyroid Panel", date: "Sep 12, 2023", category: "thyroid", owner: "Self" },
    { id: 3, title: "Dermatology Prescription", date: "Aug 05, 2023", category: "prescription", owner: "Self" },
    { id: 4, title: "Annual Physical Summary", date: "Jan 10, 2023", category: "general", owner: "Self" },
    { id: 5, title: "Mother — CBC Report", date: "Jul 18, 2023", category: "blood", owner: "Mother" },
    { id: 6, title: "Mother — X-Ray Results", date: "Mar 02, 2023", category: "radiology", owner: "Mother" },
    { id: 7, title: "Father — Lipid Panel", date: "Jun 30, 2023", category: "blood", owner: "Father" },
    { id: 8, title: "Child — Vaccination Card", date: "Sep 01, 2023", category: "general", owner: "Child" },
  ] as MedicalRecord[],

  hba1cReadings: [
    { name: "Jan", value: 7.2 },
    { name: "Feb", value: 6.8 },
    { name: "Mar", value: 6.5 },
    { name: "Apr", value: 6.1 },
    { name: "May", value: 5.9 },
    { name: "Jun", value: 5.7 },
  ] as HbA1cReading[],
};

// ─── Simulated Async API (mimics FastAPI network latency) ───

function simulateLatency<T>(data: T, ms?: number): Promise<T> {
  const delay = ms ?? 800 + Math.random() * 700; // 800–1500 ms
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
}

export const api = {
  getDoctors(): Promise<Doctor[]> {
    return simulateLatency([...db.doctors]);
  },

  getDoctorById(id: number): Promise<Doctor | undefined> {
    return simulateLatency(db.doctors.find((d) => d.id === id));
  },

  getPatients(doctorId?: number): Promise<Patient[]> {
    const list = doctorId
      ? db.patients.filter((p) => p.doctorId === doctorId)
      : db.patients;
    return simulateLatency([...list]);
  },

  getAppointments(): Promise<Appointment[]> {
    return simulateLatency([...db.appointments]);
  },

  getActiveAppointment(): Promise<Appointment | undefined> {
    return simulateLatency(
      db.appointments.find((a) => a.status === "upcoming" || a.status === "in-queue")
    );
  },

  async bookAppointment(doctorId: number): Promise<Appointment> {
    const doctor = db.doctors.find((d) => d.id === doctorId);
    if (!doctor) throw new Error("Doctor not found");

    const newAppt: Appointment = {
      id: db.appointments.length + 1,
      patientName: "You",
      doctorId,
      time: doctor.nextSlot,
      date: "Today",
      status: "in-queue",
      queueNumber: db.patients.length + 11,
      room: doctor.room,
    };
    db.appointments.push(newAppt);
    return simulateLatency(newAppt);
  },

  async cancelAppointment(appointmentId: number): Promise<boolean> {
    const idx = db.appointments.findIndex((a) => a.id === appointmentId);
    if (idx === -1) return simulateLatency(false);
    db.appointments[idx].status = "cancelled";
    return simulateLatency(true);
  },

  async markPatientDone(patientId: number): Promise<boolean> {
    const patient = db.patients.find((p) => p.id === patientId);
    if (!patient) return simulateLatency(false);
    patient.status = "done";
    return simulateLatency(true);
  },

  getMedicalRecords(owner?: string): Promise<MedicalRecord[]> {
    const list = owner
      ? db.medicalRecords.filter((r) => r.owner === owner)
      : db.medicalRecords;
    return simulateLatency([...list]);
  },

  async addMedicalRecord(title: string, owner: string): Promise<MedicalRecord> {
    const record: MedicalRecord = {
      id: db.medicalRecords.length + 1,
      title,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      category: "general",
      owner,
    };
    db.medicalRecords.push(record);
    return simulateLatency(record);
  },

  getHbA1cReadings(): Promise<HbA1cReading[]> {
    return simulateLatency([...db.hba1cReadings]);
  },
};
