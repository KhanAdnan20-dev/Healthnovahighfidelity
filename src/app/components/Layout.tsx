import { Outlet } from "react-router";

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center font-sans">
      <div className="w-full h-screen max-w-[430px] sm:max-w-[500px] md:max-w-[430px] bg-gray-50 md:h-[90vh] md:max-h-[900px] md:rounded-3xl md:shadow-lg overflow-hidden border border-gray-300 relative flex flex-col">
        {/* Status Bar Mockup */}
        <div className="h-6 w-full bg-gray-100 border-b border-gray-300 flex justify-between items-center px-4 text-[10px] text-gray-500 font-medium z-50">
          <span>9:41</span>
          <div className="flex gap-1 items-center">
            <div className="w-3 h-2 bg-gray-400 rounded-sm"></div>
            <div className="w-3 h-2 bg-gray-400 rounded-sm"></div>
            <div className="w-4 h-2 bg-gray-400 rounded-sm"></div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative flex flex-col overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
