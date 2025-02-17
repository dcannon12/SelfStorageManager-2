import { ManagerLayout } from "@/components/manager-layout";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { useFacility } from "@/lib/facility-context";
import { StorageManagerData } from "@shared/schema";

export default function ReportsPage() {
  const { selectedFacility } = useFacility();

  const { data: metrics, isLoading } = useQuery<StorageManagerData[]>({
    queryKey: ["/api/facility-metrics"],
  });

  const currentFacilityMetrics = metrics?.find(m => 
    selectedFacility !== 'all' && m.facilityId === selectedFacility.id
  );

  if (isLoading) {
    return (
      <ManagerLayout>
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">Reports</h1>
          <p>Loading metrics...</p>
        </div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Facility Reports</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentFacilityMetrics ? (
            <>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Units Overview</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Units:</span>
                    <span className="font-medium">{currentFacilityMetrics.totalUnits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available:</span>
                    <span className="font-medium">{currentFacilityMetrics.availableUnits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Occupied:</span>
                    <span className="font-medium">{currentFacilityMetrics.occupiedUnits}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Financial Overview</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Revenue:</span>
                    <span className="font-medium">
                      ${Number(currentFacilityMetrics.totalRevenue).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending Payments:</span>
                    <span className="font-medium">
                      ${Number(currentFacilityMetrics.pendingPayments).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overdue Payments:</span>
                    <span className="font-medium text-red-600">
                      ${Number(currentFacilityMetrics.overduePayments).toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Customer Overview</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Customers:</span>
                    <span className="font-medium">{currentFacilityMetrics.totalCustomers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Customers:</span>
                    <span className="font-medium">{currentFacilityMetrics.activeCustomers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overdue Customers:</span>
                    <span className="font-medium text-red-600">
                      {currentFacilityMetrics.overdueCustomers}
                    </span>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <p className="text-muted-foreground col-span-3">
              Select a facility to view detailed metrics
            </p>
          )}
        </div>
      </div>
    </ManagerLayout>
  );
}