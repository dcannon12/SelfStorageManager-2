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