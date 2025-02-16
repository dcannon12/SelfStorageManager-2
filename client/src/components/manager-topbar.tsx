import { ChevronDown } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export type Facility = {
  id: number;
  name: string;
  code: string;
};

export function ManagerTopbar() {
  const [selectedFacility, setSelectedFacility] = useState<Facility | 'all'>('all');

  const facilities: Facility[] = [
    { id: 1, name: "Facility 1", code: "D.8451" },
    { id: 2, name: "Facility 2", code: "D.8452" },
    { id: 3, name: "Facility 3", code: "D.8453" },
  ];

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
    <div className="h-16 border-b border-border bg-background px-6 flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-accent px-2 py-1 rounded-md">
          <span className="text-sm">{selectedFacility === 'all' ? 'All Facilities' : selectedFacility.name}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setSelectedFacility('all')} className="flex items-center gap-2">
            <span>All Facilities</span>
          </DropdownMenuItem>
          {facilities.map((facility) => (
            <DropdownMenuItem 
              key={facility.id} 
              onClick={() => setSelectedFacility(facility)}
              className="flex items-center gap-2"
            >
              <span>{facility.name}</span>
              <span className="text-muted-foreground">({facility.code})</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}