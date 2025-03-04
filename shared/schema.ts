import { mysqlTable, text, int, boolean, json, timestamp, decimal } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const unitTypes = ["small", "medium", "large", "extra-large"] as const;

export const units = mysqlTable("units", {
  unit_id: int("unit_id").primaryKey().autoincrement(),
  type: text("type").notNull(),
  size: text("size").notNull(),
  price: int("price").notNull(),
  isOccupied: boolean("is_occupied").notNull().default(false),
  location: text("location").notNull(),
  pricingGroupId: int("pricing_group_id"),
  customerId: int("customer_id"),
});

export const customers = mysqlTable("customers", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  accessCode: text("access_code"),
  accountStatus: text("account_status").notNull().default("enabled"),
  recurringBillingStatus: text("recurring_billing_status").notNull().default("not_activated"),
  autopayEnabled: boolean("autopay_enabled").notNull().default(false),
  autopayMethod: json("autopay_method"),
  autopayDay: int("autopay_day"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const leads = mysqlTable("leads", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  status: text("status").notNull(),
  notes: text("notes"),
  unitTypeInterest: text("unit_type_interest"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const pricingGroups = mysqlTable("pricing_groups", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name").notNull(),
  description: text("description"),
  multiplier: decimal("multiplier").notNull(),
});

export const payments = mysqlTable("payments", {
  id: int("id").primaryKey().autoincrement(),
  bookingId: int("booking_id").notNull(),
  amount: int("amount").notNull(),
  status: text("status").notNull(),
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const bookings = mysqlTable("bookings", {
  id: int("id").primaryKey().autoincrement(),
  unitId: int("unit_id").notNull(),
  customerId: int("customer_id").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  status: text("status").notNull(),
  monthlyRate: decimal("monthly_rate").notNull(),
  nextBillDate: text("next_bill_date").notNull(),
  insuranceAmount: decimal("insurance_amount"),
});

// Schema for data insertion
export const insertUnitSchema = createInsertSchema(units).omit({ unit_id: true, isOccupied: true });
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

export const facilityLayouts = mysqlTable("facility_layouts", {
  id: int("id").primaryKey().autoincrement(),
  facilityId: int("facility_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  layout: json("layout").notNull(),
  dimensions: json("dimensions").notNull(),
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

export const notificationTemplates = mysqlTable("notification_templates", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  subject: text("subject"),
  content: text("content").notNull(),
  trigger: text("trigger").notNull(),
  triggerConditions: json("trigger_conditions"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const notificationLogs = mysqlTable("notification_logs", {
  id: int("id").primaryKey().autoincrement(),
  templateId: int("template_id").notNull(),
  customerId: int("customer_id").notNull(),
  status: text("status").notNull(),
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


export const customerDocuments = mysqlTable("customer_documents", {
  id: int("id").primaryKey().autoincrement(),
  customerId: int("customer_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  fileUrl: text("file_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const customerInsurance = mysqlTable("customer_insurance", {
  id: int("id").primaryKey().autoincrement(),
  customerId: int("customer_id").notNull(),
  provider: text("provider").notNull(),
  policyNumber: text("policy_number").notNull(),
  coverageAmount: int("coverage_amount").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const digitalSignatures = mysqlTable("digital_signatures", {
  id: int("id").primaryKey().autoincrement(),
  customerId: int("customer_id").notNull(),
  documentId: int("document_id").notNull(),
  signatureData: text("signature_data").notNull(),
  ipAddress: text("ip_address").notNull(),
  signedAt: timestamp("signed_at").notNull().defaultNow(),
});

// Add new schemas
export const insertCustomerDocumentSchema = createInsertSchema(customerDocuments).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertCustomerInsuranceSchema = createInsertSchema(customerInsurance).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertDigitalSignatureSchema = createInsertSchema(digitalSignatures).omit({
  id: true,
  signedAt: true
});

// Add new types
export type CustomerDocument = typeof customerDocuments.$inferSelect;
export type CustomerInsurance = typeof customerInsurance.$inferSelect;
export type DigitalSignature = typeof digitalSignatures.$inferSelect;
export type InsertCustomerDocument = z.infer<typeof insertCustomerDocumentSchema>;
export type InsertCustomerInsurance = z.infer<typeof insertCustomerInsuranceSchema>;
export type InsertDigitalSignature = z.infer<typeof insertDigitalSignatureSchema>;

// Added StorageManagerData table definition here
export const storageManagerData = mysqlTable("StorageManagerData", {
  id: int("id").primaryKey().autoincrement(),
  facilityId: int("facility_id").notNull(),
  facilityName: text("facility_name").notNull(),
  facilityCode: text("facility_code").notNull(),
  layoutId: int("layout_id"),
  pricingGroupId: int("pricing_group_id"),
  totalUnits: int("total_units").notNull(),
  availableUnits: int("available_units").notNull(),
  occupiedUnits: int("occupied_units").notNull(),
  maintenanceUnits: int("maintenance_units").notNull(),
  totalRevenue: decimal("total_revenue").notNull().default("0"),
  pendingPayments: decimal("pending_payments").notNull().default("0"),
  overduePayments: decimal("overdue_payments").notNull().default("0"),
  totalCustomers: int("total_customers").notNull().default(0),
  activeCustomers: int("active_customers").notNull().default(0),
  overdueCustomers: int("overdue_customers").notNull().default(0),
  totalBookings: int("total_bookings").notNull().default(0),
  activeBookings: int("active_bookings").notNull().default(0),
  totalLeads: int("total_leads").notNull().default(0),
  convertedLeads: int("converted_leads").notNull().default(0),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Add type definitions
export type StorageManagerData = typeof storageManagerData.$inferSelect;
export type InsertStorageManagerData = typeof storageManagerData.$inferInsert;

// Update exports
export type {
  Unit, Customer, Booking, Lead, PricingGroup, Payment,
  InsertUnit, InsertCustomer, InsertBooking, InsertLead, InsertPricingGroup, InsertPayment,
  FacilityLayout, InsertFacilityLayout,
  NotificationTemplate, NotificationLog,
  InsertNotificationTemplate, InsertNotificationLog,
  CustomerDocument, CustomerInsurance, DigitalSignature,
  InsertCustomerDocument, InsertCustomerInsurance, InsertDigitalSignature,
  StorageManagerData, InsertStorageManagerData
};

export const unitsRelations = relations(units, ({ one }) => ({
  customer: one(customers, {
    fields: [units.customerId],
    references: [customers.id],
  })
}));

export const customersRelations = relations(customers, ({ many }) => ({
  units: many(units)
}));