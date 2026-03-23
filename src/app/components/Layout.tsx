import { Activity, Calendar, FileSearch, LayoutDashboard, Pill, ShieldPlus } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router";

export function Layout() {
  const location = useLocation();

  const sections = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard, description: "Command center" },
    { label: "Find Doctors", path: "/search", icon: FileSearch, description: "Advanced matching" },
    { label: "Live Queue", path: "/queue", icon: Calendar, description: "Appointment tracking" },
    { label: "Digital Locker", path: "/locker", icon: ShieldPlus, description: "Reports & family" },
    { label: "Medication", path: "/meds", icon: Pill, description: "Dosage planning" },
  ];

  const currentSection = sections.find((item) => item.path === location.pathname)?.label ?? "Clinic Portal";

  return (
    <div className="h-screen w-screen bg-slate-100 text-slate-900 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-28 -left-20 h-96 w-96 rounded-full bg-cyan-200/50 blur-3xl"></div>
      <div className="pointer-events-none absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-emerald-200/40 blur-3xl"></div>

      <div className="relative z-10 h-full w-full">
        <div className="grid h-full w-full grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden lg:flex lg:flex-col border-r border-white/70 bg-white/80 backdrop-blur-xl p-5 shadow-[0_20px_50px_rgba(2,132,199,0.12)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white flex items-center justify-center shadow-md">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-extrabold tracking-tight text-cyan-900">HealthNova</p>
                <p className="text-xs text-slate-500 font-semibold">Clinical Operations Suite</p>
              </div>
            </div>

            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 mb-2">Navigation</p>
            <div className="space-y-1.5">
              {sections.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                      `rounded-2xl border px-3 py-2.5 transition-all ${
                        isActive
                          ? "border-cyan-200 bg-cyan-50 text-cyan-900"
                          : "border-transparent bg-white text-slate-700 hover:border-slate-200 hover:bg-slate-50"
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold leading-tight">{item.label}</p>
                        <p className="text-[11px] text-slate-500">{item.description}</p>
                      </div>
                    </div>
                  </NavLink>
                );
              })}
            </div>

            <div className="mt-auto rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
              <p className="text-[10px] uppercase tracking-wider font-bold text-emerald-700">Live Status</p>
              <p className="mt-1 text-sm font-bold text-emerald-900">Clinic Network Stable</p>
              <p className="text-xs text-emerald-800 mt-1">All patient-facing modules are responsive and active.</p>
            </div>
          </aside>

          <section className="border-l border-white/80 bg-white/85 backdrop-blur-xl shadow-[0_24px_80px_rgba(15,23,42,0.12)] overflow-hidden h-full min-h-0">
            <div className="hidden md:flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 py-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">HealthNova Web Portal</p>
                <p className="text-lg font-extrabold tracking-tight text-slate-900">{currentSection}</p>
              </div>
              <div className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-800">
                Website Mode Enabled
              </div>
            </div>

            <div className="h-full min-h-0">
              <Outlet />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}