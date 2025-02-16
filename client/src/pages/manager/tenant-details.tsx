import { ManagerLayout } from "@/components/manager-layout";
import { useQuery } from "@tanstack/react-query";
import { Customer, Payment, Booking } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
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
            <div className="flex items-start gap-4">
              <Avatar className="h-24 w-24">
                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                  <UserCog className="h-12 w-12 text-muted-foreground" />
                </div>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{customer.name}</h2>
                <p className="text-muted-foreground">Customer Information</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
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
            </div>
          </Card>

          {/* Account & Access */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Account & Access</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Login Status</div>
                <Badge variant="success">Enabled</Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Username</div>
                <div>{customer.email}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Security Question</div>
                <div>Set</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Security Answer</div>
                <div>•••••</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Access Code</div>
                <div>{customer.accessCode ?? "Not Set"}</div>
              </div>
            </div>
          </Card>

          {/* Balance Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Balance: ${balance}</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Outstanding</div>
                <div>${balance}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Credit</div>
                <div>$0.00</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Recurring Billing</div>
                <Badge variant="outline">Not Activated</Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Recurring Fees</div>
                <div>$0.00</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Rentals Section could be added here */}
      </div>
    </ManagerLayout>
  );
}
