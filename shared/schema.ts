import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("attendee"), // admin, organizer, approver, attendee
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Events table
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  locationCoordinates: jsonb("location_coordinates"),
  organizerId: varchar("organizer_id").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"), // approved, pending, rejected, cancelled
  image: text("image"),
  capacity: integer("capacity").notNull(),
  attendees: integer("attendees").notNull().default(0),
  category: text("category").notNull(), // Academic, Social, Sports, Workshop, Music
  tags: jsonb("tags").default([]),
  avgRating: real("avg_rating").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEventSchema = createInsertSchema(events).omit({ id: true, createdAt: true });
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// Event Reviews
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull().references(() => events.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

// Event Attendees
export const attendees = pgTable("attendees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull().references(() => events.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  status: text("status").notNull().default("registered"), // registered, checked-in, waitlist
  checkedInAt: timestamp("checked_in_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAttendeeSchema = createInsertSchema(attendees).omit({ id: true, createdAt: true });
export type InsertAttendee = z.infer<typeof insertAttendeeSchema>;
export type Attendee = typeof attendees.$inferSelect;

// Notifications
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  type: text("type").notNull().default("info"), // info, success, warning, error
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

// Activity Feed
export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  eventId: varchar("event_id").references(() => events.id),
  type: text("type").notNull(), // registered, checked-in, reviewed
  detail: text("detail"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activities).omit({ id: true, createdAt: true });
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
