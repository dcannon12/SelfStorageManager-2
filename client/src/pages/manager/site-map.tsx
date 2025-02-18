import { useState } from "react";
import { ManagerLayout } from "@/components/manager-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Save } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

interface Customer {
  name: string;
  cellPhone: string;
  plan: {
    amount: number;
    frequency: string;
  };
  totalBalance: number;
}

interface Unit {
  number: string;
  status: "available" | "occupied" | "reserved" | "maintenance" | "parking";
  size: string;
  unitBalance: number;
  customer?: Customer;
}

const getStatusColor = (status: Unit["status"]) => {
  switch (status) {
    case "available":
      return "bg-emerald-100 hover:bg-emerald-200";
    case "occupied":
      return "bg-blue-100 hover:bg-blue-200";
    case "reserved":
      return "bg-yellow-100 hover:bg-yellow-200";
    case "maintenance":
      return "bg-gray-100 hover:bg-gray-200";
    case "parking":
      return "bg-orange-100 hover:bg-orange-200";
    default:
      return "";
  }
};

// Mock data for the statistics
const stats = [
  { count: 8, label: "Available", dotColor: "bg-emerald-400" },
  { count: 15, label: "Occupied", dotColor: "bg-blue-400" },
  { count: 3, label: "Overlocked", dotColor: "bg-red-400" },
  { count: 2, label: "Unrentable", dotColor: "bg-gray-400" },
  { count: 3, label: "Overdue", dotColor: "bg-yellow-400" },
];

// Updated mock data with 31 units and realistic tenant information
const mockUnits: Unit[][] = [
  // Row 1 (1-10)
  [
    {
      number: "1",
      status: "occupied",
      size: "10 x 20",
      unitBalance: 150,
      customer: {
        name: "Sarah Anderson",
        cellPhone: "(407) 555-1234",
        plan: { amount: 155.00, frequency: "Each Month" },
        totalBalance: 150.00
      }
    },
    {
      number: "2",
      status: "occupied",
      size: "10 x 20",
      unitBalance: 0,
      customer: {
        name: "Michael Rodriguez",
        cellPhone: "(407) 555-2345",
        plan: { amount: 155.00, frequency: "Each Month" },
        totalBalance: 0
      }
    },
    { number: "3", status: "available", size: "10 x 20", unitBalance: 0 },
    {
      number: "4",
      status: "occupied",
      size: "10 x 20",
      unitBalance: 75,
      customer: {
        name: "Emily Thompson",
        cellPhone: "(407) 555-3456",
        plan: { amount: 155.00, frequency: "Each Month" },
        totalBalance: 75
      }
    },
    {
      number: "5",
      status: "occupied",
      size: "10 x 20",
      unitBalance: 0,
      customer: {
        name: "David Wilson",
        cellPhone: "(407) 555-4567",
        plan: { amount: 155.00, frequency: "Each Month" },
        totalBalance: 0
      }
    },
    { number: "6", status: "maintenance", size: "10 x 20", unitBalance: 0 },
    {
      number: "7",
      status: "occupied",
      size: "10 x 20",
      unitBalance: 310,
      customer: {
        name: "Jennifer Martinez",
        cellPhone: "(407) 555-5678",
        plan: { amount: 155.00, frequency: "Each Month" },
        totalBalance: 310
      }
    },
    { number: "8", status: "available", size: "10 x 20", unitBalance: 0 },
    {
      number: "9",
      status: "occupied",
      size: "10 x 20",
      unitBalance: 0,
      customer: {
        name: "Robert Taylor",
        cellPhone: "(407) 555-6789",
        plan: { amount: 155.00, frequency: "Each Month" },
        totalBalance: 0
      }
    },
    {
      number: "10",
      status: "occupied",
      size: "10 x 20",
      unitBalance: 155,
      customer: {
        name: "Lisa Johnson",
        cellPhone: "(407) 555-7890",
        plan: { amount: 155.00, frequency: "Each Month" },
        totalBalance: 155
      }
    },
  ],
  // Row 2 (11-20)
  [
    { number: "11", status: "available", size: "10 x 20", unitBalance: 0 },
    {
      number: "12",
      status: "occupied",
      size: "10 x 20",
      unitBalance: 0,
      customer: {
        name: "Christopher Lee",
        cellPhone: "(407) 555-8901",
        plan: { amount: 155.00, frequency: "Each Month" },
        totalBalance: 0
      }
    },
    {
      number: "13",
      status: "occupied",
      size: "10 x 20",
      unitBalance: 465,
      customer: {
        name: "Amanda White",
        cellPhone: "(407) 555-9012",
        plan: { amount: 155.00, frequency: "Each Month" },
        totalBalance: 465
      }
    },
    { number: "14", status: "available", size: "10 x 20", unitBalance: 0 },
    {
      number: "15",
      status: "occupied",
      size: "10 x 20",
      unitBalance: 0,
      customer: {
        name: "Kevin Brown",
        cellPhone: "(407) 555-0123",
        plan: { amount: 155.00, frequency: "Each Month" },
        totalBalance: 0
      }
    },
    { number: "16", status: "available", size: "10 x 20", unitBalance: 0 },
    {
      number: "17",
      status: "occupied",
      size: "10 x 20",
      unitBalance: 155,
      customer: {
        name: "Michelle Davis",
        cellPhone: "(407) 555-1234",
        plan: { amount: 155.00, frequency: "Each Month" },
        totalBalance: 155
      }
    },
    {
      number: "18",
      status: "occupied",
      size: "10 x 20",
      unitBalance: 0,
      customer: {
        name: "Daniel Garcia",
        cellPhone: "(407) 555-2345",
        plan: { amount: 155.00, frequency: "Each Month" },
        totalBalance: 0
      }
    },
    { number: "19", status: "available", size: "10 x 20", unitBalance: 0 },
    {
      number: "20",
      status: "occupied",
      size: "10 x 20",
      unitBalance: 310,
      customer: {
        name: "Rachel Miller",
        cellPhone: "(407) 555-3456",
        plan: { amount: 155.00, frequency: "Each Month" },
        totalBalance: 310
      }
    },
  ],
  // Row 3 (21-31)
  [
    { number: "21", status: "available", size: "10 x 20", unitBalance: 0 },
    {
      number: "22",
      status: "occupied",
      size: "10 x 20",
      unitBalance: 0,
      customer: {
        name: "Thomas Anderson",
        cellPhone: "(407) 555-4567",
        plan: { amount: 155.00, frequency: "Each Month" },
        totalBalance: 0
      }
    },
    { number: "23", status: "maintenance", size: "10 x 20", unitBalance: 0 },
    { number: "24", status: "available", size: "10 x 20", unitBalance: 0 },
    {
      number: "25",
      status: "occupied",
      size: "10 x 20",
      unitBalance: 155,
      customer: {
        name: "Jessica Martinez",
        cellPhone: "(407) 555-5678",
        plan: { amount: 155.00, frequency: "Each Month" },
        totalBalance: 155
      }
    },
    {
      number: "26",
      status: "occupied",
      size: "10 x 20",
      unitBalance: 0,
      customer: {
        name: "William Turner",
        cellPhone: "(407) 555-6789",
        plan: { amount: 155.00, frequency: "Each Month" },
        totalBalance: 0
      }
    },
    {
      number: "27",
      status: "occupied",
      size: "10 x 20",
      unitBalance: 465,
      customer: {
        name: "Nicole Parker",
        cellPhone: "(407) 555-7890",
        plan: { amount: 155.00, frequency: "Each Month" },
        totalBalance: 465
      }
    },
    {
      number: "28",
      status: "occupied",
      size: "10 x 20",
      unitBalance: 0,
      customer: {
        name: "James Wilson",
        cellPhone: "(407) 555-8901",
        plan: { amount: 155.00, frequency: "Each Month" },
        totalBalance: 0
      }
    },
    {
      number: "29",
      status: "occupied",
      size: "10 x 20",
      unitBalance: 155,
      customer: {
        name: "Patricia Harris",
        cellPhone: "(407) 555-9012",
        plan: { amount: 155.00, frequency: "Each Month" },
        totalBalance: 155
      }
    },
    {
      number: "30",
      status: "occupied",
      size: "10 x 20",
      unitBalance: 0,
      customer: {
        name: "Steven Clark",
        cellPhone: "(407) 555-0123",
        plan: { amount: 155.00, frequency: "Each Month" },
        totalBalance: 0
      }
    },
    {
      number: "31",
      status: "occupied",
      size: "10 x 20",
      unitBalance: 310,
      customer: {
        name: "Maria Rodriguez",
        cellPhone: "(407) 555-1234",
        plan: { amount: 155.00, frequency: "Each Month" },
        totalBalance: 310
      }
    },
  ],
];

