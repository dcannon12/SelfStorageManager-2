import { ManagerLayout } from "@/components/manager-layout";
import { useQuery } from "@tanstack/react-query";
import { Customer, Payment, Booking } from "@shared/schema";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { MessageSquare, Key } from "lucide-react";

export default function TenantDetailsPage() {
  const { id } = useParams();

  const { data: customer, isLoading } = useQuery<Customer>({
    queryKey: ["/api/customers", id],
    enabled: !!id
  });

  const { data: payments } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });

  const { data: bookings } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  // Filter payments and bookings for this tenant
  const customerBookings = bookings?.filter(booking => 
    booking.customerId === parseInt(id || '')
  );

  const customerPayments = payments?.filter(payment => {
    const booking = bookings?.find(b => b.id === payment.bookingId);
    return booking?.customerId === parseInt(id || '');
  });

  const lastPayment = customerPayments?.[0]?.createdAt 
    ? format(new Date(customerPayments[0].createdAt), 'MM/dd/yyyy')
    : 'N/A';

  const outstandingBalance = customerPayments?.reduce((total, payment) => {
    if (payment.status === 'pending') {
      return total + payment.amount;
    }
    return total;
  }, 0) || 0;

  if (isLoading) {
    return (
      <ManagerLayout>
        <div className="p-8">Loading...</div>
      </ManagerLayout>
    );
  }

  if (!customer) {
    return (
      <ManagerLayout>
        <div className="p-8">Tenant not found</div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-sm text-muted-foreground">Tenant ID: {customer.id}</div>
            <h1 className="text-2xl font-semibold mt-1">{customer.name}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button variant="outline" size="sm">
              <Key className="h-4 w-4 mr-2" />
              Gate Access
            </Button>
            <Button variant="default" size="sm">
              Make Payment
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Contact Information */}
          <Card className="p-4">
            <h2 className="font-semibold mb-4">Contact Information</h2>
            <div className="space-y-2 text-sm">
              <div>Email: {customer.email}</div>
              <div>Phone: {customer.phone}</div>
              {customer.address && <div>Address: {customer.address}</div>}
              <div>Gate Code: {customer.accessCode || 'Not set'}</div>
            </div>
          </Card>

          {/* Balance Summary */}
          <Card className="p-4">
            <h2 className="font-semibold mb-4">Balance Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Outstanding:</span>
                <span className="text-red-600">${outstandingBalance}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Payment:</span>
                <span>{lastPayment}</span>
              </div>
            </div>
          </Card>

          {/* Current Rentals */}
          <Card className="p-4">
            <h2 className="font-semibold mb-4">Current Rentals</h2>
            <div className="space-y-4">
              {customerBookings?.map(booking => (
                <div key={booking.id} className="text-sm">
                  <div>Unit {booking.unitId}</div>
                  <div className="text-muted-foreground">
                    Size: {booking.size || '10x20'}
                  </div>
                  <Button variant="link" size="sm" className="px-0">
                    View Agreement
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </ManagerLayout>
  );
}