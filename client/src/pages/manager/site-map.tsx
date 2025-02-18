import { useState } from "react";
import { ManagerLayout } from "@/components/manager-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Save } from "lucide-react";

interface Unit {
  number: string;
  status: "available" | "occupied" | "reserved" | "maintenance" | "parking";
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
      return ""; // Handle unknown statuses
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

// Mock data - this would come from your API in a real app
const mockUnits: Unit[] = [
  { number: "129", status: "occupied" },
  { number: "128", status: "occupied" },
  { number: "127", status: "available" },
  { number: "126", status: "available" },
  { number: "125", status: "available" },
  { number: "124", status: "available" },
  { number: "123", status: "occupied" },
  { number: "122", status: "available" },
  { number: "121", status: "occupied" },
  { number: "120", status: "occupied" },
  // Add more units as needed
];

function UnitCell({ unit }: { unit: Unit }) {
  return (
    <div 
      className={`
        p-4 border rounded-md cursor-pointer transition-all
        ${getStatusColor(unit.status)}
        flex items-center justify-center
      `}
    >
      <span className="text-lg font-bold">{unit.number}</span>
    </div>
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
          <div className="aspect-[2/1] bg-accent/10 rounded-lg p-4">
            <div 
              className="grid grid-cols-10 gap-2 h-full"
            >
              {mockUnits.map((unit, index) => (
                <UnitCell key={unit.number} unit={unit} />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </ManagerLayout>
  );
}