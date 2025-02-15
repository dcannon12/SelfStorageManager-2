import { ManagerLayout } from "@/components/manager-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Unit, Booking, Payment } from "@shared/schema";
import { DollarSign, Users, BoxSelect, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function ManagerHome() {
  const { data: units } = useQuery<Unit[]>({
    queryKey: ["/api/units"],
  });

  const { data: bookings } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  const { data: payments } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });

  const stats = {
    totalUnits: units?.length ?? 0,
    occupiedUnits: units?.filter(u => u.isOccupied).length ?? 0,
    activeBookings: bookings?.filter(b => b.status === "active").length ?? 0,
    monthlyRevenue: units?.reduce((sum, unit) => 
      unit.isOccupied ? sum + unit.price : sum, 0
    ) ?? 0,
    scheduledMoveOuts: 0,
    lateUnits: 0,
    auctionUnits: 0,
    availableUnits: units?.filter(u => !u.isOccupied).length ?? 0
  };

  // Mock data for demonstration - replace with real data from API
  const revenueData = [
    { month: 'Feb', revenue: 19684.81 },
    { month: 'Jan', revenue: 18500.00 },
    { month: 'Dec', revenue: 17800.00 },
    // ... more months
  ];

  const occupancyData = Array.from({ length: 12 }).map((_, i) => ({
    date: `2024-${(i + 1).toString().padStart(2, '0')}`,
    rate: 87 + Math.random() * 2 - 1
  }));

  const paymentStatusData = [
    { name: '0-30 days', value: 75 },
    { name: '31-60 days', value: 15 },
    { name: '61-90 days', value: 7 },
    { name: '90+ days', value: 3 },
  ];

  const COLORS = ['#8BE8E5', '#45B7B4', '#2D7472', '#1A4342'];

  return (
    <ManagerLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Facility (D.8451)</p>
          </div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            Edit Dashboard
          </button>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Revenue Chart */}
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Revenue</CardTitle>
              <span className="text-2xl font-bold">${stats.monthlyRevenue.toFixed(2)}</span>
            </CardHeader>
            <CardContent>
              <BarChart width={300} height={200} data={revenueData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#8BE8E5" />
              </BarChart>
              <div className="mt-2 flex justify-between text-sm">
                <span>↓ 3% From December 2024</span>
                <span>↓ 20% From January 2024</span>
              </div>
            </CardContent>
          </Card>

          {/* Occupancy Chart */}
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Occupancy</CardTitle>
              <span className="text-2xl font-bold">87%</span>
            </CardHeader>
            <CardContent>
              <LineChart width={300} height={200} data={occupancyData}>
                <XAxis dataKey="date" />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#8BE8E5" />
              </LineChart>
              <div className="mt-2 flex justify-between text-sm">
                <span>↑ 1% From Last Month</span>
                <span>↓ 6% From Last Year</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Status Chart */}
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Awaiting Payment</CardTitle>
              <span className="text-2xl font-bold">$5,949.86</span>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <PieChart width={200} height={200}>
                  <Pie
                    data={paymentStatusData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {paymentStatusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                {paymentStatusData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-3xl font-bold">{stats.scheduledMoveOuts}</div>
            <div className="text-sm text-muted-foreground">Scheduled Move Outs</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-3xl font-bold">{stats.lateUnits}</div>
            <div className="text-sm text-muted-foreground">Late Units</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-3xl font-bold">{stats.auctionUnits}</div>
            <div className="text-sm text-muted-foreground">Auction Units</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-3xl font-bold">{stats.availableUnits}</div>
            <div className="text-sm text-muted-foreground">Available Units</div>
          </div>
        </div>
      </div>
    </ManagerLayout>
  );
}