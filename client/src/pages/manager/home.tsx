import { ManagerLayout } from "@/components/manager-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Unit, Booking, Payment, Customer } from "@shared/schema";
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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


  // Calculate stats
  const stats = {
    totalUnits: units?.length ?? 0,
    occupiedUnits: units?.filter(u => u.isOccupied).length ?? 0,
    activeBookings: bookings?.filter(b => b.status === "active").length ?? 0,
    scheduledMoveOuts: 0,
    lateUnits: 0,
    auctionUnits: 0,
    availableUnits: units?.filter(u => !u.isOccupied).length ?? 0
  };

  // Get payments due in next 30 days
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
  const upcomingPayments = payments?.filter(payment => {
    const paymentDate = new Date(payment.createdAt);
    return paymentDate <= thirtyDaysFromNow && payment.status === 'pending';
  });

  const totalUpcomingPayments = upcomingPayments?.reduce((sum, payment) => sum + payment.amount, 0) ?? 0;

  // Calculate revenue for the last 3 months
  const getMonthlyRevenue = (payments: Payment[] | undefined, monthsAgo: number) => {
    if (!payments) return 0;
    const targetMonth = new Date();
    targetMonth.setMonth(targetMonth.getMonth() - monthsAgo);
    return payments
      .filter(payment => {
        const paymentDate = new Date(payment.createdAt);
        return paymentDate.getMonth() === targetMonth.getMonth() &&
               paymentDate.getFullYear() === targetMonth.getFullYear() &&
               payment.status === 'completed';
      })
      .reduce((sum, payment) => sum + payment.amount, 0);
  };

  const revenueData = [
    { month: 'Dec', revenue: getMonthlyRevenue(payments, 2) },
    { month: 'Jan', revenue: getMonthlyRevenue(payments, 1) },
    { month: 'Feb', revenue: getMonthlyRevenue(payments, 0) }
  ];

  // Calculate month-over-month change
  const currentMonthRevenue = revenueData[2].revenue;
  const lastMonthRevenue = revenueData[1].revenue;
  const twoMonthsAgoRevenue = revenueData[0].revenue;

  const monthOverMonthChange = lastMonthRevenue ?
    ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

  const previousMonthChange = twoMonthsAgoRevenue ?
    ((lastMonthRevenue - twoMonthsAgoRevenue) / twoMonthsAgoRevenue) * 100 : 0;

  // Calculate occupancy rate over time
  const calculateOccupancyRate = (bookings: Booking[] | undefined, date: Date) => {
    if (!bookings || !units) return 0;
    const activeOnDate = bookings.filter(booking => {
      const startDate = new Date(booking.startDate);
      const endDate = booking.endDate ? new Date(booking.endDate) : new Date();
      return startDate <= date && date <= endDate;
    }).length;
    return (activeOnDate / (units.length || 1)) * 100;
  };

  const occupancyData = Array.from({ length: 12 }).map((_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    return {
      date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`,
      rate: calculateOccupancyRate(bookings, date)
    };
  });

  // Calculate current occupancy rate
  const currentOccupancyRate = occupancyData[occupancyData.length - 1].rate;
  const lastMonthOccupancyRate = occupancyData[occupancyData.length - 2].rate;
  const yearAgoOccupancyRate = occupancyData[0].rate;

  const occupancyMonthChange = ((currentOccupancyRate - lastMonthOccupancyRate) / lastMonthOccupancyRate) * 100;
  const occupancyYearChange = ((currentOccupancyRate - yearAgoOccupancyRate) / yearAgoOccupancyRate) * 100;

  // Payment status chart data
  const paymentStatusData = [
    { name: 'Due Today', value: upcomingPayments?.filter(p => new Date(p.createdAt).toDateString() === today.toDateString()).length ?? 0 },
    { name: '1-7 days', value: upcomingPayments?.filter(p => {
      const dueDate = new Date(p.createdAt);
      const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilDue > 0 && daysUntilDue <= 7;
    }).length ?? 0 },
    { name: '8-14 days', value: upcomingPayments?.filter(p => {
      const dueDate = new Date(p.createdAt);
      const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilDue > 7 && daysUntilDue <= 14;
    }).length ?? 0 },
    { name: '15-30 days', value: upcomingPayments?.filter(p => {
      const dueDate = new Date(p.createdAt);
      const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilDue > 14 && daysUntilDue <= 30;
    }).length ?? 0 },
  ];

  const COLORS = ['#8BE8E5', '#45B7B4', '#2D7472', '#1A4342'];

  return (
    <ManagerLayout>
      <div className="space-y-8 p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Facility (D.8451)</p>
          </div>
        </div>

        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          {/* Revenue Chart */}
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Revenue</CardTitle>
              <span className="text-2xl font-bold">${currentMonthRevenue.toLocaleString()}</span>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} margin={{ top: 0, right: 0, bottom: 20, left: 0 }}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#8BE8E5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 flex justify-between text-sm">
                <span>{monthOverMonthChange >= 0 ? '↑' : '↓'} {Math.abs(monthOverMonthChange).toFixed(1)}% From January</span>
                <span>{previousMonthChange >= 0 ? '↑' : '↓'} {Math.abs(previousMonthChange).toFixed(1)}% From December</span>
              </div>
            </CardContent>
          </Card>

          {/* Occupancy Chart */}
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Occupancy</CardTitle>
              <span className="text-2xl font-bold">{currentOccupancyRate.toFixed(1)}%</span>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={occupancyData} margin={{ top: 0, right: 0, bottom: 20, left: 0 }}>
                    <XAxis dataKey="date" />
                    <YAxis domain={[80, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="rate" stroke="#8BE8E5" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 flex justify-between text-sm">
                <span>{occupancyMonthChange >= 0 ? '↑' : '↓'} {Math.abs(occupancyMonthChange).toFixed(1)}% From Last Month</span>
                <span>{occupancyYearChange >= 0 ? '↑' : '↓'} {Math.abs(occupancyYearChange).toFixed(1)}% From Last Year</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Status Chart */}
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Upcoming Payments</CardTitle>
              <span className="text-2xl font-bold">${totalUpcomingPayments.toLocaleString()}</span>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
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
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
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
        <div className="grid grid-cols-4 gap-6">
          <div className="text-center p-6 border rounded-lg bg-card">
            <div className="text-3xl font-bold">{stats.scheduledMoveOuts}</div>
            <div className="text-sm text-muted-foreground mt-2">Scheduled Move Outs</div>
          </div>
          <div className="text-center p-6 border rounded-lg bg-card">
            <div className="text-3xl font-bold">{stats.lateUnits}</div>
            <div className="text-sm text-muted-foreground mt-2">Late Units</div>
          </div>
          <div className="text-center p-6 border rounded-lg bg-card">
            <div className="text-3xl font-bold">{stats.auctionUnits}</div>
            <div className="text-sm text-muted-foreground mt-2">Auction Units</div>
          </div>
          <div className="text-center p-6 border rounded-lg bg-card">
            <div className="text-3xl font-bold">{stats.availableUnits}</div>
            <div className="text-sm text-muted-foreground mt-2">Available Units</div>
          </div>
        </div>
      </div>
    </ManagerLayout>
  );
}