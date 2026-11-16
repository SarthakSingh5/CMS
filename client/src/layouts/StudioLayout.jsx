import { Outlet } from "react-router-dom";
import { AppSidebar } from "../components/studio/AppSidebar";

export default function StudioLayout() {
  return (
    <div className="flex h-screen w-screen bg-[var(--bg-color)] text-[var(--text-main)] overflow-hidden antialiased">
      <AppSidebar />
      <main className="flex-1 h-full overflow-hidden relative">
        <Outlet />
      </main>
    </div>
  );
}

