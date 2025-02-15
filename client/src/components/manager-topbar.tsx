import { Bell, MessageSquare, Settings, Map } from "lucide-react";
import { Link } from "wouter";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function ManagerTopbar() {
  const siteMap = [
    { heading: "Dashboard", items: [
      { name: "Home", path: "/manager" },
      { name: "Units", path: "/manager/units" },
      { name: "Leads", path: "/manager/leads" },
    ]},
    { heading: "Operations", items: [
      { name: "Pricing Groups", path: "/manager/pricing" },
      { name: "Rentals", path: "/manager/rentals" },
      { name: "Payments", path: "/manager/payments" },
    ]},
    { heading: "Management", items: [
      { name: "Reports", path: "/manager/reports" },
      { name: "Locks", path: "/manager/locks" },
      { name: "Messaging", path: "/manager/messaging" },
    ]}
  ];

  return (
    <div className="h-16 border-b border-border bg-background px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Budget Storage Florida - Fort Meade</span>
        <span className="text-sm text-muted-foreground">Facility (D.8451)</span>
        <Drawer>
          <DrawerTrigger asChild>
            <button className="p-2 rounded-full hover:bg-accent">
              <Map className="h-5 w-5" />
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Site Map</DrawerTitle>
            </DrawerHeader>
            <div className="p-6 grid grid-cols-3 gap-6">
              {siteMap.map((section) => (
                <div key={section.heading}>
                  <h3 className="font-semibold mb-2">{section.heading}</h3>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.path}>
                        <Link href={item.path}>
                          <a className="text-sm text-muted-foreground hover:text-foreground">
                            {item.name}
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/manager/messaging">
          <a className="p-2 rounded-full hover:bg-accent">
            <MessageSquare className="h-5 w-5" />
          </a>
        </Link>
        <button className="p-2 rounded-full hover:bg-accent">
          <Bell className="h-5 w-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-accent">
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}