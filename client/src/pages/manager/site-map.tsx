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
import { useQuery } from "@tanstack/react-query";
import { Unit, Customer, Booking, Payment } from "@shared/schema";

function UnitCell({ unit }: { unit: Unit }) {
  const [, navigate] = useLocation();

  const handleClick = () => {
    if (unit.isOccupied) {
      navigate(`/manager/tenant/${unit.id}`);
    }
  };

  const getStatusColor = (isOccupied: boolean) => {
    if (isOccupied) {
      return "bg-blue-100 hover:bg-blue-200";
    }
    return "bg-emerald-100 hover:bg-emerald-200";
  };

  return (
    <HoverCard>
      <HoverCardTrigger>
        <div
          className={`
            p-4 border rounded-md cursor-pointer transition-all
            ${getStatusColor(unit.isOccupied)}
            flex items-center justify-center
            ${unit.isOccupied ? 'hover:scale-105' : ''}
          `}
          onClick={handleClick}
        >
          <span className="text-lg font-bold">{unit.location}</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4">
        <div className="space-y-4">
          {/* Unit Header */}
          <div className="text-2xl font-semibold border-b pb-2">
            {unit.location} - {unit.size}
          </div>

          {/* Unit Information */}
          <div className="space-y-1">
            <div className="text-lg text-muted-foreground">Unit</div>
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="font-medium capitalize">{unit.type}</span>
            </div>
            <div className="flex justify-between">
              <span>Size:</span>
              <span className="font-medium">{unit.size}</span>
            </div>
            <div className="flex justify-between">
              <span>Price:</span>
              <span className="font-medium">${unit.price}/month</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <Badge variant={unit.isOccupied ? "default" : "secondary"}>
                {unit.isOccupied ? "Occupied" : "Available"}
              </Badge>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export default function SiteMapPage() {
  const [isEditing, setIsEditing] = useState(false);
  const { data: units, isLoading } = useQuery<Unit[]>({
    queryKey: ["/api/units"],
  });

  const handleSave = () => {
    setIsEditing(false);
    // Save changes to the backend
  };

  // Calculate stats based on actual unit data
  const stats = units ? [
    { 
      count: units.filter(u => !u.isOccupied).length, 
      label: "Available", 
      dotColor: "bg-emerald-400" 
    },
    { 
      count: units.filter(u => u.isOccupied).length, 
      label: "Occupied", 
      dotColor: "bg-blue-400" 
    }
  ] : [];

  // Calculate the grid layout
  const calculateGridCols = (unitCount: number) => {
    if (unitCount <= 4) return 4;
    if (unitCount <= 6) return 3;
    return Math.min(Math.ceil(Math.sqrt(unitCount)), 10); // max 10 columns
  };

  const gridCols = units ? calculateGridCols(units.length) : 4;

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
          {isLoading ? (
            <div className="text-center py-4">Loading units...</div>
          ) : !units?.length ? (
            <div className="text-center py-4">No units found</div>
          ) : (
            <div className="space-y-4 bg-accent/10 rounded-lg p-4">
              <div 
                className={`grid gap-2`} 
                style={{ 
                  gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`
                }}
              >
                {units.map((unit) => (
                  <div key={unit.id}>
                    <UnitCell unit={unit} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </ManagerLayout>
  );
}