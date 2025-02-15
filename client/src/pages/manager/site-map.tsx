import { useState } from "react";
import { ManagerLayout } from "@/components/manager-layout";
import { useQuery } from "@tanstack/react-query";
import { FacilityLayout, Unit } from "@shared/schema";
import { useFacility } from "@/lib/facility-context";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type UnitStatus = "available" | "occupied" | "reserved" | "maintenance";

interface GridCellProps {
  unit?: Unit;
  status?: UnitStatus;
  size?: string;
  onClick?: () => void;
}

function GridCell({ unit, status = "available", size = "small" }: GridCellProps) {
  const statusColors = {
    available: "bg-green-100 border-green-200",
    occupied: "bg-red-100 border-red-200",
    reserved: "bg-yellow-100 border-yellow-200",
    maintenance: "bg-gray-100 border-gray-200"
  };

  return (
    <div
      className={`
        p-2 border-2 rounded-md cursor-pointer transition-all
        hover:shadow-md ${statusColors[status]}
        ${size === "large" ? "col-span-2 row-span-2" : ""}
      `}
    >
      {unit && (
        <div className="text-xs">
          <div className="font-semibold">{unit.type}</div>
          <div>{unit.size}</div>
          <Badge variant="outline" className="mt-1">
            {status}
          </Badge>
        </div>
      )}
    </div>
  );
}

export default function SiteMapPage() {
  const { selectedFacility } = useFacility();
  const [selectedLayout, setSelectedLayout] = useState<string>("");

  const { data: layouts } = useQuery<FacilityLayout[]>({
    queryKey: ["/api/facility-layouts", selectedFacility],
  });

  const { data: units } = useQuery<Unit[]>({
    queryKey: ["/api/units"],
  });

  const currentLayout = layouts?.find(l => l.id.toString() === selectedLayout);

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
          <Select value={selectedLayout} onValueChange={setSelectedLayout}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select layout" />
            </SelectTrigger>
            <SelectContent>
              {layouts?.map(layout => (
                <SelectItem key={layout.id} value={layout.id.toString()}>
                  {layout.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {currentLayout ? (
          <Card className="p-6">
            <div className="aspect-video bg-accent/10 rounded-lg p-4">
              <div 
                className="grid gap-2" 
                style={{
                  gridTemplateColumns: `repeat(${currentLayout.dimensions.width}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${currentLayout.dimensions.height}, minmax(0, 1fr))`,
                }}
              >
                {currentLayout.layout.map((cell: any, index: number) => {
                  const unit = units?.find(u => u.id === cell.unitId);
                  return (
                    <GridCell
                      key={index}
                      unit={unit}
                      status={unit?.isOccupied ? "occupied" : "available"}
                      size={cell.size}
                    />
                  );
                })}
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="text-center text-muted-foreground">
              Select a layout to view the site map
            </div>
          </Card>
        )}
      </div>
    </ManagerLayout>
  );
}
