import { ManagerLayout } from "@/components/manager-layout";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { useFacility } from "@/lib/facility-context";
import { StorageManagerData } from "@shared/schema";
import { 
  Download,
  DollarSign,
  Users,
  Building
} from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

interface ReportLink {
  name: string;
  href: string;
}

interface ReportGroup {
  heading: string;
  icon: React.ReactNode;
  items: ReportLink[];
}

export default function ReportsPage() {
  const { selectedFacility } = useFacility();

  const { data: metrics, isLoading } = useQuery<StorageManagerData[]>({
    queryKey: ["/api/facility-metrics"],
  });

  const currentFacilityMetrics = metrics?.find(m => 
    selectedFacility !== 'all' && m.facilityId === selectedFacility.id
  );

  const reportGroups: ReportGroup[] = [
    {
      heading: "Accounting/Financials",
      icon: <DollarSign className="h-5 w-5" />,
      items: [
        { name: "Check Batches", href: "/manager/reports/check-batches" },
        { name: "Lost Revenue", href: "/manager/reports/lost-revenue" },
        { name: "Expected Revenue", href: "/manager/reports/expected-revenue" },
        { name: "Future Revenue", href: "/manager/reports/future-revenue" },
        { name: "Collections", href: "/manager/reports/collections" },
        { name: "Revenues", href: "/manager/reports/revenues" },
        { name: "Yearly Revenues", href: "/manager/reports/yearly-revenues" },
        { name: "Monthly Deposits", href: "/manager/reports/monthly-deposits" },
        { name: "Sales", href: "/manager/reports/sales" },
        { name: "Sales Tax", href: "/manager/reports/sales-tax" },
        { name: "Total Deposits", href: "/manager/reports/total-deposits" },
        { name: "Credit Without Payment", href: "/manager/reports/credit-without-payment" },
        { name: "Refunds", href: "/manager/reports/refunds" },
        { name: "Failed and Declined Payments", href: "/manager/reports/failed-payments" },
        { name: "Alterations", href: "/manager/reports/alterations" },
        { name: "Accrual", href: "/manager/reports/accrual" },
        { name: "Retail Sales", href: "/manager/reports/retail-sales" },
        { name: "Rate Management Batches", href: "/manager/reports/rate-batches" },
      ]
    },
    {
      heading: "Customers",
      icon: <Users className="h-5 w-5" />,
      items: [
        { name: "Tenant Credit", href: "/manager/reports/tenant-credit" },
        { name: "Reservations", href: "/manager/reports/reservations" },
        { name: "Next Bill Due", href: "/manager/reports/next-bill" },
        { name: "Move In / Move Out", href: "/manager/reports/move-in-out" },
        { name: "Scheduled Move Outs", href: "/manager/reports/scheduled-moveouts" },
        { name: "Waiting List", href: "/manager/reports/waiting-list" },
        { name: "Lock Outs", href: "/manager/reports/lockouts" },
        { name: "Tenant Data", href: "/manager/reports/tenant-data" },
        { name: "Rental Transfers", href: "/manager/reports/rental-transfers" },
        { name: "Storage Agreements", href: "/manager/reports/storage-agreements" },
        { name: "Undelivered Notifications", href: "/manager/reports/undelivered-notifications" },
        { name: "Customer Notes", href: "/manager/reports/customer-notes" },
        { name: "Credit Card Expiration Dates", href: "/manager/reports/cc-expiration" },
        { name: "Active Promotions", href: "/manager/reports/active-promotions" },
      ]
    },
    {
      heading: "Facility",
      icon: <Building className="h-5 w-5" />,
      items: [
        { name: "Access Codes", href: "/manager/reports/access-codes" },
        { name: "Gate Activity Log", href: "/manager/reports/gate-activity" },
        { name: "Unit List", href: "/manager/reports/unit-list" },
        { name: "Management Summary", href: "/manager/reports/management-summary" },
        { name: "Insurance", href: "/manager/reports/insurance" },
        { name: "Unsigned Insurance Election Agreements", href: "/manager/reports/unsigned-insurance" },
        { name: "Unit Notes", href: "/manager/reports/unit-notes" },
        { name: "Rent Roll", href: "/manager/reports/rent-roll" },
        { name: "Square Footage", href: "/manager/reports/square-footage" },
        { name: "Retail Inventory Summary", href: "/manager/reports/retail-inventory" },
        { name: "Tasks", href: "/manager/reports/tasks" },
        { name: "Custom Fields", href: "/manager/reports/custom-fields" },
        { name: "Unit Status", href: "/manager/reports/unit-status" },
        { name: "Length of Stay", href: "/manager/reports/length-of-stay" },
        { name: "Vacant Units", href: "/manager/reports/vacant-units" },
        { name: "Self Insured Rentals", href: "/manager/reports/self-insured" },
      ]
    }
  ];

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Reports</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              Facility: {selectedFacility === 'all' ? 'All Facilities' : selectedFacility.name}
            </Badge>
          </div>
        </div>

        {/* Metrics Cards */}
        {currentFacilityMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
          </div>
        )}

        {/* Report Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reportGroups.map((group) => (
            <Card key={group.heading} className="p-6">
              <div className="flex items-center gap-2 mb-4">
                {group.icon}
                <h2 className="text-xl font-semibold">{group.heading}</h2>
              </div>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href}>
                      <a className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                        <Download className="h-4 w-4" />
                        {item.name}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </ManagerLayout>
  );
}