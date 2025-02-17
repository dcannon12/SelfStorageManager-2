import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { 
  insertUnitSchema, 
  insertCustomerSchema, 
  insertBookingSchema, 
  insertLeadSchema,
  insertPricingGroupSchema,
  insertPaymentSchema,
  unitSizeInfo,
  insertNotificationTemplateSchema,
  insertNotificationLogSchema
} from "@shared/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { storageManagerData } from "@shared/schema";
import { db } from "./db";

async function seedUnits() {
  const existingUnits = await storage.getUnits();
  if (existingUnits.length === 0) {
    // Create sample units
    for (const [type, info] of Object.entries(unitSizeInfo)) {
      const floorNumber = Math.floor(Math.random() * 3) + 1;
      const blockLetter = String.fromCharCode(65 + Math.floor(Math.random() * 4));
      await storage.createUnit({
        type: type as any,
        size: info.size,
        price: info.price,
        location: `Floor ${floorNumber}, Block ${blockLetter}`,
      });
    }
  }
}

export async function registerRoutes(app: Express) {
  // Seed units on startup
  await seedUnits();

  // Units
  app.get("/api/units", async (req, res) => {
    const units = await storage.getUnits();
    res.json(units);
  });

  app.get("/api/units/:id", async (req, res) => {
    const unit = await storage.getUnit(Number(req.params.id));
    if (!unit) return res.status(404).json({ message: "Unit not found" });
    res.json(unit);
  });

  app.post("/api/units", async (req, res) => {
    const result = insertUnitSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid unit data" });
    }
    const unit = await storage.createUnit(result.data);
    res.status(201).json(unit);
  });

  // Customers
  app.post("/api/customers", async (req, res) => {
    const result = insertCustomerSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid customer data" });
    }
    const customer = await storage.createCustomer(result.data);
    res.status(201).json(customer);
  });

  app.get("/api/customers", async (req, res) => {
    const customers = await storage.getCustomers();
    res.json(customers);
  });

  app.get("/api/customers/:id", async (req, res) => {
    const customer = await storage.getCustomer(Number(req.params.id));
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  });

  // Bookings
  app.get("/api/bookings", async (req, res) => {
    if (req.query.customerId) {
      const customerBookings = await storage.getBookings().then(bookings => 
        bookings.filter(booking => booking.customerId === Number(req.query.customerId))
      );
      return res.json(customerBookings);
    }
    const bookings = await storage.getBookings();
    res.json(bookings);
  });

  app.post("/api/bookings", async (req, res) => {
    const result = insertBookingSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid booking data" });
    }

    const unit = await storage.getUnit(result.data.unitId);
    if (!unit) {
      return res.status(404).json({ message: "Unit not found" });
    }
    if (unit.isOccupied) {
      return res.status(400).json({ message: "Unit is already occupied" });
    }

    const booking = await storage.createBooking(result.data);
    res.status(201).json(booking);
  });

  app.patch("/api/bookings/:id/status", async (req, res) => {
    const result = z.object({ 
      status: z.enum(["active", "completed", "cancelled"]) 
    }).safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ message: "Invalid status" });
    }

    try {
      const booking = await storage.updateBookingStatus(Number(req.params.id), result.data.status);
      res.json(booking);
    } catch (error) {
      res.status(404).json({ message: "Booking not found" });
    }
  });

  // Leads
  app.get("/api/leads", async (req, res) => {
    const leads = await storage.getLeads();
    res.json(leads);
  });

  app.get("/api/leads/:id", async (req, res) => {
    const lead = await storage.getLead(Number(req.params.id));
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  });

  app.post("/api/leads", async (req, res) => {
    const result = insertLeadSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid lead data" });
    }
    const lead = await storage.createLead(result.data);
    res.status(201).json(lead);
  });

  app.patch("/api/leads/:id/status", async (req, res) => {
    const result = z.object({
      status: z.enum(["new", "contacted", "qualified", "converted", "lost"])
    }).safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ message: "Invalid status" });
    }

    try {
      const lead = await storage.updateLeadStatus(Number(req.params.id), result.data.status);
      res.json(lead);
    } catch (error) {
      res.status(404).json({ message: "Lead not found" });
    }
  });

  // Pricing Groups
  app.get("/api/pricing-groups", async (req, res) => {
    const groups = await storage.getPricingGroups();
    res.json(groups);
  });

  app.get("/api/pricing-groups/:id", async (req, res) => {
    const group = await storage.getPricingGroup(Number(req.params.id));
    if (!group) return res.status(404).json({ message: "Pricing group not found" });
    res.json(group);
  });

  app.post("/api/pricing-groups", async (req, res) => {
    const result = insertPricingGroupSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid pricing group data" });
    }
    const group = await storage.createPricingGroup(result.data);
    res.status(201).json(group);
  });

  app.patch("/api/pricing-groups/:id", async (req, res) => {
    const result = insertPricingGroupSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid pricing group data" });
    }

    try {
      const group = await storage.updatePricingGroup(Number(req.params.id), result.data);
      res.json(group);
    } catch (error) {
      res.status(404).json({ message: "Pricing group not found" });
    }
  });

  // Payments
  app.get("/api/payments", async (req, res) => {
    if (req.query.customerId) {
      const customerPayments = await storage.getPayments().then(payments =>
        payments.filter(payment => {
          const booking = storage.getBookings().find(b => b.id === payment.bookingId);
          return booking && booking.customerId === Number(req.query.customerId);
        })
      );
      return res.json(customerPayments);
    }
    const payments = await storage.getPayments();
    res.json(payments);
  });

  app.get("/api/payments/:id", async (req, res) => {
    const payment = await storage.getPayment(Number(req.params.id));
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  });

  app.post("/api/payments", async (req, res) => {
    const result = insertPaymentSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid payment data" });
    }
    const payment = await storage.createPayment(result.data);
    res.status(201).json(payment);
  });

  app.patch("/api/payments/:id/status", async (req, res) => {
    const result = z.object({
      status: z.enum(["pending", "completed", "failed", "refunded"])
    }).safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ message: "Invalid status" });
    }

    try {
      const payment = await storage.updatePaymentStatus(Number(req.params.id), result.data.status);
      res.json(payment);
    } catch (error) {
      res.status(404).json({ message: "Payment not found" });
    }
  });

  // Notification Templates
  app.get("/api/notification-templates", async (req, res) => {
    const templates = await storage.getNotificationTemplates();
    res.json(templates);
  });

  app.get("/api/notification-templates/:id", async (req, res) => {
    const template = await storage.getNotificationTemplate(Number(req.params.id));
    if (!template) return res.status(404).json({ message: "Template not found" });
    res.json(template);
  });

  app.post("/api/notification-templates", async (req, res) => {
    const result = insertNotificationTemplateSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid template data" });
    }
    const template = await storage.createNotificationTemplate(result.data);
    res.status(201).json(template);
  });

  app.patch("/api/notification-templates/:id", async (req, res) => {
    const result = insertNotificationTemplateSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid template data" });
    }

    try {
      const template = await storage.updateNotificationTemplate(Number(req.params.id), result.data);
      res.json(template);
    } catch (error) {
      res.status(404).json({ message: "Template not found" });
    }
  });

  app.patch("/api/notification-templates/:id/toggle", async (req, res) => {
    const result = z.object({ 
      isActive: z.boolean()
    }).safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ message: "Invalid status" });
    }

    try {
      const template = await storage.toggleNotificationTemplate(
        Number(req.params.id),
        result.data.isActive
      );
      res.json(template);
    } catch (error) {
      res.status(404).json({ message: "Template not found" });
    }
  });

  // Notification Logs
  app.get("/api/notification-logs", async (req, res) => {
    const customerId = req.query.customerId ? Number(req.query.customerId) : undefined;
    const logs = await storage.getNotificationLogs(customerId);
    res.json(logs);
  });

  app.post("/api/notification-logs", async (req, res) => {
    const result = insertNotificationLogSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid log data" });
    }
    const log = await storage.createNotificationLog(result.data);
    res.status(201).json(log);
  });

  // Add new facility metrics endpoints
  app.get("/api/facility-metrics", async (req, res) => {
    try {
      const metrics = await db.select().from(storageManagerData);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch facility metrics" });
    }
  });

  app.get("/api/facility-metrics/:id", async (req, res) => {
    try {
      const [metrics] = await db
        .select()
        .from(storageManagerData)
        .where(eq(storageManagerData.facilityId, Number(req.params.id)));

      if (!metrics) {
        return res.status(404).json({ message: "Facility metrics not found" });
      }

      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch facility metrics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}