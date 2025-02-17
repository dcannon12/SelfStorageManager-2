import { ManagerLayout } from "@/components/manager-layout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Customer, Payment, Booking, insertCustomerSchema } from "@shared/schema";
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

// Create a more lenient update schema
const updateCustomerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().nullable(),
  accessCode: z.string().nullable(),
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
      address: null,
      accessCode: null,
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
        address: customer.address,
        accessCode: customer.accessCode,
      });
    }
  }, [customer, form]);

  const updateCustomerMutation = useMutation({
    mutationFn: async (data: UpdateCustomerInput) => {
      console.log("Updating customer with data:", data);
      const response = await fetch(`/api/customers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MM/dd/yyyy');
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
                      address: customer.address,
                      accessCode: customer.accessCode,
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
                    {payments?.[0] ? formatDate(payments[0].createdAt) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-4">
            {/* Current Rentals */}
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Current Rentals</h2>
              </div>
              <div className="divide-y">
                {bookings?.map((booking) => (
                  <div key={booking.id} className="p-4">
                    <div className="grid grid-cols-3 gap-6">
                      {/* Unit Details */}
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Unit Details</h3>
                        <div className="space-y-1">
                          <div className="font-semibold">Unit {booking.unitId}</div>
                          <div className="text-sm">Size: 10x20</div>
                          <div className="text-sm">Status: Rented</div>
                          <Button variant="link" size="sm" className="h-auto p-0">
                            <LinkIcon className="h-3 w-3 mr-1" />
                            View Agreement
                          </Button>
                        </div>
                      </div>

                      {/* Billing */}
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Billing</h3>
                        <div className="space-y-1">
                          <div className="text-sm">Monthly Rate: ${booking.monthlyRate}</div>
                          <div className="text-sm">Next Bill: {formatDate(booking.nextBillDate)}</div>
                          <div className="text-sm">Insurance: ${booking.insuranceAmount || '0.00'}</div>
                        </div>
                      </div>

                      {/* Move Out */}
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Move Out</h3>
                        <div className="space-y-2">
                          <Button variant="secondary" size="sm" className="w-full">
                            Schedule Move Out
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
                      <TableCell>{formatDate(payment.createdAt)}</TableCell>
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
                    Added by John Doe on {formatDate(new Date().toISOString())}
                  </div>
                  <p className="text-sm">Called about gate access code reset. Issue resolved.</p>
                </div>
              </div>
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
                        <Input {...field} value={field.value || ''} />
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
                        <Input type="email" {...field} value={field.value || ''} />
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
                        <Input type="tel" {...field} value={field.value || ''} />
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
                        <Input {...field} value={field.value || ''} />
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
                        <Input {...field} value={field.value || ''} />
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