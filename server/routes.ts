import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertUnitSchema, insertCustomerSchema, insertBookingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express) {
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

  app.post("/api/customers", async (req, res) => {
    const result = insertCustomerSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid customer data" });
    }
    const customer = await storage.createCustomer(result.data);
    res.status(201).json(customer);
  });

  app.get("/api/bookings", async (req, res) => {
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
    const result = z.object({ status: z.enum(["active", "completed", "cancelled"]) }).safeParse(req.body);
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

  const httpServer = createServer(app);
  return httpServer;
}
