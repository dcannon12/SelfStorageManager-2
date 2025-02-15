import { ManagerSidebar } from "./manager-sidebar";
import { ManagerTopbar } from "./manager-topbar";

interface ManagerLayoutProps {
  children: React.ReactNode;
}

export function ManagerLayout({ children }: ManagerLayoutProps) {
  return (
    <div className="flex h-screen">
      <ManagerSidebar />
      <div className="flex-1 flex flex-col">
        <ManagerTopbar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}