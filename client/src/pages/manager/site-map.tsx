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
  { count: 11, label: "Available", dotColor: "bg-emerald-400" },
  { count: 159, label: "Occupied", dotColor: "bg-blue-400" },
  { count: 10, label: "Overlocked", dotColor: "bg-red-400" },
  { count: 9, label: "Unrentable", dotColor: "bg-gray-400" },
  { count: 20, label: "Overdue", dotColor: "bg-yellow-400" },
];

// Updated mock data with customer information
const mockUnits: Unit[][] = [
  // Top row (191-200)
  [
    {
      number: "191",
      status: "occupied",
      size: "10 x 20",
      unitBalance: 0,
      customer: {
        name: "Lorenzo Mccutchen, Jr",
        cellPhone: "(863) 698-3301",
        plan: { amount: 155.00, frequency: "Each Month" },
        totalBalance: 0.00
      }
    },
    { number: "192", status: "maintenance", size: "10 x 20", unitBalance: 0 },
    { number: "193", status: "occupied", size: "10 x 20", unitBalance: 100, customer: { name: "Jane Doe", cellPhone: "555-1234", plan: { amount: 100, frequency: "Monthly" }, totalBalance: 100 } },
    { number: "194", status: "available", size: "10 x 20", unitBalance: 0 },
    { number: "195", status: "occupied", size: "10 x 20", unitBalance: 50, customer: { name: "John Smith", cellPhone: "555-5678", plan: { amount: 50, frequency: "Monthly" }, totalBalance: 50 } },
    { number: "196", status: "occupied", size: "10 x 20", unitBalance: 200, customer: { name: "Alice Johnson", cellPhone: "555-9012", plan: { amount: 200, frequency: "Monthly" }, totalBalance: 200 } },
    { number: "197", status: "occupied", size: "10 x 20", unitBalance: 0, customer: { name: "Bob Williams", cellPhone: "555-3456", plan: { amount: 0, frequency: "Monthly" }, totalBalance: 0 } },
    { number: "198", status: "parking", size: "10 x 20", unitBalance: 0 },
    { number: "199", status: "occupied", size: "10 x 20", unitBalance: 0, customer: { name: "Charlie Brown", cellPhone: "555-7890", plan: { amount: 0, frequency: "Monthly" }, totalBalance: 0 } },
    { number: "200", status: "occupied", size: "10 x 20", unitBalance: 0, customer: { name: "David Lee", cellPhone: "555-2345", plan: { amount: 0, frequency: "Monthly" }, totalBalance: 0 } },
  ],
  // Middle row (180-190)
  [
    { number: "190", status: "occupied", size: "10 x 20", unitBalance: 0 },
    { number: "189", status: "occupied", size: "10 x 20", unitBalance: 0 },
    { number: "188", status: "occupied", size: "10 x 20", unitBalance: 0 },
    { number: "187", status: "occupied", size: "10 x 20", unitBalance: 0 },
    { number: "186", status: "occupied", size: "10 x 20", unitBalance: 0 },
    { number: "185", status: "occupied", size: "10 x 20", unitBalance: 0 },
    { number: "184", status: "available", size: "10 x 20", unitBalance: 0 },
    { number: "183", status: "available", size: "10 x 20", unitBalance: 0 },
    { number: "182", status: "available", size: "10 x 20", unitBalance: 0 },
    { number: "181", status: "available", size: "10 x 20", unitBalance: 0 },
  ],
  // Bottom row (169-179)
  [
    { number: "169", status: "occupied", size: "10 x 20", unitBalance: 0 },
    { number: "170", status: "occupied", size: "10 x 20", unitBalance: 0 },
    { number: "171", status: "occupied", size: "10 x 20", unitBalance: 0 },
    { number: "172", status: "occupied", size: "10 x 20", unitBalance: 0 },
    { number: "173", status: "occupied", size: "10 x 20", unitBalance: 0 },
    { number: "174", status: "occupied", size: "10 x 20", unitBalance: 0 },
    { number: "175", status: "parking", size: "10 x 20", unitBalance: 0 },
    { number: "176", status: "available", size: "10 x 20", unitBalance: 0 },
    { number: "177", status: "available", size: "10 x 20", unitBalance: 0 },
    { number: "178", status: "available", size: "10 x 20", unitBalance: 0 },
    { number: "179", status: "available", size: "10 x 20", unitBalance: 0 },
  ],
];

function UnitCell({ unit }: { unit: Unit }) {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <div
          className={`
            p-4 border rounded-md cursor-pointer transition-all
            ${getStatusColor(unit.status)}
            flex items-center justify-center
          `}
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
                    ${unit.customer.plan.amount.toFixed(2)} {unit.customer.plan.frequency}
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