import { ManagerLayout } from "@/components/manager-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Unit, Booking } from "@shared/schema";
import { DollarSign, Users, BoxSelect, AlertCircle } from "lucide-react";

export default function ManagerHome() {
  const { data: units } = useQuery<Unit[]>({
    queryKey: ["/api/units"],
  });

  const { data: bookings } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  const stats = {
    totalUnits: units?.length ?? 0,
    occupiedUnits: units?.filter(u => u.isOccupied).length ?? 0,
    activeBookings: bookings?.filter(b => b.status === "active").length ?? 0,
    monthlyRevenue: units?.reduce((sum, unit) => 
      unit.isOccupied ? sum + unit.price : sum, 0
    ) ?? 0
  };

  return (
    <ManagerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">Here's what's happening at your facility today.</p>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.monthlyRevenue}/mo</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeBookings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <BoxSelect className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalUnits ? 
                  Math.round((stats.occupiedUnits / stats.totalUnits) * 100) : 0}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Units</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalUnits - stats.occupiedUnits}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ManagerLayout>
  );
}
