import { ManagerLayout } from "@/components/manager-layout";
import { useQuery } from "@tanstack/react-query";
import { Payment, Customer, Booking } from "@shared/schema";
import { Link } from "wouter";
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

  const { data: payments } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });

  const { data: customers } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const { data: bookings } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  // Get overdue payments and their associated customers
  const overduePayments = payments?.filter(payment =>
    payment.status === "pending" && new Date(payment.createdAt) < new Date()
  ) ?? [];

  const overdueCustomers = overduePayments.map(payment => {
    const booking = bookings?.find(b => b.id === payment.bookingId);
    const customer = customers?.find(c => booking?.customerId === c.id);
    const daysOverdue = Math.floor(
      (new Date().getTime() - new Date(payment.createdAt).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return {
      payment,
      customer,
      daysOverdue,
    };
  });

  // Apply filters
  const filteredCustomers = overdueCustomers.filter(({ customer, payment, daysOverdue }) => {
    const searchTerm = search.toLowerCase();
    const matchesSearch = !search ||
      customer?.name.toLowerCase().includes(searchTerm) ||
      customer?.email.toLowerCase().includes(searchTerm) ||
      customer?.phone.toLowerCase().includes(searchTerm);

    const matchesDaysOverdue = daysOverdueFilter === "all" ||
      (daysOverdueFilter === "0-30" && daysOverdue <= 30) ||
      (daysOverdueFilter === "31-60" && daysOverdue > 30 && daysOverdue <= 60) ||
      (daysOverdueFilter === "60+" && daysOverdue > 60);

    const matchesAmount = amountFilter === "all" ||
      (amountFilter === "0-500" && payment.amount <= 500) ||
      (amountFilter === "501-1000" && payment.amount > 500 && payment.amount <= 1000) ||
      (amountFilter === "1000+" && payment.amount > 1000);

    return matchesSearch && matchesDaysOverdue && matchesAmount;
  }).sort((a, b) => b.daysOverdue - a.daysOverdue);

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
                <TableHead className="w-[120px]">Amount Due</TableHead>
                <TableHead className="w-[120px]">Days Overdue</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map(({ payment, customer, daysOverdue }) => (
                <TableRow key={payment.id} className="hover:bg-muted/50">
                  <TableCell>{customer?.name ?? "Unknown"}</TableCell>
                  <TableCell>
                    <div>{customer?.email}</div>
                    <div className="text-sm text-muted-foreground">
                      {customer?.phone}
                    </div>
                  </TableCell>
                  <TableCell>${payment.amount}</TableCell>
                  <TableCell>
                    <Badge variant={daysOverdue > 30 ? "destructive" : "secondary"}>
                      {daysOverdue} days
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      Needs Contact
                    </Badge>
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