import { apiRequest } from "./queryClient";
import type { Unit, Customer, Booking, InsertCustomer, InsertBooking, StorageManagerData } from "@shared/schema";

export async function createCustomer(customer: InsertCustomer): Promise<Customer> {
  const res = await apiRequest("POST", "/api/customers", customer);
  return res.json();
}

export async function createBooking(booking: InsertBooking): Promise<Booking> {
  const res = await apiRequest("POST", "/api/bookings", booking);
  return res.json();
}

export async function updateBookingStatus(id: number, status: string): Promise<Booking> {
  const res = await apiRequest("PATCH", `/api/bookings/${id}/status`, { status });
  return res.json();
}

export async function getFacilityMetrics(): Promise<StorageManagerData[]> {
  const res = await apiRequest("GET", "/api/facility-metrics");
  return res.json();
}

export async function getFacilityMetricsById(id: number): Promise<StorageManagerData> {
  const res = await apiRequest("GET", `/api/facility-metrics/${id}`);
  return res.json();
}