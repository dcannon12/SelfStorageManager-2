import { ManagerLayout } from "@/components/manager-layout";
import { useState } from "react";
import { useLocation } from "wouter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  unitNumber: string;
  balance: number;
  status: "current" | "overdue" | "delinquent";
}

// Mock data matching our site map tenants
const mockTenants: Customer[] = [
  {
    id: "1",
    name: "Sarah Anderson",
    email: "sarah.anderson@email.com",
    phone: "(407) 555-1234",
    unitNumber: "1",
    balance: 150.00,
    status: "overdue"
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    email: "michael.r@email.com",
    phone: "(407) 555-2345",
    unitNumber: "2",
    balance: 0,
    status: "current"
  },
  {
    id: "4",
    name: "Emily Thompson",
    email: "emily.t@email.com",
    phone: "(407) 555-3456",
    unitNumber: "4",
    balance: 75,
    status: "overdue"
  },
  // Add more tenants to match site map data
  {
    id: "5",
    name: "David Wilson",
    email: "david.w@email.com",
    phone: "(407) 555-4567",
    unitNumber: "5",
    balance: 0,
    status: "current"
  },
  {
    id: "7",
    name: "Jennifer Martinez",
    email: "jennifer.m@email.com",
    phone: "(407) 555-5678",
    unitNumber: "7",
    balance: 310,
    status: "delinquent"
  }
  // ... continue with all occupied units
];

const getStatusColor = (status: Customer["status"]) => {
  switch (status) {
    case "current":
      return "success";
    case "overdue":
      return "warning";
    case "delinquent":
      return "destructive";
    default:
      return "default";
  }
};

export default function TenantsPage() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTenants, setFilteredTenants] = useState(mockTenants);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = mockTenants.filter(tenant => 
      tenant.name.toLowerCase().includes(value.toLowerCase()) ||
      tenant.email.toLowerCase().includes(value.toLowerCase()) ||
      tenant.unitNumber.includes(value)
    );
    setFilteredTenants(filtered);
  };

  return (
    <ManagerLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">All Tenants</h1>
          <p className="text-muted-foreground">
            {filteredTenants.length} total tenants
          </p>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              className="pl-9"
              placeholder="Search by name, email or unit number"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Button variant="outline">Export</Button>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit</TableHead>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenants.map((tenant) => (
                <TableRow 
                  key={tenant.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/manager/tenant/${tenant.id}`)}
                >
                  <TableCell>{tenant.unitNumber}</TableCell>
                  <TableCell className="font-medium">{tenant.name}</TableCell>
                  <TableCell>{tenant.email}</TableCell>
                  <TableCell>{tenant.phone}</TableCell>
                  <TableCell>${tenant.balance.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(tenant.status)}>
                      {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </ManagerLayout>
  );
}