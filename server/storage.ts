import { db } from "./db";
import { users, events, reviews, attendees, notifications, activities } from "@shared/schema";
import { type InsertUser, type User, type InsertEvent, type Event, type InsertReview, type Review, type InsertAttendee, type Attendee, type InsertNotification, type Notification, type InsertActivity, type Activity } from "@shared/schema";
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

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private events: Map<string, Event> = new Map();
  private reviews: Map<string, Review> = new Map();
  private attendees: Map<string, Attendee> = new Map();
  private notifications: Map<string, Notification> = new Map();
  private activities: Map<string, Activity> = new Map();
  private idCounter = 1;

  private getId(): string {
    return (this.idCounter++).toString();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.getId();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(), 
      role: insertUser.role || "attendee", 
      avatar: insertUser.avatar || null 
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getEvent(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getEventsByStatus(status: string): Promise<Event[]> {
    return Array.from(this.events.values()).filter(e => e.status === status);
  }

  async getEventsByOrganizer(organizerId: string): Promise<Event[]> {
    return Array.from(this.events.values()).filter(e => e.organizerId === organizerId);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.getId();
    const event: Event = {
      ...insertEvent,
      id,
      createdAt: new Date(),
      attendees: 0,
      avgRating: 0,
      status: insertEvent.status || "pending",
      image: insertEvent.image || null,
      locationCoordinates: insertEvent.locationCoordinates || null,
      tags: insertEvent.tags || []
    };
    this.events.set(id, event);
    return event;
  }

  async updateEventStatus(id: string, status: string): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    const updated = { ...event, status };
    this.events.set(id, updated);
    return updated;
  }

  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEventReviews(eventId: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(r => r.eventId === eventId);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.getId();
    const review: Review = { ...insertReview, id, createdAt: new Date(), comment: insertReview.comment || null };
    this.reviews.set(id, review);
    return review;
  }

  async getEventAttendees(eventId: string): Promise<Attendee[]> {
    return Array.from(this.attendees.values()).filter(a => a.eventId === eventId);
  }

  async getUserEventRegistration(eventId: string, userId: string): Promise<Attendee | undefined> {
    return Array.from(this.attendees.values()).find(a => a.eventId === eventId && a.userId === userId);
  }

  async registerAttendee(insertAttendee: InsertAttendee): Promise<Attendee> {
    const id = this.getId();
    const attendee: Attendee = {
      ...insertAttendee,
      id,
      createdAt: new Date(),
      status: insertAttendee.status || "registered",
      checkedInAt: null
    };
    this.attendees.set(id, attendee);
    
    // Update event attendee count
    const event = this.events.get(insertAttendee.eventId);
    if (event && insertAttendee.status !== "waitlist") {
        this.events.set(event.id, { ...event, attendees: event.attendees + 1 });
    }
    
    return attendee;
  }

  async checkInAttendee(attendeeId: string): Promise<Attendee | undefined> {
    const attendee = this.attendees.get(attendeeId);
    if (!attendee) return undefined;
    const updated = { ...attendee, status: "checked-in", checkedInAt: new Date() };
    this.attendees.set(attendeeId, updated);
    return updated;
  }

  async getAttendeeCount(eventId: string): Promise<number> {
    return Array.from(this.attendees.values()).filter(a => a.eventId === eventId && a.status !== "waitlist").length;
  }

  async getUserNotifications(userId: string): Promise<InsertNotification[]> {
    return Array.from(this.notifications.values()).filter(n => n.userId === userId);
  }

  async createNotification(insertNotification: InsertNotification): Promise<void> {
    const id = this.getId();
    const notification: Notification = { 
        ...insertNotification, 
        id, 
        createdAt: new Date(),
        read: insertNotification.read || false,
        type: insertNotification.type || "info"
    };
    this.notifications.set(id, notification);
  }

  async getRecentActivities(limit: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async createActivity(insertActivity: InsertActivity): Promise<void> {
    const id = this.getId();
    const activity: Activity = { 
        ...insertActivity, 
        id, 
        createdAt: new Date(),
        detail: insertActivity.detail || null,
        eventId: insertActivity.eventId || null
    };
    this.activities.set(id, activity);
  }
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
  storage = new MemStorage();
}

export { storage };
