import { type Unit, type Customer, type Booking, type Lead, type PricingGroup, type Payment } from "@shared/schema";
import { type InsertUnit, type InsertCustomer, type InsertBooking, type InsertLead, type InsertPricingGroup, type InsertPayment } from "@shared/schema";
import { units, customers, bookings, leads, pricingGroups, payments } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Units
  getUnits(): Promise<Unit[]>;
  getUnit(id: number): Promise<Unit | undefined>;
  createUnit(unit: InsertUnit): Promise<Unit>;
  updateUnitStatus(id: number, isOccupied: boolean): Promise<Unit>;

  // Customers
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  getCustomers(): Promise<Customer[]>;
  updateCustomerAutopay(
    customerId: number, 
    enabled: boolean, 
    method?: Record<string, any>,
    day?: number
  ): Promise<Customer>;

  // Bookings
  getBookings(): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: "active" | "completed" | "cancelled"): Promise<Booking>;

  // Leads
  getLeads(): Promise<Lead[]>;
  getLead(id: number): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLeadStatus(id: number, status: "new" | "contacted" | "qualified" | "converted" | "lost"): Promise<Lead>;

  // Pricing Groups
  getPricingGroups(): Promise<PricingGroup[]>;
  getPricingGroup(id: number): Promise<PricingGroup | undefined>;
  createPricingGroup(group: InsertPricingGroup): Promise<PricingGroup>;
  updatePricingGroup(id: number, group: Partial<InsertPricingGroup>): Promise<PricingGroup>;

  // Payments
  getPayments(): Promise<Payment[]>;
  getPayment(id: number): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePaymentStatus(id: number, status: "pending" | "completed" | "failed" | "refunded"): Promise<Payment>;
}

export class DatabaseStorage implements IStorage {
  async getUnits(): Promise<Unit[]> {
    return await db.select().from(units);
  }

  async getUnit(id: number): Promise<Unit | undefined> {
    const results = await db.select().from(units).where(eq(units.unit_id, id));
    return results[0];
  }

  async createUnit(unit: InsertUnit): Promise<Unit> {
    const result = await db.insert(units).values(unit);
    const id = result[0].insertId;
    const [newUnit] = await db.select().from(units).where(eq(units.unit_id, id));
    return newUnit;
  }

  async updateUnitStatus(id: number, isOccupied: boolean): Promise<Unit> {
    await db.update(units).set({ isOccupied }).where(eq(units.unit_id, id));
    const [updatedUnit] = await db.select().from(units).where(eq(units.unit_id, id));
    if (!updatedUnit) throw new Error("Unit not found");
    return updatedUnit;
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    const results = await db.select().from(customers).where(eq(customers.id, id));
    return results[0];
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const result = await db.insert(customers).values(customer);
    const id = result[0].insertId;
    const [newCustomer] = await db.select().from(customers).where(eq(customers.id, id));
    return newCustomer;
  }

  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers);
  }

  async getBookings(): Promise<Booking[]> {
    return await db.select().from(bookings);
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const result = await db.insert(bookings).values(booking);
    const id = result[0].insertId;
    const [newBooking] = await db.select().from(bookings).where(eq(bookings.id, id));
    await this.updateUnitStatus(booking.unitId, true);
    return newBooking;
  }

  async updateBookingStatus(id: number, status: "active" | "completed" | "cancelled"): Promise<Booking> {
    await db.update(bookings).set({ status }).where(eq(bookings.id, id));
    const [updatedBooking] = await db.select().from(bookings).where(eq(bookings.id, id));
    if (!updatedBooking) throw new Error("Booking not found");

    if (status === "completed" || status === "cancelled") {
      await this.updateUnitStatus(updatedBooking.unitId, false);
    }
    return updatedBooking;
  }

  async getLeads(): Promise<Lead[]> {
    return await db.select().from(leads);
  }

  async getLead(id: number): Promise<Lead | undefined> {
    const results = await db.select().from(leads).where(eq(leads.id, id));
    return results[0];
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const result = await db.insert(leads).values(lead);
    const id = result[0].insertId;
    const [newLead] = await db.select().from(leads).where(eq(leads.id, id));
    return newLead;
  }

  async updateLeadStatus(id: number, status: "new" | "contacted" | "qualified" | "converted" | "lost"): Promise<Lead> {
    await db.update(leads).set({ status }).where(eq(leads.id, id));
    const [updatedLead] = await db.select().from(leads).where(eq(leads.id, id));
    if (!updatedLead) throw new Error("Lead not found");
    return updatedLead;
  }

  async getPricingGroups(): Promise<PricingGroup[]> {
    return await db.select().from(pricingGroups);
  }

  async getPricingGroup(id: number): Promise<PricingGroup | undefined> {
    const results = await db.select().from(pricingGroups).where(eq(pricingGroups.id, id));
    return results[0];
  }

  async createPricingGroup(group: InsertPricingGroup): Promise<PricingGroup> {
    const result = await db.insert(pricingGroups).values(group);
    const id = result[0].insertId;
    const [newGroup] = await db.select().from(pricingGroups).where(eq(pricingGroups.id, id));
    return newGroup;
  }

  async updatePricingGroup(id: number, group: Partial<InsertPricingGroup>): Promise<PricingGroup> {
    await db.update(pricingGroups).set(group).where(eq(pricingGroups.id, id));
    const [updatedGroup] = await db.select().from(pricingGroups).where(eq(pricingGroups.id, id));
    if (!updatedGroup) throw new Error("Pricing group not found");
    return updatedGroup;
  }

  async getPayments(): Promise<Payment[]> {
    return await db.select().from(payments);
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    const results = await db.select().from(payments).where(eq(payments.id, id));
    return results[0];
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const result = await db.insert(payments).values(payment);
    const id = result[0].insertId;
    const [newPayment] = await db.select().from(payments).where(eq(payments.id, id));
    return newPayment;
  }

  async updatePaymentStatus(id: number, status: "pending" | "completed" | "failed" | "refunded"): Promise<Payment> {
    await db.update(payments).set({ status }).where(eq(payments.id, id));
    const [updatedPayment] = await db.select().from(payments).where(eq(payments.id, id));
    if (!updatedPayment) throw new Error("Payment not found");
    return updatedPayment;
  }

  async updateCustomerAutopay(
    customerId: number,
    enabled: boolean,
    method?: Record<string, any>,
    day?: number
  ): Promise<Customer> {
    await db.update(customers).set({ 
      autopayEnabled: enabled,
      autopayMethod: method ? method : null,
      autopayDay: day ?? null,
      recurringBillingStatus: enabled ? "active" : "not_activated"
    }).where(eq(customers.id, customerId));

    const [updatedCustomer] = await db.select().from(customers).where(eq(customers.id, customerId));
    if (!updatedCustomer) throw new Error("Customer not found");
    return updatedCustomer;
  }
}

export const storage = new DatabaseStorage();