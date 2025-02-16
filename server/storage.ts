import { type Unit, type Customer, type Booking, type Lead, type PricingGroup, type Payment } from "@shared/schema";
import { type InsertUnit, type InsertCustomer, type InsertBooking, type InsertLead, type InsertPricingGroup, type InsertPayment } from "@shared/schema";
import { units, customers, bookings, leads, pricingGroups, payments } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { 
  type NotificationTemplate, type NotificationLog,
  type InsertNotificationTemplate, type InsertNotificationLog,
  notificationTemplates, notificationLogs,
  type CustomerDocument, type CustomerInsurance, type DigitalSignature,
  type InsertCustomerDocument, type InsertCustomerInsurance, type InsertDigitalSignature,
  customerDocuments, customerInsurance, digitalSignatures
} from "@shared/schema";

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

  // Notification Templates
  getNotificationTemplates(): Promise<NotificationTemplate[]>;
  getNotificationTemplate(id: number): Promise<NotificationTemplate | undefined>;
  createNotificationTemplate(template: InsertNotificationTemplate): Promise<NotificationTemplate>;
  updateNotificationTemplate(id: number, template: Partial<InsertNotificationTemplate>): Promise<NotificationTemplate>;
  toggleNotificationTemplate(id: number, isActive: boolean): Promise<NotificationTemplate>;

  // Notification Logs
  getNotificationLogs(customerId?: number): Promise<NotificationLog[]>;
  createNotificationLog(log: InsertNotificationLog): Promise<NotificationLog>;
  updateNotificationLogStatus(id: number, status: "sent" | "failed", errorMessage?: string): Promise<NotificationLog>;

  // Customer Portal Methods
  getCustomerDocuments(customerId: number): Promise<CustomerDocument[]>;
  createCustomerDocument(document: InsertCustomerDocument): Promise<CustomerDocument>;
  updateCustomerDocument(id: number, document: Partial<InsertCustomerDocument>): Promise<CustomerDocument>;
  deleteCustomerDocument(id: number): Promise<void>;

  getCustomerInsurance(customerId: number): Promise<CustomerInsurance[]>;
  createCustomerInsurance(insurance: InsertCustomerInsurance): Promise<CustomerInsurance>;
  updateCustomerInsurance(id: number, insurance: Partial<InsertCustomerInsurance>): Promise<CustomerInsurance>;

  createDigitalSignature(signature: InsertDigitalSignature): Promise<DigitalSignature>;
  getDocumentSignatures(documentId: number): Promise<DigitalSignature[]>;
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

  // Notification Templates
  async getNotificationTemplates(): Promise<NotificationTemplate[]> {
    return await db.select().from(notificationTemplates);
  }

  async getNotificationTemplate(id: number): Promise<NotificationTemplate | undefined> {
    const [template] = await db
      .select()
      .from(notificationTemplates)
      .where(eq(notificationTemplates.id, id));
    return template;
  }

  async createNotificationTemplate(template: InsertNotificationTemplate): Promise<NotificationTemplate> {
    const [newTemplate] = await db
      .insert(notificationTemplates)
      .values(template)
      .returning();
    return newTemplate;
  }

  async updateNotificationTemplate(
    id: number,
    template: Partial<InsertNotificationTemplate>
  ): Promise<NotificationTemplate> {
    const [updatedTemplate] = await db
      .update(notificationTemplates)
      .set({ ...template, updatedAt: new Date() })
      .where(eq(notificationTemplates.id, id))
      .returning();
    if (!updatedTemplate) throw new Error("Template not found");
    return updatedTemplate;
  }

  async toggleNotificationTemplate(id: number, isActive: boolean): Promise<NotificationTemplate> {
    const [updatedTemplate] = await db
      .update(notificationTemplates)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(notificationTemplates.id, id))
      .returning();
    if (!updatedTemplate) throw new Error("Template not found");
    return updatedTemplate;
  }

  // Notification Logs
  async getNotificationLogs(customerId?: number): Promise<NotificationLog[]> {
    let query = db.select().from(notificationLogs);
    if (customerId) {
      query = query.where(eq(notificationLogs.customerId, customerId));
    }
    return await query;
  }

  async createNotificationLog(log: InsertNotificationLog): Promise<NotificationLog> {
    const [newLog] = await db
      .insert(notificationLogs)
      .values(log)
      .returning();
    return newLog;
  }

  async updateNotificationLogStatus(
    id: number,
    status: "sent" | "failed",
    errorMessage?: string
  ): Promise<NotificationLog> {
    const [updatedLog] = await db
      .update(notificationLogs)
      .set({ 
        status, 
        errorMessage,
        sentAt: status === "sent" ? new Date() : null 
      })
      .where(eq(notificationLogs.id, id))
      .returning();
    if (!updatedLog) throw new Error("Log not found");
    return updatedLog;
  }

  // Customer Portal Methods
  async getCustomerDocuments(customerId: number): Promise<CustomerDocument[]> {
    return await db
      .select()
      .from(customerDocuments)
      .where(eq(customerDocuments.customerId, customerId));
  }

  async createCustomerDocument(document: InsertCustomerDocument): Promise<CustomerDocument> {
    const [newDocument] = await db
      .insert(customerDocuments)
      .values(document)
      .returning();
    return newDocument;
  }

  async updateCustomerDocument(
    id: number,
    document: Partial<InsertCustomerDocument>
  ): Promise<CustomerDocument> {
    const [updatedDocument] = await db
      .update(customerDocuments)
      .set({ ...document, updatedAt: new Date() })
      .where(eq(customerDocuments.id, id))
      .returning();
    if (!updatedDocument) throw new Error("Document not found");
    return updatedDocument;
  }

  async deleteCustomerDocument(id: number): Promise<void> {
    await db
      .delete(customerDocuments)
      .where(eq(customerDocuments.id, id));
  }

  async getCustomerInsurance(customerId: number): Promise<CustomerInsurance[]> {
    return await db
      .select()
      .from(customerInsurance)
      .where(eq(customerInsurance.customerId, customerId));
  }

  async createCustomerInsurance(insurance: InsertCustomerInsurance): Promise<CustomerInsurance> {
    const [newInsurance] = await db
      .insert(customerInsurance)
      .values(insurance)
      .returning();
    return newInsurance;
  }

  async updateCustomerInsurance(
    id: number,
    insurance: Partial<InsertCustomerInsurance>
  ): Promise<CustomerInsurance> {
    const [updatedInsurance] = await db
      .update(customerInsurance)
      .set({ ...insurance, updatedAt: new Date() })
      .where(eq(customerInsurance.id, id))
      .returning();
    if (!updatedInsurance) throw new Error("Insurance not found");
    return updatedInsurance;
  }

  async createDigitalSignature(signature: InsertDigitalSignature): Promise<DigitalSignature> {
    const [newSignature] = await db
      .insert(digitalSignatures)
      .values(signature)
      .returning();
    return newSignature;
  }

  async getDocumentSignatures(documentId: number): Promise<DigitalSignature[]> {
    return await db
      .select()
      .from(digitalSignatures)
      .where(eq(digitalSignatures.documentId, documentId));
  }

  async updateCustomerAutopay(
    customerId: number,
    enabled: boolean,
    method?: Record<string, any>,
    day?: number
  ): Promise<Customer> {
    const [updatedCustomer] = await db
      .update(customers)
      .set({ 
        autopayEnabled: enabled,
        autopayMethod: method ? method : null,
        autopayDay: day ?? null,
        recurringBillingStatus: enabled ? "active" : "not_activated"
      })
      .where(eq(customers.id, customerId))
      .returning();
    if (!updatedCustomer) throw new Error("Customer not found");
    return updatedCustomer;
  }
}

export const storage = new DatabaseStorage();