function UnitCell({ unit }: { unit: Unit }) {
  const [, navigate] = useLocation();

  const handleClick = () => {
    if (unit.customer) {
      // Navigate to tenant details using the same route as tenants page
      navigate(`/manager/tenant/${unit.number}`);
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger>
        <div
          className={`
            p-4 border rounded-md cursor-pointer transition-all
            ${getStatusColor(unit.status)}
            flex items-center justify-center
            ${unit.customer ? 'hover:scale-105' : ''}
          `}
          onClick={handleClick}
        >
          <span className="text-lg font-bold">{unit.number}</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4">
        <div className="space-y-4">
          {/* Unit Header */}
          <div className="text-2xl font-semibold border-b pb-2">
            {unit.number} - {unit.size}
          </div>

          {/* Unit Information */}
          <div className="space-y-1">
            <div className="text-lg text-muted-foreground">Unit</div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-medium">
                {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Unit Balance:</span>
              <span className="font-medium">${unit.unitBalance.toFixed(2)}</span>
            </div>
          </div>

          {/* Customer Information */}
          {unit.customer && (
            <>
              <div className="space-y-1">
                <div className="text-lg text-muted-foreground">Customer</div>
                <div className="flex justify-between">
                  <span>Name:</span>
                  <span className="font-medium">{unit.customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cell Phone:</span>
                  <span className="font-medium">{unit.customer.cellPhone}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Plan:</span>
                  <span className="font-medium">
                    ${unit.customer.plan.amount.toFixed(2)}{" "}
                    {unit.customer.plan.frequency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Balance:</span>
                  <span className="font-medium">
                    ${unit.customer.totalBalance.toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export default function SiteMapPage() {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // Save changes to the backend
  };

  return (
    <ManagerLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Site Map</h1>
            <p className="text-muted-foreground">
              View and manage facility layout
            </p>
          </div>
          <div className="space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Layout
              </Button>
            )}
          </div>
        </div>

        {/* Unit Statistics */}
        <div className="flex gap-4 mb-6 flex-wrap">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-2 px-4 py-2 bg-background rounded-full border"
            >
              <div className={`w-2 h-2 rounded-full ${stat.dotColor}`} />
              <span className="font-medium">{stat.count}</span>
              <span className="text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>

        <Card className="p-6">
          <div className="space-y-4 bg-accent/10 rounded-lg p-4">
            {mockUnits.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-10 gap-2">
                {row.map((unit) => (
                  <div key={unit.number} className="col-span-1">
                    <UnitCell unit={unit} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ManagerLayout>
  );
}