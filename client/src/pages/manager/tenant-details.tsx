import { ManagerLayout } from "@/components/manager-layout";
import { useQuery } from "@tanstack/react-query";
import { Customer, Payment, Booking } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  DollarSign,
  FileText,
  Key,
  Mail,
  MessageSquare,
  Shield,
  UserCog
} from "lucide-react";
import { useParams } from "wouter";

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

  const actionButtons = [
    { label: "Recurring Billing", icon: CreditCard, href: "#" },
    { label: "Add Credit", icon: DollarSign, href: "#" },
    { label: "Fees/Products", icon: FileText, href: "#" },
    { label: "Make a Payment", icon: DollarSign, href: "#" },
    { label: "Edit Profile", icon: UserCog, href: "#" },
    { label: "Rent Unit", icon: Key, href: "#" },
    { label: "Reserve Unit", icon: Shield, href: "#" },
    { label: "Letters", icon: Mail, href: "#" },
    { label: "Gate Access", icon: Key, href: "#" },
  ];

  if (!customer) {
    return (
      <ManagerLayout>
        <div className="p-8">Loading...</div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      <div className="p-8">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          {actionButtons.map((button) => (
            <Button
              key={button.label}
              variant="secondary"
              size="sm"
              className="flex items-center gap-2"
            >
              <button.icon className="h-4 w-4" />
              {button.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Customer Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Name</div>
                <div>{customer.name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div>{customer.email}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Phone</div>
                <div>{customer.phone}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Address</div>
                <div className="whitespace-pre-line">
                  {customer.address}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Cell Phone</div>
                <div className="flex items-center gap-2">
                  <span>{customer.phone}</span>
                  <Button variant="outline" size="sm">Text Messaging</Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Account & Access */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Account & Access</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Login</div>
                <div>{customer.accountStatus === 'enabled' ? 'Enabled' : 'Disabled'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Username</div>
                <div>{customer.email}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Security question</div>
                <div>Set</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Security answer</div>
                <div>BSF</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Access Code</div>
                <div>{customer.accessCode ?? "Not Set"}</div>
              </div>
            </div>
          </Card>

          {/* Balance Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Balance: ${balance.toFixed(2)}</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Outstanding</div>
                <div className="text-red-600">${balance.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Credit</div>
                <div>$20.26</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Recurring Billing</div>
                <Badge variant="outline">
                  {customer.recurringBillingStatus === 'active' ? 'Active' : 'Not Activated'}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Recurring Fees</div>
                <div>0</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Rentals Section */}
        <div className="mt-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Rentals</h2>
            <div className="text-sm text-muted-foreground">
              No active rentals found.
            </div>
          </Card>
        </div>
      </div>
    </ManagerLayout>
  );
}