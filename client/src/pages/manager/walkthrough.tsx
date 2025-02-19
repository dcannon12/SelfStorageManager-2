import { ManagerLayout } from "@/components/manager-layout";
import { useQuery } from "@tanstack/react-query";
import { Unit, Customer, Booking, Payment } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Lock, AlertTriangle } from "lucide-react";

export default function WalkthroughPage() {
  // Fetch all necessary data
  const { data: units } = useQuery<Unit[]>({
    queryKey: ["/api/units"],
  });

  const { data: customers } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const { data: bookings } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  const { data: payments } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });

  // Calculate days late for each booking
  const calculateDaysLate = (booking: Booking) => {
    const nextBillDate = new Date(booking.nextBillDate);
    const today = new Date();
    const diffTime = today.getTime() - nextBillDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Sort units by number (extracted from location)
  const sortedUnits = [...(units || [])].sort((a, b) => {
    const numA = parseInt(a.location.match(/\d+/)?.[0] || "0");
    const numB = parseInt(b.location.match(/\d+/)?.[0] || "0");
    return numA - numB;
  });

  return (
    <ManagerLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Facility Walkthrough</h1>
          <p className="text-muted-foreground">
            Inspection checklist for all units
          </p>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Days Late</TableHead>
                <TableHead>Lock Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUnits.map((unit) => {
                const booking = bookings?.find(
                  (b) => b.unitId === unit.id && b.status === "active"
                );
                const customer = booking
                  ? customers?.find((c) => c.id === booking.customerId)
                  : null;
                const daysLate = booking ? calculateDaysLate(booking) : 0;

                return (
                  <TableRow key={unit.id}>
                    <TableCell className="font-medium">
                      {unit.location}
                    </TableCell>
                    <TableCell>{unit.size}</TableCell>
                    <TableCell>
                      <Badge
                        variant={unit.isOccupied ? "default" : "secondary"}
                      >
                        {unit.isOccupied ? "Occupied" : "Vacant"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {customer?.name || "N/A"}
                    </TableCell>
                    <TableCell>
                      {daysLate > 0 ? (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {daysLate} days
                        </Badge>
                      ) : (
                        "Current"
                      )}
                    </TableCell>
                    <TableCell>
                      {unit.isOccupied ? (
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Secured</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">No Lock</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {unit.isOccupied ? 
                        `Last accessed: ${new Date().toLocaleDateString()}` : 
                        "Ready for rental"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </ManagerLayout>
  );
}
