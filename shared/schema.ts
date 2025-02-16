import { pgTable, text, serial, integer, boolean, jsonb, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const unitTypes = ["small", "medium", "large", "extra-large"] as const;

export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  type: text("type", { enum: unitTypes }).notNull(),
  size: text("size").notNull(),
  price: integer("price").notNull(),
  isOccupied: boolean("is_occupied").notNull().default(false),
  location: text("location").notNull(),
  pricingGroupId: integer("pricing_group_id"),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  accessCode: text("access_code"),
  accountStatus: text("account_status", { enum: ["enabled", "disabled"] }).notNull().default("enabled"),
  recurringBillingStatus: text("recurring_billing_status", { enum: ["active", "not_activated"] }).notNull().default("not_activated"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  status: text("status", { enum: ["new", "contacted", "qualified", "converted", "lost"] }).notNull(),
  notes: text("notes"),
  unitTypeInterest: text("unit_type_interest", { enum: unitTypes }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const pricingGroups = pgTable("pricing_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  multiplier: decimal("multiplier").notNull(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull(),
  amount: integer("amount").notNull(),
  status: text("status", { enum: ["pending", "completed", "failed", "refunded"] }).notNull(),
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  unitId: integer("unit_id").notNull(),
  customerId: integer("customer_id").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  status: text("status", { enum: ["active", "completed", "cancelled"] }).notNull(),
});

// Schema for data insertion
export const insertUnitSchema = createInsertSchema(units).omit({ id: true, isOccupied: true });
export const insertCustomerSchema = createInsertSchema(customers).omit({ id: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true });
export const insertLeadSchema = createInsertSchema(leads).omit({ id: true, createdAt: true });
export const insertPricingGroupSchema = createInsertSchema(pricingGroups).omit({ id: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, createdAt: true });

// Types for TypeScript
export type Unit = typeof units.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type PricingGroup = typeof pricingGroups.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type InsertUnit = z.infer<typeof insertUnitSchema>;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type InsertPricingGroup = z.infer<typeof insertPricingGroupSchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export const unitSizeInfo = {
  small: { size: "5x5", price: 50, image: "https://images.unsplash.com/photo-1465779042638-3e4bfcc3475d" },
  medium: { size: "10x10", price: 100, image: "https://images.unsplash.com/photo-1719937051128-d2d7ccd7853c" },
  large: { size: "10x15", price: 150, image: "https://images.unsplash.com/photo-1576669801820-a9ab287ac2d1" },
  "extra-large": { size: "10x20", price: 200, image: "https://images.unsplash.com/photo-1719937050988-dd510cf0e512" }
};

export const facilityLayouts = pgTable("facility_layouts", {
  id: serial("id").primaryKey(),
  facilityId: integer("facility_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  layout: jsonb("layout").notNull(),  // Will store the grid layout configuration
  dimensions: jsonb("dimensions").notNull(), // Will store width and height of the layout
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Add new schema and types for facility layouts
export const insertFacilityLayoutSchema = createInsertSchema(facilityLayouts).omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true 
});

export type FacilityLayout = typeof facilityLayouts.$inferSelect;
export type InsertFacilityLayout = z.infer<typeof insertFacilityLayoutSchema>;

export const notificationTemplates = pgTable("notification_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type", { enum: ["email", "sms"] }).notNull(),
  subject: text("subject"),
  content: text("content").notNull(),
  trigger: text("trigger", { 
    enum: ["payment_late", "payment_due", "lien_warning", "lien_filed", "custom"] 
  }).notNull(),
  // For custom triggers
  triggerConditions: jsonb("trigger_conditions"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const notificationLogs = pgTable("notification_logs", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").notNull(),
  customerId: integer("customer_id").notNull(),
  status: text("status", { 
    enum: ["queued", "sent", "failed"] 
  }).notNull(),
  sentAt: timestamp("sent_at"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Add new schemas
export const insertNotificationTemplateSchema = createInsertSchema(notificationTemplates).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true,
  isActive: true
});

export const insertNotificationLogSchema = createInsertSchema(notificationLogs).omit({ 
  id: true,
  createdAt: true,
  sentAt: true
});

// Add new types
export type NotificationTemplate = typeof notificationTemplates.$inferSelect;
export type NotificationLog = typeof notificationLogs.$inferSelect;
export type InsertNotificationTemplate = z.infer<typeof insertNotificationTemplateSchema>;
export type InsertNotificationLog = z.infer<typeof insertNotificationLogSchema>;

// Update exports
export type { 
  Unit, Customer, Booking, Lead, PricingGroup, Payment, 
  InsertUnit, InsertCustomer, InsertBooking, InsertLead, InsertPricingGroup, InsertPayment,
  FacilityLayout, InsertFacilityLayout,
  NotificationTemplate, NotificationLog,
  InsertNotificationTemplate, InsertNotificationLog
};