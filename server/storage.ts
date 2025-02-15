import { type Unit, type Customer, type Booking, type InsertUnit, type InsertCustomer, type InsertBooking, unitSizeInfo } from "@shared/schema";

export interface IStorage {
  // Units
  getUnits(): Promise<Unit[]>;
  getUnit(id: number): Promise<Unit | undefined>;
  createUnit(unit: InsertUnit): Promise<Unit>;
  updateUnitStatus(id: number, isOccupied: boolean): Promise<Unit>;

  // Customers
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;

  // Bookings
  getBookings(): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking>;
}

export class MemStorage implements IStorage {
  private units: Map<number, Unit>;
  private customers: Map<number, Customer>;
  private bookings: Map<number, Booking>;
  private currentIds: { units: number; customers: number; bookings: number };

  constructor() {
    this.units = new Map();
    this.customers = new Map();
    this.bookings = new Map();
    this.currentIds = { units: 1, customers: 1, bookings: 1 };
    
    // Initialize with some sample units
    Object.entries(unitSizeInfo).forEach(([type, info], index) => {
      const unit: Unit = {
        id: this.currentIds.units++,
        type: type as Unit["type"],
        size: info.size,
        price: info.price,
        isOccupied: false,
        location: `Floor ${Math.floor(index / 4) + 1}, Block ${String.fromCharCode(65 + (index % 4))}`,
      };
      this.units.set(unit.id, unit);
    });
  }

  async getUnits(): Promise<Unit[]> {
    return Array.from(this.units.values());
  }

  async getUnit(id: number): Promise<Unit | undefined> {
    return this.units.get(id);
  }

  async createUnit(unit: InsertUnit): Promise<Unit> {
    const id = this.currentIds.units++;
    const newUnit = { ...unit, id, isOccupied: false };
    this.units.set(id, newUnit);
    return newUnit;
  }

  async updateUnitStatus(id: number, isOccupied: boolean): Promise<Unit> {
    const unit = this.units.get(id);
    if (!unit) throw new Error("Unit not found");
    const updatedUnit = { ...unit, isOccupied };
    this.units.set(id, updatedUnit);
    return updatedUnit;
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const id = this.currentIds.customers++;
    const newCustomer = { ...customer, id };
    this.customers.set(id, newCustomer);
    return newCustomer;
  }

  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.currentIds.bookings++;
    const newBooking = { ...booking, id };
    this.bookings.set(id, newBooking);
    await this.updateUnitStatus(booking.unitId, true);
    return newBooking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking> {
    const booking = this.bookings.get(id);
    if (!booking) throw new Error("Booking not found");
    const updatedBooking = { ...booking, status };
    this.bookings.set(id, updatedBooking);
    if (status === "completed" || status === "cancelled") {
      await this.updateUnitStatus(booking.unitId, false);
    }
    return updatedBooking;
  }
}

export const storage = new MemStorage();
