import { ManagerLayout } from "@/components/manager-layout";
import { useQuery } from "@tanstack/react-query";
import { Customer, Payment, Booking } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams } from "wouter";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { 
  CreditCard, 
  MessageSquare, 
  Key, 
  Mail, 
  Phone, 
  Home,
  DollarSign,
  CalendarDays,
  FileText,
  GitFork
} from "lucide-react";

export default function TenantDetailsPage() {
  const { id } = useParams();

  const { data: customer } = useQuery<Customer>({
    queryKey: ["/api/customers", id],
  });

  const { data: payments } = useQuery<Payment[]>({
    queryKey: ["/api/payments", { customerId: id }],
  });

  const { data: bookings } = useQuery<Booking[]>({
    queryKey: ["/api/bookings", { customerId: id }],
  });

  const balance = payments?.reduce((total, payment) => {
    if (payment.status === "pending") {
      return total + payment.amount;
    }
    return total;
  }, 0) ?? 0;

  if (!customer) {
    return (
      <ManagerLayout>
        <div className="p-4">Loading...</div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header & Quick Actions */}
        <div className="p-4 border-b bg-white sticky top-0 z-10">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{customer.name}</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Message
              </Button>
              <Button variant="outline" size="sm">
                <Key className="h-4 w-4 mr-2" />
                Gate Access
              </Button>
              <Button variant="default" size="sm">
                <DollarSign className="h-4 w-4 mr-2" />
                Make Payment
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 grid gap-4 md:grid-cols-3">
          {/* Contact Information */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white p-4 rounded-lg border">
              <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">{customer.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">{customer.phone}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">{customer.address}</div>
                </div>
                <div className="flex items-center gap-2">
                  <GitFork className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">Gate Code: {customer.accessCode || 'Not set'}</div>
                </div>
              </div>
            </div>

            {/* Balance Summary */}
            <div className="bg-white p-4 rounded-lg border">
              <h2 className="text-lg font-semibold mb-4">Balance Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Outstanding</span>
                  <span className="font-medium text-red-600">${balance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last Payment</span>
                  <span className="text-sm">
                    {payments?.[0] ? format(new Date(payments[0].createdAt), 'MMM d, yyyy') : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-4">
            {/* Payment History */}
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Payment History</h2>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments?.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{format(new Date(payment.createdAt), 'MMM d, yyyy')}</TableCell>
                      <TableCell>Monthly Rent Payment</TableCell>
                      <TableCell>${payment.amount}</TableCell>
                      <TableCell>
                        <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Notes */}
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Notes</h2>
                <Button variant="outline" size="sm">Add Note</Button>
              </div>
              <Textarea
                placeholder="Add a note about this tenant..."
                className="min-h-[100px] mb-4"
              />
              <div className="space-y-3">
                <div className="border-l-4 border-primary p-3 bg-muted/50 rounded">
                  <div className="text-sm text-muted-foreground mb-1">
                    Added by John Doe on {format(new Date(), 'MMM d, yyyy')}
                  </div>
                  <p className="text-sm">Called about gate access code reset. Issue resolved.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ManagerLayout>
  );
}