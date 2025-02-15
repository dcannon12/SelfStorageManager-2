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
  // Existing methods remain unchanged
  async getUnits(): Promise<Unit[]> {
    return await db.select().from(units);
  }

  async getUnit(id: number): Promise<Unit | undefined> {
    const [unit] = await db.select().from(units).where(eq(units.id, id));
    return unit;
  }

  async createUnit(unit: InsertUnit): Promise<Unit> {
    const [newUnit] = await db.insert(units).values(unit).returning();
    return newUnit;
  }

  async updateUnitStatus(id: number, isOccupied: boolean): Promise<Unit> {
    const [updatedUnit] = await db
      .update(units)
      .set({ isOccupied })
      .where(eq(units.id, id))
      .returning();
    if (!updatedUnit) throw new Error("Unit not found");
    return updatedUnit;
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }

  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers);
  }

  async getBookings(): Promise<Booking[]> {
    return await db.select().from(bookings);
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    await this.updateUnitStatus(booking.unitId, true);
    return newBooking;
  }

  async updateBookingStatus(id: number, status: "active" | "completed" | "cancelled"): Promise<Booking> {
    const [updatedBooking] = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, id))
      .returning();
    if (!updatedBooking) throw new Error("Booking not found");

    if (status === "completed" || status === "cancelled") {
      await this.updateUnitStatus(updatedBooking.unitId, false);
    }
    return updatedBooking;
  }

  // New methods for facility management
  async getLeads(): Promise<Lead[]> {
    return await db.select().from(leads);
  }

  async getLead(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const [newLead] = await db.insert(leads).values(lead).returning();
    return newLead;
  }

  async updateLeadStatus(id: number, status: "new" | "contacted" | "qualified" | "converted" | "lost"): Promise<Lead> {
    const [updatedLead] = await db
      .update(leads)
      .set({ status })
      .where(eq(leads.id, id))
      .returning();
    if (!updatedLead) throw new Error("Lead not found");
    return updatedLead;
  }

  async getPricingGroups(): Promise<PricingGroup[]> {
    return await db.select().from(pricingGroups);
  }

  async getPricingGroup(id: number): Promise<PricingGroup | undefined> {
    const [group] = await db.select().from(pricingGroups).where(eq(pricingGroups.id, id));
    return group;
  }

  async createPricingGroup(group: InsertPricingGroup): Promise<PricingGroup> {
    const [newGroup] = await db.insert(pricingGroups).values(group).returning();
    return newGroup;
  }

  async updatePricingGroup(id: number, group: Partial<InsertPricingGroup>): Promise<PricingGroup> {
    const [updatedGroup] = await db
      .update(pricingGroups)
      .set(group)
      .where(eq(pricingGroups.id, id))
      .returning();
    if (!updatedGroup) throw new Error("Pricing group not found");
    return updatedGroup;
  }

  async getPayments(): Promise<Payment[]> {
    return await db.select().from(payments);
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment;
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }

  async updatePaymentStatus(id: number, status: "pending" | "completed" | "failed" | "refunded"): Promise<Payment> {
    const [updatedPayment] = await db
      .update(payments)
      .set({ status })
      .where(eq(payments.id, id))
      .returning();
    if (!updatedPayment) throw new Error("Payment not found");
    return updatedPayment;
  }
}

export const storage = new DatabaseStorage();