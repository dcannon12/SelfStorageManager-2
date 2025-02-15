import { useState } from "react";
import { ManagerLayout } from "@/components/manager-layout";
import { useQuery } from "@tanstack/react-query";
import { FacilityLayout, Unit } from "@shared/schema";
import { useFacility } from "@/lib/facility-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Save } from "lucide-react";
import { Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UnitStatus = "available" | "occupied" | "reserved" | "maintenance";

interface GridCellProps {
  unit?: Unit;
  status?: UnitStatus;
  size?: string;
  isEditing?: boolean;
  onClick?: () => void;
}

function GridCell({ unit, status = "available", size = "small", isEditing, onClick }: GridCellProps) {
  const statusColors = {
    available: "bg-green-100 border-green-200",
    occupied: "bg-red-100 border-red-200",
    reserved: "bg-yellow-100 border-yellow-200",
    maintenance: "bg-gray-100 border-gray-200"
  };

  return (
    <div
      onClick={onClick}
      className={`
        p-2 border-2 rounded-md cursor-pointer transition-all
        ${isEditing ? 'hover:border-primary' : statusColors[status]}
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
      {isEditing && !unit && (
        <div className="flex items-center justify-center h-full">
          <Plus className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

export default function SiteMapPage() {
  const { selectedFacility } = useFacility();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 10, height: 10 });
  const [selectedLayout, setSelectedLayout] = useState<string>("");

  const { data: layouts } = useQuery<FacilityLayout[]>({
    queryKey: ["/api/facility-layouts", selectedFacility],
  });

  const { data: units } = useQuery<Unit[]>({
    queryKey: ["/api/units"],
  });

  const currentLayout = layouts?.[0]; // Default to first layout for now

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false);
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
          {isEditing ? (
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Layout
            </Button>
          )}
        </div>

        <Card className="p-6">
          {isEditing && (
            <div className="mb-4 flex items-center gap-4">
              <div>
                <label className="text-sm font-medium">Width</label>
                <Input
                  type="number"
                  value={dimensions.width}
                  onChange={(e) => setDimensions(prev => ({ ...prev, width: parseInt(e.target.value) || 1 }))}
                  className="w-20"
                  min={1}
                  max={20}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Height</label>
                <Input
                  type="number"
                  value={dimensions.height}
                  onChange={(e) => setDimensions(prev => ({ ...prev, height: parseInt(e.target.value) || 1 }))}
                  className="w-20"
                  min={1}
                  max={20}
                />
              </div>
            </div>
          )}

          <div className="aspect-video bg-accent/10 rounded-lg p-4">
            <div 
              className="grid gap-2" 
              style={{
                gridTemplateColumns: `repeat(${dimensions.width}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${dimensions.height}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: dimensions.width * dimensions.height }).map((_, index) => {
                const existingCell = currentLayout?.layout[index];
                const unit = existingCell ? units?.find(u => u.id === existingCell.unitId) : undefined;

                return (
                  <GridCell
                    key={index}
                    unit={unit}
                    status={unit?.isOccupied ? "occupied" : "available"}
                    isEditing={isEditing}
                    onClick={() => isEditing && setSelectedCell(index)}
                  />
                );
              })}
            </div>
          </div>
        </Card>

        {isEditing && selectedCell !== null && (
          <Drawer open={selectedCell !== null} onOpenChange={() => setSelectedCell(null)}>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Edit Unit</DrawerTitle>
              </DrawerHeader>
              <div className="p-4 space-y-4">
                {/* TODO: Add unit editing form */}
                <p className="text-sm text-muted-foreground">
                  Unit editing coming soon...
                </p>
              </div>
              <DrawerFooter>
                <Button onClick={() => setSelectedCell(null)}>Done</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </ManagerLayout>
  );
}