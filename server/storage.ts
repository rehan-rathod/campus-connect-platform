import { db } from "./db";
import { users, events, reviews, attendees, notifications, activities } from "@shared/schema";
import { type InsertUser, type User, type InsertEvent, type Event, type InsertReview, type Review, type InsertAttendee, type Attendee, type InsertNotification, type Notification, type InsertActivity, type Activity } from "@shared/schema";
import { eq, desc, gte, lte, and, ne } from "drizzle-orm";
import bcrypt from "bcryptjs";

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

  constructor() {
    this.seed();
  }

  private seed() {
    const hashedPassword = bcrypt.hashSync("password123", 10);
    
    // Seed Users
    const u1: User = { id: "u1", name: "Dr. Sarah Johnson", email: "sarah@university.edu", password: hashedPassword, role: "approver", avatar: null, createdAt: new Date() };
    const u2: User = { id: "u2", name: "Prof. Jane Doe", email: "jane@university.edu", password: hashedPassword, role: "organizer", avatar: null, createdAt: new Date() };
    const u3: User = { id: "u3", name: "Admin User", email: "admin@university.edu", password: hashedPassword, role: "admin", avatar: null, createdAt: new Date() };
    const u4: User = { id: "u4", name: "Dave Student", email: "dave@university.edu", password: hashedPassword, role: "attendee", avatar: null, createdAt: new Date() };
    const u5: User = { id: "u5", name: "Emma Engineer", email: "emma@university.edu", password: hashedPassword, role: "attendee", avatar: null, createdAt: new Date() };
    
    this.users.set(u1.id, u1);
    this.users.set(u2.id, u2);
    this.users.set(u3.id, u3);
    this.users.set(u4.id, u4);
    this.users.set(u5.id, u5);

    this.idCounter = 6;

    // Seed Events
    const ITM_COORDINATES = { lat: 22.4501584, lng: 73.3522416 };
    const addDays = (d: Date, days: number) => {
      const result = new Date(d);
      result.setDate(result.getDate() + days);
      return result;
    };
    const subDays = (d: Date, days: number) => {
      const result = new Date(d);
      result.setDate(result.getDate() - days);
      return result;
    };

    const e1: Event = {
      id: "e1",
      title: "Computer Science Annual Hackathon",
      description: "Join us for 24 hours of coding, pizza, and prizes! Open to all majors.",
      date: addDays(new Date(), 2),
      location: "Innovation Hub, Room 204",
      locationCoordinates: ITM_COORDINATES,
      organizerId: "u2",
      status: "approved",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
      capacity: 100,
      attendees: 2,
      category: "Workshop",
      tags: ["coding", "prizes", "24hours"],
      avgRating: 4.8,
      createdAt: new Date(),
    };

    const e2: Event = {
      id: "e2",
      title: "Spring Campus Concert",
      description: "Live performances by student bands and special guests.",
      date: addDays(new Date(), 5),
      location: "The Green",
      locationCoordinates: ITM_COORDINATES,
      organizerId: "u2",
      status: "approved",
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4",
      capacity: 500,
      attendees: 0,
      category: "Music",
      tags: ["live", "music", "outdoors"],
      avgRating: 0,
      createdAt: new Date(),
    };

    const e3: Event = {
      id: "e3",
      title: "Guest Lecture: AI Ethics",
      description: "Dr. Sarah Johnson discusses the ethical implications of generative AI.",
      date: addDays(new Date(), 1),
      location: "Main Auditorium",
      locationCoordinates: ITM_COORDINATES,
      organizerId: "u1",
      status: "approved",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
      capacity: 200,
      attendees: 0,
      category: "Academic",
      tags: ["AI", "ethics", "lecture"],
      avgRating: 4.7,
      createdAt: new Date(),
    };

    const e4: Event = {
      id: "e4",
      title: "Intramural Soccer Finals",
      description: "Cheer on your favorite teams in the championship match.",
      date: subDays(new Date(), 2),
      location: "Sports Complex",
      locationCoordinates: ITM_COORDINATES,
      organizerId: "u2",
      status: "approved",
      image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2",
      capacity: 1000,
      attendees: 0,
      category: "Sports",
      tags: ["sports", "soccer", "championship"],
      avgRating: 4.6,
      createdAt: new Date(),
    };

    const e5: Event = {
      id: "e5",
      title: "Midnight Breakfast",
      description: "Free pancakes for students studying for finals.",
      date: addDays(new Date(), 10),
      location: "Student Center",
      locationCoordinates: ITM_COORDINATES,
      organizerId: "u2",
      status: "pending",
      image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352",
      capacity: 300,
      attendees: 0,
      category: "Social",
      tags: ["free", "food", "finals"],
      avgRating: 0,
      createdAt: new Date(),
    };

    this.events.set(e1.id, e1);
    this.events.set(e2.id, e2);
    this.events.set(e3.id, e3);
    this.events.set(e4.id, e4);
    this.events.set(e5.id, e5);

    // Seed Reviews
    const r1: Review = { id: "r1", eventId: "e1", userId: "u4", rating: 5, comment: "Amazing event! Best hackathon ever.", createdAt: subDays(new Date(), 1) };
    const r2: Review = { id: "r2", eventId: "e1", userId: "u5", rating: 4, comment: "Great prizes and networking.", createdAt: subDays(new Date(), 1) };
    this.reviews.set(r1.id, r1);
    this.reviews.set(r2.id, r2);

    // Seed Attendees
    const a1: Attendee = { id: "a1", eventId: "e1", userId: "u4", status: "registered", checkedInAt: null, createdAt: new Date() };
    const a2: Attendee = { id: "a2", eventId: "e1", userId: "u5", status: "checked-in", checkedInAt: new Date(), createdAt: new Date() };
    this.attendees.set(a1.id, a1);
    this.attendees.set(a2.id, a2);

    // Seed Activities
    const act1: Activity = { id: "act1", userId: "u4", eventId: "e1", type: "registered", detail: "registered for Computer Science Annual Hackathon", createdAt: new Date() };
    const act2: Activity = { id: "act2", userId: "u5", eventId: "e1", type: "checked-in", detail: "checked in for Computer Science Annual Hackathon", createdAt: new Date() };
    this.activities.set(act1.id, act1);
    this.activities.set(act2.id, act2);

    // Seed Notifications
    const n1: Notification = { id: "n1", userId: "u4", message: "Reminder: Hackathon starts in 2 days!", read: false, type: "info", createdAt: new Date() };
    const n2: Notification = { id: "n2", userId: "u2", message: "Your event 'Midnight Breakfast' is awaiting approval.", read: true, type: "warning", createdAt: subDays(new Date(), 1) };
    this.notifications.set(n1.id, n1);
    this.notifications.set(n2.id, n2);
  }

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
