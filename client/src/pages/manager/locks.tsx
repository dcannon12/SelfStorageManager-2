import { ManagerLayout } from "@/components/manager-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Import, MoreHorizontal, Plus } from "lucide-react";
import { useFacility } from "@/lib/facility-context";
import { AddLockDialog } from "@/components/add-lock-dialog";
import { useState } from "react";

export type LockStatus = 
  | "Overlocked"
  | "On vacant unit"
  | "Locked"
  | "Remove lock"
  | "Available"
  | "Locked for auction";

export interface Lock {
  serialCode: string;
  combination: string;
  status: LockStatus;
  facility: string;
  unitNumber: string;
  lastUpdated: string;
  updatedBy: string;
}

// Mock data for demonstration
const initialLocks: Lock[] = [
  {
    serialCode: "L364N3LL",
    combination: "4865",
    status: "Overlocked",
    facility: "Bronson Self Storage",
    unitNumber: "C098",
    lastUpdated: "25 days ago",
    updatedBy: "Chris Toler"
  },
  {
    serialCode: "AE888AX8",
    combination: "7043",
    status: "On vacant unit",
    facility: "Bronson Self Storage",
    unitNumber: "D148",
    lastUpdated: "26 days ago",
    updatedBy: "Chris Toler"
  },
  {
    serialCode: "N2EL9L3E",
    combination: "9822",
    status: "Locked",
    facility: "Bronson Self Storage",
    unitNumber: "B074",
    lastUpdated: "26 days ago",
    updatedBy: "Chris Toler"
  }
];

const getStatusColor = (status: LockStatus) => {
  switch (status) {
    case "Overlocked":
    case "Locked for auction":
      return "destructive";
    case "On vacant unit":
    case "Locked":
      return "warning";
    case "Remove lock":
      return "default";
    case "Available":
      return "success";
    default:
      return "secondary";
  }
};

export default function LocksPage() {
  const { selectedFacility } = useFacility();
  const [isAddLockOpen, setIsAddLockOpen] = useState(false);
  const [locks, setLocks] = useState<Lock[]>(initialLocks);

  const handleAddLock = (newLock: Omit<Lock, "lastUpdated" | "updatedBy">) => {
    const lock: Lock = {
      ...newLock,
      lastUpdated: "Just now",
      updatedBy: "Current User" // This would come from auth context in a real app
    };
    setLocks(prevLocks => [...prevLocks, lock]);
    setIsAddLockOpen(false);
  };

  return (
    <ManagerLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Locks</h1>
          <div className="space-x-2">
            <Button variant="outline">
              <Import className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button onClick={() => setIsAddLockOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add lock
            </Button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search"
            className="max-w-sm"
          />
          <Button variant="outline" className="flex items-center gap-2">
            Facility: {selectedFacility === 'all' ? 'All Facilities' : selectedFacility.name}
          </Button>
          <Button variant="outline" className="ml-auto">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serial code</TableHead>
                <TableHead>Combination</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Facility</TableHead>
                <TableHead>Unit Number</TableHead>
                <TableHead>Last updated</TableHead>
                <TableHead>Updated By</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locks.map((lock) => (
                <TableRow key={lock.serialCode}>
                  <TableCell className="font-medium">{lock.serialCode}</TableCell>
                  <TableCell>{lock.combination}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(lock.status) as any}>
                      {lock.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{lock.facility}</TableCell>
                  <TableCell>{lock.unitNumber}</TableCell>
                  <TableCell>{lock.lastUpdated}</TableCell>
                  <TableCell>{lock.updatedBy}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <AddLockDialog 
          isOpen={isAddLockOpen}
          onClose={() => setIsAddLockOpen(false)}
          onSave={handleAddLock}
        />
      </div>
    </ManagerLayout>
  );
}