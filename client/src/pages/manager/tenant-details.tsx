import { ManagerLayout } from "@/components/manager-layout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Customer, Payment, Booking } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams } from "wouter";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  GitFork,
  Pencil,
  Link as LinkIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Create a more lenient update schema with proper string handling
const updateCustomerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().optional().or(z.literal('')),
  accessCode: z.string().optional().or(z.literal('')),
});

type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;

export default function TenantDetailsPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<UpdateCustomerInput>({
    resolver: zodResolver(updateCustomerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      accessCode: "",
    },
  });

  const { data: customer } = useQuery<Customer>({
    queryKey: ["/api/customers", id],
  });

  const { data: payments } = useQuery<Payment[]>({
    queryKey: ["/api/payments", { customerId: id }],
  });

  const { data: bookings } = useQuery<Booking[]>({
    queryKey: ["/api/bookings", { customerId: id }],
  });

  // Update form when customer data is loaded
  useEffect(() => {
    if (customer) {
      form.reset({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address ?? "",
        accessCode: customer.accessCode ?? "",
      });
    }
  }, [customer, form]);

  const updateCustomerMutation = useMutation({
    mutationFn: async (data: UpdateCustomerInput) => {
      console.log("Updating customer with data:", data);
      const response = await fetch(`/api/customers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          address: data.address || null,
          accessCode: data.accessCode || null,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to update customer');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers", id] });
      toast({
        title: "Success",
        description: "Customer details updated successfully",
      });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      console.error("Update failed:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: UpdateCustomerInput) => {
    console.log("Form submitted with data:", data);
    updateCustomerMutation.mutate(data);
  };

  // Helper function to safely format dates
  const formatDate = (dateStr: string | undefined | null): string => {
    if (!dateStr) return 'N/A';
    try {
      return format(new Date(dateStr), 'MM/dd/yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

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
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">{customer.name}</h1>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (customer) {
                    form.reset({
                      name: customer.name,
                      email: customer.email,
                      phone: customer.phone,
                      address: customer.address ?? "",
                      accessCode: customer.accessCode ?? "",
                    });
                  }
                  setIsEditing(true);
                }}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
            </div>
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

        {/* Edit Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Customer Details</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accessCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gate Access Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateCustomerMutation.isPending}
                  >
                    {updateCustomerMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </ManagerLayout>
  );
}