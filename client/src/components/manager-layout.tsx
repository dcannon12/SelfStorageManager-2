import { ManagerSidebar } from "./manager-sidebar";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { useLocation } from "wouter";
import { Search, User } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Customer } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFacility } from "@/lib/facility-context";
import type { Facility } from "@/lib/facility-context";

interface ManagerLayoutProps {
  children: React.ReactNode;
}

export function ManagerLayout({ children }: ManagerLayoutProps) {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedFacility, setSelectedFacility } = useFacility();

  const { data: customers } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  // Mock facilities - these would come from your API in a real implementation
  const facilities: Facility[] = [
    { id: 1, name: "Facility 1", code: "D.8451" },
    { id: 2, name: "Facility 2", code: "D.8452" },
    { id: 3, name: "Facility 3", code: "D.8453" },
  ];

  // Filter customers based on search query
  const filteredCustomers = customers?.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? [];

  const handleFacilityChange = (value: string) => {
    if (value === 'all') {
      setSelectedFacility('all');
    } else {
      const facility = facilities.find(f => f.id.toString() === value);
      if (facility) {
        setSelectedFacility(facility);
      }
    }
  };

  return (
    <div className="flex h-screen">
      <ManagerSidebar />
      <div className="flex-1 flex flex-col">
        <div className="border-b">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4">
              <h2 className="font-semibold">Storage Manager</h2>
              <Select 
                value={typeof selectedFacility === 'string' ? 'all' : selectedFacility.id.toString()}
                onValueChange={handleFacilityChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Facility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Facilities</SelectItem>
                  {facilities.map((facility) => (
                    <SelectItem key={facility.id} value={facility.id.toString()}>
                      {facility.name} ({facility.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-96">
              <Command className="rounded-lg border shadow-md">
                <CommandInput
                  placeholder="Search tenants..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                {searchQuery && (
                  <>
                    <CommandEmpty>No tenants found.</CommandEmpty>
                    <CommandGroup heading="Tenants">
                      {filteredCustomers.map((customer) => (
                        <CommandItem
                          key={customer.id}
                          value={customer.name}
                          onSelect={() => {
                            setLocation(`/manager/tenant/${customer.id}`);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <User className="h-4 w-4" />
                          <div>
                            <div>{customer.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {customer.email}
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                )}
              </Command>
            </div>
          </div>
        </div>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}