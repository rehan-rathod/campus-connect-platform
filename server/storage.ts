import { db } from "./db";
import { users, events, reviews, attendees, notifications, activities } from "@shared/schema";
import { type InsertUser, type User, type InsertEvent, type Event, type InsertReview, type Review, type InsertAttendee, type Attendee, type InsertNotification, type InsertActivity, type Activity } from "@shared/schema";
import { eq, desc, gte, lte, and, ne } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Events
  getEvent(id: string): Promise<Event | undefined>;
  getEventsByStatus(status: string): Promise<Event[]>;
  getEventsByOrganizer(organizerId: string): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEventStatus(id: string, status: string): Promise<Event | undefined>;
  getAllEvents(): Promise<Event[]>;

  // Reviews
  getEventReviews(eventId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Attendees
  getEventAttendees(eventId: string): Promise<Attendee[]>;
  getUserEventRegistration(eventId: string, userId: string): Promise<Attendee | undefined>;
  registerAttendee(attendee: InsertAttendee): Promise<Attendee>;
  checkInAttendee(attendeeId: string): Promise<Attendee | undefined>;
  getAttendeeCount(eventId: string): Promise<number>;

  // Notifications
  getUserNotifications(userId: string): Promise<InsertNotification[]>;
  createNotification(notification: InsertNotification): Promise<void>;

  // Activities
  getRecentActivities(limit: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<void>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
    return result[0];
  }

  async getEventsByStatus(status: string): Promise<Event[]> {
    return db.select().from(events).where(eq(events.status, status)).orderBy(desc(events.createdAt));
  }

  async getEventsByOrganizer(organizerId: string): Promise<Event[]> {
    return db.select().from(events).where(eq(events.organizerId, organizerId));
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const result = await db.insert(events).values(event).returning();
    return result[0];
  }

  async updateEventStatus(id: string, status: string): Promise<Event | undefined> {
    const result = await db.update(events).set({ status }).where(eq(events.id, id)).returning();
    return result[0];
  }

  async getAllEvents(): Promise<Event[]> {
    return db.select().from(events).orderBy(desc(events.createdAt));
  }

  async getEventReviews(eventId: string): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.eventId, eventId));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const result = await db.insert(reviews).values(review).returning();
    return result[0];
  }

  async getEventAttendees(eventId: string): Promise<Attendee[]> {
    return db.select().from(attendees).where(eq(attendees.eventId, eventId));
  }

  async getUserEventRegistration(eventId: string, userId: string): Promise<Attendee | undefined> {
    const result = await db
      .select()
      .from(attendees)
      .where(and(eq(attendees.eventId, eventId), eq(attendees.userId, userId)))
      .limit(1);
    return result[0];
  }

  async registerAttendee(attendee: InsertAttendee): Promise<Attendee> {
    const result = await db.insert(attendees).values(attendee).returning();
    return result[0];
  }

  async checkInAttendee(attendeeId: string): Promise<Attendee | undefined> {
    const result = await db
      .update(attendees)
      .set({ status: "checked-in", checkedInAt: new Date() })
      .where(eq(attendees.id, attendeeId))
      .returning();
    return result[0];
  }

  async getAttendeeCount(eventId: string): Promise<number> {
    const result = await db
      .select({ count: attendees.userId })
      .from(attendees)
      .where(and(eq(attendees.eventId, eventId), ne(attendees.status, "waitlist")));
    return result.length;
  }

  async getUserNotifications(userId: string): Promise<InsertNotification[]> {
    return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<void> {
    await db.insert(notifications).values(notification);
  }

  async getRecentActivities(limit: number = 10) {
    const result = await db
      .select()
      .from(activities)
      .orderBy(desc(activities.createdAt))
      .limit(limit);
    return result;
  }

  async createActivity(activity: InsertActivity): Promise<void> {
    await db.insert(activities).values(activity);
  }
}

let storage: IStorage;

if (process.env.DATABASE_URL) {
  storage = new DbStorage();
} else {
  throw new Error("DATABASE_URL environment variable is required");
}

export { storage };
