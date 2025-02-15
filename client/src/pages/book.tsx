import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { type Unit } from "@shared/schema";
import { BookingForm } from "@/components/booking-form";
import { Card, CardContent } from "@/components/ui/card";
import { createCustomer, createBooking } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function Book() {
  const [, params] = useRoute("/book/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: unit, isLoading } = useQuery<Unit>({
    queryKey: [`/api/units/${params?.id}`],
  });

  const bookingMutation = useMutation({
    mutationFn: async (values: any) => {
      const customer = await createCustomer({
        name: values.name,
        email: values.email,
        phone: values.phone,
      });

      await createBooking({
        unitId: Number(params?.id),
        customerId: customer.id,
        startDate: values.startDate,
        status: "active" as const,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your booking has been confirmed",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/units"] });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (values: any) => {
    await bookingMutation.mutateAsync(values);
  };

  if (isLoading || !unit) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Book Storage Unit</h1>
        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Unit Details</h2>
              <p className="text-muted-foreground">
                {unit.type} Unit - {unit.size}
              </p>
              <p className="text-muted-foreground">{unit.location}</p>
              <p className="font-medium mt-2">${unit.price}/month</p>
            </div>
            <BookingForm
              unit={unit}
              onSubmit={handleSubmit}
              isSubmitting={bookingMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}