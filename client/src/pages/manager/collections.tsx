import { ManagerLayout } from "@/components/manager-layout";
import { useQuery } from "@tanstack/react-query";
import { Payment, Customer, Booking } from "@shared/schema";
import { useLocation } from "wouter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useFacility } from "@/lib/facility-context";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Search } from "lucide-react";

export default function CollectionsPage() {
  const { selectedFacility } = useFacility();
  const [search, setSearch] = useState("");
  const [daysOverdueFilter, setDaysOverdueFilter] = useState<string>("all");
  const [amountFilter, setAmountFilter] = useState<string>("all");
  const [, navigate] = useLocation();

  const { data: payments } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });

  const { data: customers } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const { data: bookings } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  // Calculate total outstanding balance for each customer
  const customerBalances = new Map<number, number>();
  payments?.forEach(payment => {
    if (payment.status === "pending") {
      const booking = bookings?.find(b => b.id === payment.bookingId);
      if (booking) {
        const customerId = booking.customerId;
        customerBalances.set(
          customerId,
          (customerBalances.get(customerId) || 0) + payment.amount
        );
      }
    }
  });

  const overdueCustomers = Array.from(customerBalances.entries()).map(([customerId, balance]) => {
    const customer = customers?.find(c => c.id === customerId);
    const customerPayments = payments?.filter(p => {
      const booking = bookings?.find(b => b.id === p.bookingId);
      return booking?.customerId === customerId && p.status === "pending";
    }) ?? [];

    const oldestOverduePayment = customerPayments.reduce((oldest, current) => {
      return new Date(current.createdAt) < new Date(oldest.createdAt) ? current : oldest;
    }, customerPayments[0]);

    const daysOverdue = Math.floor(
      (new Date().getTime() - new Date(oldestOverduePayment?.createdAt ?? 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return {
      customer,
      balance,
      daysOverdue,
      oldestOverduePayment
    };
  });

  const filteredCustomers = overdueCustomers.filter(({ customer, balance, daysOverdue }) => {
    if (!customer) return false;

    const searchTerm = search.toLowerCase();
    const matchesSearch = !search ||
      customer.name.toLowerCase().includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm) ||
      customer.phone.toLowerCase().includes(searchTerm);

    const matchesDaysOverdue = daysOverdueFilter === "all" ||
      (daysOverdueFilter === "0-30" && daysOverdue <= 30) ||
      (daysOverdueFilter === "31-60" && daysOverdue > 30 && daysOverdue <= 60) ||
      (daysOverdueFilter === "60+" && daysOverdue > 60);

    const matchesAmount = amountFilter === "all" ||
      (amountFilter === "0-500" && balance <= 500) ||
      (amountFilter === "501-1000" && balance > 500 && balance <= 1000) ||
      (amountFilter === "1000+" && balance > 1000);

    return matchesSearch && matchesDaysOverdue && matchesAmount;
  }).sort((a, b) => b.daysOverdue - a.daysOverdue);

  const getStatusBadge = (daysOverdue: number) => {
    if (daysOverdue > 60) {
      return <Badge variant="destructive">Legal Action Required</Badge>;
    } else if (daysOverdue > 30) {
      return <Badge variant="destructive">Urgent Collection</Badge>;
    } else {
      return <Badge variant="secondary">Follow Up</Badge>;
    }
  };

  return (
    <ManagerLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold">Collections</h1>
        <p className="text-muted-foreground">
          {filteredCustomers.length} tenants with outstanding balances
        </p>

        {/* Filters */}
        <div className="my-6 flex items-center gap-4">
          <div className="relative w-[400px]">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by tenant name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={daysOverdueFilter} onValueChange={setDaysOverdueFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Days</SelectItem>
              <SelectItem value="0-30">0-30 days</SelectItem>
              <SelectItem value="31-60">31-60 days</SelectItem>
              <SelectItem value="60+">60+ days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={amountFilter} onValueChange={setAmountFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Amounts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Amounts</SelectItem>
              <SelectItem value="0-500">$0-$500</SelectItem>
              <SelectItem value="501-1000">$501-$1000</SelectItem>
              <SelectItem value="1000+">$1000+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Tenant</TableHead>
                <TableHead className="w-[200px]">Contact</TableHead>
                <TableHead className="w-[120px]">Outstanding Balance</TableHead>
                <TableHead className="w-[120px]">Days Overdue</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map(({ customer, balance, daysOverdue }) => (
                <TableRow 
                  key={customer?.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => customer && navigate(`/manager/tenant/${customer.id}`)}
                >
                  <TableCell>{customer?.name}</TableCell>
                  <TableCell>
                    <div>{customer?.email}</div>
                    <div className="text-sm text-muted-foreground">
                      {customer?.phone}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${balance.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={daysOverdue > 30 ? "destructive" : "secondary"}>
                      {daysOverdue} days
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(daysOverdue)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </ManagerLayout>
  );
}