import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  BoxSelect, 
  UserPlus, 
  Tags, 
  Key,
  ClipboardList,
  DollarSign,
  BarChart3,
  AlertCircle,
  Map,
  MessageSquare,
  Bell,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ManagerSidebar() {
  const [location] = useLocation();

  const links = [
    { href: "/manager", icon: LayoutDashboard, label: "Home" },
    { href: "/manager/units", icon: BoxSelect, label: "Units" },
    { href: "/manager/leads", icon: UserPlus, label: "Leads" },
    { href: "/manager/pricing", icon: Tags, label: "Pricing Groups" },
    { href: "/manager/rentals", icon: ClipboardList, label: "Rentals" },
    { href: "/manager/payments", icon: DollarSign, label: "Payments" },
    { href: "/manager/collections", icon: AlertCircle, label: "Collections" },
    { href: "/manager/site-map", icon: Map, label: "Site Map" },
    { href: "/manager/reports", icon: BarChart3, label: "Reports" },
    { href: "/manager/locks", icon: Key, label: "Locks" },
    { href: "/manager/messaging", icon: MessageSquare, label: "Messages" }
  ];

  return (
    <div className="h-screen w-64 bg-sidebar border-r border-border flex flex-col">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Storage Manager</h2>
        <p className="text-sm text-muted-foreground">Facility Management</p>
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
      <div className="p-4 border-t border-border">
        <div className="flex flex-col gap-2">
          <button className="flex items-center gap-3 px-2 py-2 text-sm font-medium rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <Bell className="h-4 w-4" />
            Notifications
          </button>
          <button className="flex items-center gap-3 px-2 py-2 text-sm font-medium rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}