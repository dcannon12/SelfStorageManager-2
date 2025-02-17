import { useState } from "react";
import { ManagerLayout } from "@/components/manager-layout";
import { useQuery } from "@tanstack/react-query";
import { FacilityLayout, Unit, Customer } from "@shared/schema";
import { useFacility } from "@/lib/facility-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UnitHoverCard } from "@/components/unit-hover-card";
import { useLocation } from "wouter";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Save, Palette } from "lucide-react";

type UnitStatus = "available" | "occupied" | "reserved" | "maintenance";

interface StatusColors {
  available: string;
  occupied: string;
  reserved: string;
  maintenance: string;
}

interface GridCellProps {
  unit?: Unit;
  tenant?: Customer;
  status?: UnitStatus;
  size?: string;
  isEditing?: boolean;
  onClick?: () => void;
  ongoingSince?: string;
  statusColors: StatusColors;
}

function GridCell({
  unit,
  tenant,
  status = "available",
  size = "small",
  isEditing,
  onClick,
  ongoingSince,
  statusColors
}: GridCellProps) {
  const [, setLocation] = useLocation();

  const getStatusColor = (status: UnitStatus) => {
    return {
      available: statusColors.available,
      occupied: statusColors.occupied,
      reserved: statusColors.reserved,
      maintenance: statusColors.maintenance
    }[status];
  };

  const handleClick = () => {
    if (isEditing) {
      onClick?.();
    } else if (tenant) {
      setLocation(`/manager/tenant/${tenant.id}`);
    }
  };

  const content = (
    <div
      onClick={handleClick}
      className={`
        p-2 border-2 rounded-md cursor-pointer transition-all
        ${isEditing ? 'hover:border-primary' : getStatusColor(status)}
        ${size === "large" ? "col-span-2 row-span-2" : ""}
        ${!isEditing && tenant ? 'hover:scale-105' : ''}
      `}
    >
      {unit && (
        <div className="text-xs">
          <div className="font-bold text-sm mb-1">Unit {unit.id}</div>
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

  return tenant ? (
    <UnitHoverCard tenant={tenant} ongoingSince={ongoingSince}>
      {content}
    </UnitHoverCard>
  ) : content;
}

export default function SiteMapPage() {
  const { selectedFacility } = useFacility();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 10, height: 10 });
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false);
  const [statusColors, setStatusColors] = useState<StatusColors>({
    available: "bg-green-100 border-green-200",
    occupied: "bg-red-100 border-red-200",
    reserved: "bg-yellow-100 border-yellow-200",
    maintenance: "bg-gray-100 border-gray-200"
  });

  const { data: layouts } = useQuery<FacilityLayout[]>({
    queryKey: ["/api/facility-layouts", selectedFacility],
  });

  const { data: units } = useQuery<Unit[]>({
    queryKey: ["/api/units"],
  });

  const { data: customers } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const { data: bookings } = useQuery<any[]>({
    queryKey: ["/api/bookings"],
  });

  const currentLayout = layouts?.[0];

  // Calculate unit statistics
  const stats = {
    available: units?.filter(u => !u.isOccupied).length ?? 0,
    occupied: units?.filter(u => u.isOccupied).length ?? 0,
    overlocked: 0,
    unrentable: 0,
    overdue: 0
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  // Helper function to get tenant details for a unit
  const getTenantDetails = (unitId: number) => {
    const booking = bookings?.find(b => b.unitId === unitId && b.status === "active");
    if (!booking) return null;

    const tenant = customers?.find(c => c.id === booking.customerId);
    if (!tenant) return null;

    return {
      tenant,
      ongoingSince: booking.startDate
    };
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
            <Button
              variant="outline"
              onClick={() => setIsColorDialogOpen(true)}
            >
              <Palette className="h-4 w-4 mr-2" />
              Unit Colors
            </Button>
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
        <div className="grid grid-cols-5 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            <div className="text-sm text-muted-foreground">Available Units</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.occupied}</div>
            <div className="text-sm text-muted-foreground">Occupied Units</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.overlocked}</div>
            <div className="text-sm text-muted-foreground">Overlocked Units</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.unrentable}</div>
            <div className="text-sm text-muted-foreground">Unrentable Units</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-sm text-muted-foreground">Overdue Units</div>
          </Card>
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
              {units?.map((unit, index) => {
                const tenantInfo = getTenantDetails(unit.id);

                return (
                  <GridCell
                    key={index}
                    unit={unit}
                    tenant={tenantInfo?.tenant}
                    ongoingSince={tenantInfo?.ongoingSince}
                    status={unit.isOccupied ? "occupied" : "available"}
                    isEditing={isEditing}
                    onClick={() => isEditing && setSelectedCell(index)}
                    statusColors={statusColors}
                  />
                );
              })}
            </div>
          </div>
        </Card>

        {/* Color Customization Dialog */}
        <Dialog open={isColorDialogOpen} onOpenChange={setIsColorDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Customize Unit Status Colors</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Available Units</label>
                <Input
                  value={statusColors.available}
                  onChange={(e) => setStatusColors(prev => ({
                    ...prev,
                    available: e.target.value
                  }))}
                  placeholder="e.g. bg-green-100 border-green-200"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Occupied Units</label>
                <Input
                  value={statusColors.occupied}
                  onChange={(e) => setStatusColors(prev => ({
                    ...prev,
                    occupied: e.target.value
                  }))}
                  placeholder="e.g. bg-red-100 border-red-200"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Reserved Units</label>
                <Input
                  value={statusColors.reserved}
                  onChange={(e) => setStatusColors(prev => ({
                    ...prev,
                    reserved: e.target.value
                  }))}
                  placeholder="e.g. bg-yellow-100 border-yellow-200"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Maintenance Units</label>
                <Input
                  value={statusColors.maintenance}
                  onChange={(e) => setStatusColors(prev => ({
                    ...prev,
                    maintenance: e.target.value
                  }))}
                  placeholder="e.g. bg-gray-100 border-gray-200"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsColorDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {isEditing && selectedCell !== null && (
          <Drawer open={selectedCell !== null} onOpenChange={() => setSelectedCell(null)}>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Edit Unit</DrawerTitle>
              </DrawerHeader>
              <div className="p-4 space-y-4">
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