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
    const u6: User = { id: "u6", name: "Raj Patel", email: "raj@university.edu", password: hashedPassword, role: "organizer", avatar: null, createdAt: new Date() };
    const u7: User = { id: "u7", name: "Priya Sharma", email: "priya@university.edu", password: hashedPassword, role: "attendee", avatar: null, createdAt: new Date() };
    const u8: User = { id: "u8", name: "Arjun Mehta", email: "arjun@university.edu", password: hashedPassword, role: "attendee", avatar: null, createdAt: new Date() };
    
    this.users.set(u1.id, u1);
    this.users.set(u2.id, u2);
    this.users.set(u3.id, u3);
    this.users.set(u4.id, u4);
    this.users.set(u5.id, u5);
    this.users.set(u6.id, u6);
    this.users.set(u7.id, u7);
    this.users.set(u8.id, u8);

    this.idCounter = 9;

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

    const e6: Event = {
      id: "e6",
      title: "Web Development Bootcamp",
      description: "Hands-on session covering React, Node.js, and REST APIs. Bring your laptop and get building.",
      date: addDays(new Date(), 3),
      location: "Computer Lab B, Block C",
      locationCoordinates: ITM_COORDINATES,
      organizerId: "u6",
      status: "approved",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      capacity: 50,
      attendees: 22,
      category: "Workshop",
      tags: ["react", "nodejs", "webdev"],
      avgRating: 4.9,
      createdAt: new Date(),
    };

    const e7: Event = {
      id: "e7",
      title: "Cultural Fest: Navratri Night",
      description: "A vibrant evening of garba, dandiya, traditional music and food stalls celebrating culture.",
      date: addDays(new Date(), 7),
      location: "Open Ground, Main Campus",
      locationCoordinates: ITM_COORDINATES,
      organizerId: "u6",
      status: "approved",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655",
      capacity: 1200,
      attendees: 450,
      category: "Cultural",
      tags: ["navratri", "garba", "festival"],
      avgRating: 4.9,
      createdAt: new Date(),
    };

    const e8: Event = {
      id: "e8",
      title: "Startup Pitch Day 2025",
      description: "Students present their startup ideas to a panel of industry investors and mentors.",
      date: addDays(new Date(), 14),
      location: "Seminar Hall 1",
      locationCoordinates: ITM_COORDINATES,
      organizerId: "u2",
      status: "approved",
      image: "https://images.unsplash.com/photo-1556761175-4b46a572b786",
      capacity: 150,
      attendees: 85,
      category: "Academic",
      tags: ["startup", "entrepreneurship", "pitch"],
      avgRating: 4.7,
      createdAt: new Date(),
    };

    const e9: Event = {
      id: "e9",
      title: "Photography Walk: Campus Edition",
      description: "Explore the beautiful ITM campus through the lens. All skill levels welcome.",
      date: addDays(new Date(), 4),
      location: "Meeting at Main Gate",
      locationCoordinates: ITM_COORDINATES,
      organizerId: "u6",
      status: "approved",
      image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d",
      capacity: 30,
      attendees: 18,
      category: "Social",
      tags: ["photography", "walk", "creativity"],
      avgRating: 4.6,
      createdAt: new Date(),
    };

    const e10: Event = {
      id: "e10",
      title: "Annual Sports Day 2025",
      description: "Athletics, cricket, badminton, and more. Represent your department and win trophies!",
      date: addDays(new Date(), 20),
      location: "University Sports Ground",
      locationCoordinates: ITM_COORDINATES,
      organizerId: "u2",
      status: "approved",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b",
      capacity: 2000,
      attendees: 620,
      category: "Sports",
      tags: ["athletics", "cricket", "sports-day"],
      avgRating: 4.8,
      createdAt: new Date(),
    };

    const e11: Event = {
      id: "e11",
      title: "Mental Health Awareness Workshop",
      description: "A safe space to learn about stress management, mindfulness, and mental wellness strategies.",
      date: addDays(new Date(), 6),
      location: "Counseling Center, A Block",
      locationCoordinates: ITM_COORDINATES,
      organizerId: "u1",
      status: "approved",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      capacity: 80,
      attendees: 35,
      category: "Academic",
      tags: ["mental-health", "wellness", "mindfulness"],
      avgRating: 4.9,
      createdAt: new Date(),
    };

    const e12: Event = {
      id: "e12",
      title: "Jazz & Blues Night",
      description: "An intimate evening of live jazz and blues music by the ITM Music Society.",
      date: addDays(new Date(), 9),
      location: "Amphitheatre, ITM Campus",
      locationCoordinates: ITM_COORDINATES,
      organizerId: "u6",
      status: "pending",
      image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f",
      capacity: 300,
      attendees: 0,
      category: "Music",
      tags: ["jazz", "blues", "live-music"],
      avgRating: 0,
      createdAt: new Date(),
    };

    this.events.set(e1.id, e1);
    this.events.set(e2.id, e2);
    this.events.set(e3.id, e3);
    this.events.set(e4.id, e4);
    this.events.set(e5.id, e5);
    this.events.set(e6.id, e6);
    this.events.set(e7.id, e7);
    this.events.set(e8.id, e8);
    this.events.set(e9.id, e9);
    this.events.set(e10.id, e10);
    this.events.set(e11.id, e11);
    this.events.set(e12.id, e12);

    // Seed Reviews
    const r1: Review = { id: "r1", eventId: "e1", userId: "u4", rating: 5, comment: "Amazing event! Best hackathon ever.", createdAt: subDays(new Date(), 1) };
    const r2: Review = { id: "r2", eventId: "e1", userId: "u5", rating: 4, comment: "Great prizes and networking.", createdAt: subDays(new Date(), 1) };
    const r3: Review = { id: "r3", eventId: "e3", userId: "u4", rating: 5, comment: "Dr. Johnson was brilliant. Very insightful talk on AI ethics.", createdAt: subDays(new Date(), 2) };
    const r4: Review = { id: "r4", eventId: "e6", userId: "u7", rating: 5, comment: "Hands-on bootcamp was exactly what I needed. Learned so much!", createdAt: subDays(new Date(), 1) };
    const r5: Review = { id: "r5", eventId: "e8", userId: "u8", rating: 4, comment: "Great mentors and feedback. Will apply next year too.", createdAt: subDays(new Date(), 3) };
    const r6: Review = { id: "r6", eventId: "e4", userId: "u7", rating: 5, comment: "Thrilling final! The sports complex was packed.", createdAt: subDays(new Date(), 2) };
    this.reviews.set(r1.id, r1);
    this.reviews.set(r2.id, r2);
    this.reviews.set(r3.id, r3);
    this.reviews.set(r4.id, r4);
    this.reviews.set(r5.id, r5);
    this.reviews.set(r6.id, r6);

    // Seed Attendees
    const a1: Attendee = { id: "a1", eventId: "e1", userId: "u4", status: "registered", checkedInAt: null, createdAt: new Date() };
    const a2: Attendee = { id: "a2", eventId: "e1", userId: "u5", status: "checked-in", checkedInAt: new Date(), createdAt: new Date() };
    const a3: Attendee = { id: "a3", eventId: "e3", userId: "u4", status: "registered", checkedInAt: null, createdAt: subDays(new Date(), 1) };
    const a4: Attendee = { id: "a4", eventId: "e6", userId: "u7", status: "checked-in", checkedInAt: new Date(), createdAt: new Date() };
    const a5: Attendee = { id: "a5", eventId: "e6", userId: "u8", status: "registered", checkedInAt: null, createdAt: new Date() };
    const a6: Attendee = { id: "a6", eventId: "e7", userId: "u4", status: "registered", checkedInAt: null, createdAt: new Date() };
    const a7: Attendee = { id: "a7", eventId: "e7", userId: "u7", status: "registered", checkedInAt: null, createdAt: new Date() };
    const a8: Attendee = { id: "a8", eventId: "e10", userId: "u8", status: "registered", checkedInAt: null, createdAt: new Date() };
    this.attendees.set(a1.id, a1);
    this.attendees.set(a2.id, a2);
    this.attendees.set(a3.id, a3);
    this.attendees.set(a4.id, a4);
    this.attendees.set(a5.id, a5);
    this.attendees.set(a6.id, a6);
    this.attendees.set(a7.id, a7);
    this.attendees.set(a8.id, a8);

    // Seed Activities
    const act1: Activity = { id: "act1", userId: "u4", eventId: "e1", type: "registered", detail: "registered for Computer Science Annual Hackathon", createdAt: subDays(new Date(), 1) };
    const act2: Activity = { id: "act2", userId: "u5", eventId: "e1", type: "checked-in", detail: "checked in for Computer Science Annual Hackathon", createdAt: subDays(new Date(), 1) };
    const act3: Activity = { id: "act3", userId: "u4", eventId: "e3", type: "registered", detail: "registered for Guest Lecture: AI Ethics", createdAt: subDays(new Date(), 2) };
    const act4: Activity = { id: "act4", userId: "u7", eventId: "e6", type: "checked-in", detail: "checked in for Web Development Bootcamp", createdAt: new Date() };
    const act5: Activity = { id: "act5", userId: "u8", eventId: "e6", type: "registered", detail: "registered for Web Development Bootcamp", createdAt: new Date() };
    const act6: Activity = { id: "act6", userId: "u4", eventId: "e7", type: "registered", detail: "registered for Cultural Fest: Navratri Night", createdAt: new Date() };
    const act7: Activity = { id: "act7", userId: "u7", eventId: "e7", type: "registered", detail: "registered for Cultural Fest: Navratri Night", createdAt: new Date() };
    const act8: Activity = { id: "act8", userId: "u8", eventId: "e10", type: "registered", detail: "registered for Annual Sports Day 2025", createdAt: new Date() };
    const act9: Activity = { id: "act9", userId: "u2", eventId: "e8", type: "approved", detail: "Startup Pitch Day 2025 was approved by admin", createdAt: subDays(new Date(), 3) };
    const act10: Activity = { id: "act10", userId: "u6", eventId: "e12", type: "created", detail: "created event Jazz & Blues Night", createdAt: subDays(new Date(), 1) };
    this.activities.set(act1.id, act1);
    this.activities.set(act2.id, act2);
    this.activities.set(act3.id, act3);
    this.activities.set(act4.id, act4);
    this.activities.set(act5.id, act5);
    this.activities.set(act6.id, act6);
    this.activities.set(act7.id, act7);
    this.activities.set(act8.id, act8);
    this.activities.set(act9.id, act9);
    this.activities.set(act10.id, act10);

    // Seed Notifications
    const n1: Notification = { id: "n1", userId: "u4", message: "Reminder: Hackathon starts in 2 days! Don't forget to bring your laptop.", read: false, type: "info", createdAt: new Date() };
    const n2: Notification = { id: "n2", userId: "u2", message: "Your event 'Midnight Breakfast' is awaiting approval.", read: true, type: "warning", createdAt: subDays(new Date(), 1) };
    const n3: Notification = { id: "n3", userId: "u4", message: "You're registered for Cultural Fest: Navratri Night on Saturday. See you there!", read: false, type: "info", createdAt: new Date() };
    const n4: Notification = { id: "n4", userId: "u7", message: "You've been checked in for Web Development Bootcamp. Enjoy the session!", read: false, type: "success", createdAt: new Date() };
    const n5: Notification = { id: "n5", userId: "u6", message: "Your event 'Jazz & Blues Night' is under review by the approver.", read: false, type: "warning", createdAt: subDays(new Date(), 1) };
    const n6: Notification = { id: "n6", userId: "u8", message: "You are now registered for Annual Sports Day 2025. Get ready to compete!", read: false, type: "info", createdAt: new Date() };
    const n7: Notification = { id: "n7", userId: "u2", message: "Startup Pitch Day 2025 has been approved! Share it with your participants.", read: false, type: "success", createdAt: subDays(new Date(), 3) };
    const n8: Notification = { id: "n8", userId: "u4", message: "New event: Mental Health Awareness Workshop is open for registration.", read: true, type: "info", createdAt: subDays(new Date(), 2) };
    this.notifications.set(n1.id, n1);
    this.notifications.set(n2.id, n2);
    this.notifications.set(n3.id, n3);
    this.notifications.set(n4.id, n4);
    this.notifications.set(n5.id, n5);
    this.notifications.set(n6.id, n6);
    this.notifications.set(n7.id, n7);
    this.notifications.set(n8.id, n8);
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
