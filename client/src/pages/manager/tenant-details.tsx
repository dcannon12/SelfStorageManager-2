import { ManagerLayout } from "@/components/manager-layout";
import { useQuery } from "@tanstack/react-query";
import { Customer, Payment, Booking } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  const actionButtons = [
    { label: "Recurring Billing", href: "#" },
    { label: "Add Credit", href: "#" },
    { label: "Fees/Products", href: "#" },
    { label: "Make a Payment", href: "#" },
    { label: "Edit Profile", href: "#" },
    { label: "Rent Unit", href: "#" },
    { label: "Reserve Unit", href: "#" },
    { label: "Letters", href: "#" },
    { label: "Gate Access", href: "#" },
  ];

  const balance = payments?.reduce((total, payment) => {
    if (payment.status === "pending") {
      return total + payment.amount;
    }
    return total;
  }, 0) ?? 0;


  if (!customer) {
    return (
      <ManagerLayout>
        <div className="p-8">Loading...</div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      <div className="space-y-4">
        {/* Action Buttons */}
        <div className="flex gap-2 p-4 bg-gray-50 border-b">
          {actionButtons.map((button) => (
            <Button
              key={button.label}
              variant="secondary"
              size="sm"
            >
              {button.label}
            </Button>
          ))}
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Customer Information Section */}
          <div className="bg-gray-100 p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            <div className="grid grid-cols-2 gap-8">
              {/* Contact Section */}
              <div className="space-y-4">
                <h3 className="font-medium">Contact</h3>
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
                  <div className="text-sm text-muted-foreground">Cell Phone</div>
                  <div className="flex items-center gap-2">
                    <span>{customer.phone}</span>
                    <Button variant="outline" size="sm">Text Messaging</Button>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Address</div>
                  <div>{customer.address}</div>
                </div>
              </div>

              {/* Account & Access Section */}
              <div className="space-y-4">
                <h3 className="font-medium">Account & Access</h3>
                <div>
                  <div className="text-sm text-muted-foreground">Login</div>
                  <div>
                    <Badge variant="outline">
                      {customer.accountStatus === 'enabled' ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Username</div>
                  <div>{customer.email}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Security question</div>
                  <div>{customer.securityQuestion || 'Not set'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Security answer</div>
                  <div>{customer.securityAnswer || 'Not set'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Access Code</div>
                  <div>{customer.accessCode || 'Not set'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Balance Information */}
          <div className="mt-8">
            <div className="bg-gray-100 p-4 rounded-md">
              <h2 className="text-xl font-semibold mb-4">Balance: ${balance.toFixed(2)}</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">Outstanding</div>
                  <div className="text-red-600">${balance.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Recurring Billing</div>
                  <Badge variant="outline">
                    {customer.recurringBillingStatus === 'active' ? 'Active' : 'Not Activated'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </ManagerLayout>
  );
}