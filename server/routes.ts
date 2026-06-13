import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEventSchema, insertReviewSchema, insertAttendeeSchema, insertNotificationSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key_123";

// Middleware to check authentication
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    (req as any).user = user;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(cookieParser());

  // ===== AUTH API =====
  app.post("/api/auth/register", async (req, res) => {
    try {
      const schema = insertUserSchema.extend({
        password: z.string().min(6, "Password must be at least 6 characters"),
      });
      
      const validated = schema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(validated.email);
      if (existingUser) {
        return res.status(409).json({ error: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(validated.password, 10);
      const user = await storage.createUser({
        ...validated,
        password: hashedPassword,
      });

      // Don't return password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/auth/me", authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const user = await storage.getUser(userId);
      if (!user) return res.status(404).json({ error: "User not found" });
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // ===== USERS API =====
  app.get("/api/users", authenticateToken, async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      res.json(allUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id/events", authenticateToken, async (req, res) => {
    try {
      const userId = req.params.id;
      const allEvents = await storage.getAllEvents();
      const registeredEvents = [];
      for (const event of allEvents) {
        const reg = await storage.getUserEventRegistration(event.id, userId);
        if (reg) {
          registeredEvents.push({
            ...event,
            registrationStatus: reg.status,
          });
        }
      }
      res.json(registeredEvents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user events" });
    }
  });

  // ===== EVENTS API =====
  app.get("/api/events", async (req, res) => {
    try {
      const status = req.query.status as string;
      if (status) {
        const eventList = await storage.getEventsByStatus(status);
        return res.json(eventList);
      }
      const allEvents = await storage.getAllEvents();
      res.json(allEvents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) return res.status(404).json({ error: "Event not found" });
      
      // Get attendees and reviews
      const eventAttendees = await storage.getEventAttendees(event.id);
      const eventReviews = await storage.getEventReviews(event.id);
      
      const attendeesWithUser = await Promise.all(
        eventAttendees.map(async (a) => {
          const u = await storage.getUser(a.userId);
          return {
            ...a,
            name: u ? u.name : "Anonymous",
            email: u ? u.email : "",
          };
        })
      );

      const reviewsWithUser = await Promise.all(
        eventReviews.map(async (r) => {
          const u = await storage.getUser(r.userId);
          return {
            ...r,
            userName: u ? u.name : "Anonymous",
          };
        })
      );
      
      res.json({
        ...event,
        attendeeList: attendeesWithUser.filter(a => a.status === "registered" || a.status === "checked-in"),
        waitlist: attendeesWithUser.filter(a => a.status === "waitlist"),
        reviews: reviewsWithUser,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });

  app.post("/api/events", authenticateToken, async (req, res) => {
    try {
      const validated = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validated);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ error: "Failed to create event" });
    }
  });

  app.patch("/api/events/:id/status", authenticateToken, async (req, res) => {
    try {
      const { status } = req.body;
      if (!["approved", "rejected", "cancelled"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      const event = await storage.updateEventStatus(req.params.id, status);
      if (!event) return res.status(404).json({ error: "Event not found" });
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to update event status" });
    }
  });

  app.get("/api/events/:id/attendees", authenticateToken, async (req, res) => {
    try {
      const attendeeList = await storage.getEventAttendees(req.params.id);
      res.json(attendeeList);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch attendees" });
    }
  });

  // ===== REVIEWS API =====
  app.get("/api/events/:id/reviews", async (req, res) => {
    try {
      const eventReviews = await storage.getEventReviews(req.params.id);
      res.json(eventReviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  app.post("/api/events/:id/reviews", authenticateToken, async (req, res) => {
    try {
      const validated = insertReviewSchema.parse({
        ...req.body,
        eventId: req.params.id,
      });
      const review = await storage.createReview(validated);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  // ===== ATTENDEES API =====
  app.post("/api/events/:id/register", authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      
      // Check if already registered
      const existing = await storage.getUserEventRegistration(req.params.id, userId);
      if (existing) {
        return res.status(400).json({ error: "Already registered" });
      }

      // Get event to check capacity
      const event = await storage.getEvent(req.params.id);
      if (!event) return res.status(404).json({ error: "Event not found" });

      const count = await storage.getAttendeeCount(req.params.id);
      const status = count >= event.capacity ? "waitlist" : "registered";

      const attendee = await storage.registerAttendee({
        eventId: req.params.id,
        userId,
        status,
      });

      // Log activity
      await storage.createActivity({
        userId,
        eventId: req.params.id,
        type: "registered",
        detail: `registered for ${event.title}`,
      });

      res.status(201).json(attendee);
    } catch (error) {
      res.status(500).json({ error: "Failed to register" });
    }
  });

  app.post("/api/attendees/:id/checkin", authenticateToken, async (req, res) => {
    try {
      const attendee = await storage.checkInAttendee(req.params.id);
      if (!attendee) return res.status(404).json({ error: "Attendee not found" });

      // Log activity
      await storage.createActivity({
        userId: attendee.userId,
        eventId: attendee.eventId,
        type: "checked-in",
        detail: "checked in",
      });

      res.json(attendee);
    } catch (error) {
      res.status(500).json({ error: "Failed to check in" });
    }
  });

  // ===== NOTIFICATIONS API =====
  app.get("/api/notifications/:userId", authenticateToken, async (req, res) => {
    try {
      const notificationList = await storage.getUserNotifications(req.params.userId);
      res.json(notificationList);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.post("/api/notifications/send-bulk", authenticateToken, async (req, res) => {
    try {
      const { eventId, subject, message } = req.body;
      if (!eventId || !message) {
        return res.status(400).json({ error: "eventId and message are required" });
      }

      // Get all attendees for the event
      const attendeeList = await storage.getEventAttendees(eventId);

      // Create notification for each attendee
      for (const attendee of attendeeList) {
        await storage.createNotification({
          userId: attendee.userId,
          message,
          type: "info",
        });
      }

      res.json({ sent: attendeeList.length });
    } catch (error) {
      res.status(500).json({ error: "Failed to send notifications" });
    }
  });

  // ===== ACTIVITY FEED API =====
  app.get("/api/activities", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const recentActivities = await storage.getRecentActivities(limit);
      
      const activitiesWithUser = await Promise.all(
        recentActivities.map(async (act) => {
          const user = await storage.getUser(act.userId);
          return {
            ...act,
            userName: user ? user.name : "Anonymous",
          };
        })
      );
      
      res.json(activitiesWithUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  // ===== ANALYTICS API =====
  app.get("/api/analytics/events", authenticateToken, async (req, res) => {
    try {
      const allEvents = await storage.getAllEvents();
      res.json({
        total: allEvents.length,
        approved: allEvents.filter(e => e.status === "approved").length,
        pending: allEvents.filter(e => e.status === "pending").length,
        totalAttendees: allEvents.reduce((sum, e) => sum + e.attendees, 0),
        avgRating: allEvents.reduce((sum, e) => sum + e.avgRating, 0) / allEvents.length,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
