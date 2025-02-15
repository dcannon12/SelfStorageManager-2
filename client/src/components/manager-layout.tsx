import { ManagerSidebar } from "./manager-sidebar";

interface ManagerLayoutProps {
  children: React.ReactNode;
}

export function ManagerLayout({ children }: ManagerLayoutProps) {
  return (
    <div className="flex h-screen">
      <ManagerSidebar />
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
