import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, BoxSelect, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";

export function ManagerSidebar() {
  const [location] = useLocation();

  const links = [
    { href: "/manager", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/manager/units", icon: BoxSelect, label: "Units" },
    { href: "/manager/tenants", icon: Users, label: "Tenants" },
    { href: "/manager/analytics", icon: BarChart, label: "Analytics" }
  ];

  return (
    <div className="h-screen w-64 bg-sidebar border-r border-border flex flex-col">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Facility Manager</h2>
      </div>
      <nav className="flex-1">
        {links.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}>
            <a className={cn(
              "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              location === href && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}>
              <Icon className="h-4 w-4" />
              {label}
            </a>
          </Link>
        ))}
      </nav>
    </div>
  );
}
