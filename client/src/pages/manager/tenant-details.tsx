import { ManagerLayout } from "@/components/manager-layout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Customer } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useParams } from "wouter";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string(),
});

type UpdateInput = z.infer<typeof updateSchema>;

export default function TenantDetailsPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const { data: customer } = useQuery<Customer>({
    queryKey: ["/api/customers", id],
  });

  const form = useForm<UpdateInput>({
    resolver: zodResolver(updateSchema),
  });

  const updateCustomer = useMutation({
    mutationFn: async (data: UpdateInput) => {
      const response = await fetch(`/api/customers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update customer");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers", id] });
      toast({
        title: "Success",
        description: "Customer updated successfully",
      });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update customer",
        variant: "destructive",
      });
    },
  });

  if (!customer) {
    return (
      <ManagerLayout>
        <div>Loading...</div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{customer.name}</h1>
          <Button onClick={() => {
            form.reset({
              name: customer.name,
              phone: customer.phone,
              address: customer.address || "",
            });
            setIsEditing(true);
          }}>
            Edit Details
          </Button>
        </div>

        <div className="space-y-2">
          <p><strong>Phone:</strong> {customer.phone}</p>
          <p><strong>Address:</strong> {customer.address || "Not provided"}</p>
        </div>

        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Customer Details</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => updateCustomer.mutate(data))} className="space-y-4">
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                    disabled={updateCustomer.isPending}
                  >
                    {updateCustomer.isPending ? "Saving..." : "Save Changes"}
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