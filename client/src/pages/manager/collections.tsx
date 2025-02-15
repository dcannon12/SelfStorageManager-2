import { ManagerLayout } from "@/components/manager-layout";
import { useQuery } from "@tanstack/react-query";
import { Payment, Customer, Booking } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useFacility } from "@/lib/facility-context";
import { formatDistanceToNow } from "date-fns";

export default function CollectionsPage() {
  const { selectedFacility } = useFacility();
  const { data: payments } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });

  const { data: customers } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const { data: bookings } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  // Get overdue payments and their associated customers
  const overduePayments = payments?.filter(payment => 
    payment.status === "pending" && 
    new Date(payment.createdAt) < new Date()
  ) ?? [];

  const overdueCustomers = overduePayments.map(payment => {
    const booking = bookings?.find(b => b.id === payment.bookingId);
    const customer = customers?.find(c => booking?.customerId === c.id);
    return {
      payment,
      customer,
      daysOverdue: Math.floor(
        (new Date().getTime() - new Date(payment.createdAt).getTime()) / 
        (1000 * 60 * 60 * 24)
      ),
    };
  }).sort((a, b) => b.daysOverdue - a.daysOverdue);

  return (
    <ManagerLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Collections</h1>
            <p className="text-muted-foreground">
              {overdueCustomers.length} tenants with outstanding balances
            </p>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Amount Due</TableHead>
                <TableHead>Days Overdue</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overdueCustomers.map(({ payment, customer, daysOverdue }) => (
                <TableRow key={payment.id}>
                  <TableCell>{customer?.name ?? "Unknown"}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>{customer?.email}</div>
                      <div className="text-sm text-muted-foreground">
                        {customer?.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>${payment.amount}</TableCell>
                  <TableCell>
                    <Badge variant={daysOverdue > 30 ? "destructive" : "secondary"}>
                      {daysOverdue} days
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      Needs Contact
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </ManagerLayout>
  );
}