import { ManagerLayout } from "@/components/manager-layout";
import { useQuery } from "@tanstack/react-query";
import { Customer } from "@shared/schema";
import { useParams } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TenantDetailsPage() {
  const { id } = useParams();

  const { data: customer, isLoading } = useQuery<Customer>({
    queryKey: ["/api/customers", parseInt(id)],
    enabled: !!id
  });

  if (isLoading) {
    return (
      <ManagerLayout>
        <div className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-muted rounded"></div>
            <div className="h-4 w-32 bg-muted rounded"></div>
          </div>
        </div>
      </ManagerLayout>
    );
  }

  if (!customer) {
    return (
      <ManagerLayout>
        <div className="p-8">
          <h1 className="text-2xl font-bold text-red-600">Tenant not found</h1>
          <p className="text-muted-foreground">The requested tenant could not be found.</p>
        </div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{customer.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{customer.accountStatus}</Badge>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">ID: {customer.id}</span>
          </div>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-2">
              <div>
                <span className="text-muted-foreground">Email:</span>
                <span className="ml-2">{customer.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Phone:</span>
                <span className="ml-2">{customer.phone}</span>
              </div>
              {customer.address && (
                <div>
                  <span className="text-muted-foreground">Address:</span>
                  <span className="ml-2">{customer.address}</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </ManagerLayout>
  );
}