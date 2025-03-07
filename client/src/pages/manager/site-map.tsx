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
import { Unit, Customer } from "@shared/schema";

function UnitCell({ unit }: { unit: Unit }) {
  const [, navigate] = useLocation();
  const { data: customers } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  // Get tenant from unit's customer_id
  const tenant = unit.customerId ? customers?.find(c => c.id === unit.customerId) : null;

  const handleClick = () => {
    if (unit.isOccupied && tenant) {
      navigate(`/manager/tenant/${tenant.id}`);
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger>
        <div
          className={`
            p-4 border rounded-md cursor-pointer transition-all
            ${unit.isOccupied ? 'bg-blue-100 hover:bg-blue-200' : 'bg-emerald-100 hover:bg-emerald-200'}
            flex items-center justify-center text-center
            ${unit.isOccupied && tenant ? 'hover:scale-105' : ''}
          `}
          onClick={handleClick}
        >
          <div>
            <div className="text-lg font-bold">Unit {unit.unit_id}</div>
            {tenant && <div className="text-sm text-muted-foreground">{tenant.name}</div>}
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4">
        <div className="space-y-4">
          <div className="text-2xl font-semibold border-b pb-2">
            Unit {unit.unit_id}
          </div>

          <div className="space-y-1">
            <div className="text-lg text-muted-foreground">Unit Details</div>
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

          {tenant && (
            <div className="space-y-1">
              <div className="text-lg text-muted-foreground">Current Tenant</div>
              <div className="flex justify-between">
                <span>Name:</span>
                <span className="font-medium">{tenant.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="font-medium">{tenant.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <span className="font-medium">{tenant.phone}</span>
              </div>
            </div>
          )}
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
  };

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

  const calculateGridCols = (unitCount: number) => {
    if (unitCount <= 4) return 2;
    if (unitCount <= 9) return 3;
    return Math.min(Math.ceil(Math.sqrt(unitCount)), 6);
  };

  const gridCols = units ? calculateGridCols(units.length) : 4;

  return (
    <ManagerLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Site Map</h1>
            <p className="text-muted-foreground">
              Interactive facility layout map
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
                className={`grid gap-4`} 
                style={{ 
                  gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`
                }}
              >
                {units.map((unit) => (
                  <div key={unit.unit_id}>
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