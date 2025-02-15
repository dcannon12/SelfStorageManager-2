import { ManagerLayout } from "@/components/manager-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Unit, Booking } from "@shared/schema";

export default function ManagerDashboard() {
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
  };

  return (
    <ManagerLayout>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Units</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalUnits}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Occupied Units</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.occupiedUnits}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.activeBookings}</p>
          </CardContent>
        </Card>
      </div>
    </ManagerLayout>
  );
}
