import { type Unit, type Customer, type Booking, type InsertUnit, type InsertCustomer, type InsertBooking } from "@shared/schema";
import { units, customers, bookings } from "@shared/schema";
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
  getCustomers(): Promise<Customer[]>; // Added getCustomers method

  // Bookings
  getBookings(): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking>;
}

export class DatabaseStorage implements IStorage {
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

  async getCustomers(): Promise<Customer[]> { // Added getCustomers implementation
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

  async updateBookingStatus(id: number, status: string): Promise<Booking> {
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
}

export const storage = new DatabaseStorage();