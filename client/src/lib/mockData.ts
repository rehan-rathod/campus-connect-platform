import { addDays, format, subDays } from "date-fns";

// Types
export type EventStatus = "approved" | "pending" | "rejected" | "cancelled";

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface Attendee {
  id: string;
  name: string;
  email: string;
  status: "registered" | "checked-in" | "waitlist";
  checkedInAt?: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  locationCoordinates?: {
    lat: number;
    lng: number;
  };
  organizerId: string;
  status: EventStatus;
  image: string;
  capacity: number;
  attendees: number;
  category: "Academic" | "Social" | "Sports" | "Workshop" | "Music";
  reviews: Review[];
  attendeeList: Attendee[];
  waitlist: Attendee[];
  tags: string[];
  avgRating: number;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  date: Date;
  type: "info" | "success" | "warning" | "error";
}

// Mock Data Store
import heroImage from "@assets/generated_images/modern_university_campus_hero_image.png";
import lectureImage from "@assets/generated_images/lecture_hall_event.png";
import concertImage from "@assets/generated_images/music_concert_event.png";
import workshopImage from "@assets/generated_images/coding_workshop_event.png";

const ITM_COORDINATES = { lat: 22.4501584, lng: 73.3522416 };

export const MOCK_EVENTS: Event[] = [
  {
    id: "e1",
    title: "Computer Science Annual Hackathon",
    description: "Join us for 24 hours of coding, pizza, and prizes! Open to all majors.",
    date: addDays(new Date(), 2),
    location: "Innovation Hub, Room 204",
    locationCoordinates: ITM_COORDINATES,
    organizerId: "u2",
    status: "approved",
    image: workshopImage,
    capacity: 100,
    attendees: 45,
    category: "Workshop",
    tags: ["coding", "prizes", "24hours"],
    avgRating: 4.8,
    reviews: [
      { id: "r1", userId: "u4", userName: "Dave Student", rating: 5, comment: "Amazing event! Best hackathon ever.", date: subDays(new Date(), 1) },
      { id: "r2", userId: "u5", userName: "Emma Engineer", rating: 4, comment: "Great prizes and networking.", date: subDays(new Date(), 1) },
    ],
    attendeeList: [
      { id: "a1", name: "Dave Student", email: "dave@university.edu", status: "registered" },
      { id: "a2", name: "Emma Engineer", email: "emma@university.edu", status: "checked-in", checkedInAt: new Date() },
    ],
    waitlist: [],
  },
  {
    id: "e2",
    title: "Spring Campus Concert",
    description: "Live performances by student bands and special guests.",
    date: addDays(new Date(), 5),
    location: "The Green",
    locationCoordinates: ITM_COORDINATES,
    organizerId: "u2",
    status: "approved",
    image: concertImage,
    capacity: 500,
    attendees: 320,
    category: "Music",
    tags: ["live", "music", "outdoors"],
    avgRating: 4.5,
    reviews: [],
    attendeeList: [],
    waitlist: [],
  },
  {
    id: "e3",
    title: "Guest Lecture: AI Ethics",
    description: "Dr. Sarah Johnson discusses the ethical implications of generative AI.",
    date: addDays(new Date(), 1),
    location: "Main Auditorium",
    locationCoordinates: ITM_COORDINATES,
    organizerId: "u1",
    status: "approved",
    image: lectureImage,
    capacity: 200,
    attendees: 180,
    category: "Academic",
    tags: ["AI", "ethics", "lecture"],
    avgRating: 4.7,
    reviews: [],
    attendeeList: [],
    waitlist: [],
  },
  {
    id: "e4",
    title: "Intramural Soccer Finals",
    description: "Cheer on your favorite teams in the championship match.",
    date: subDays(new Date(), 2),
    location: "Sports Complex",
    locationCoordinates: ITM_COORDINATES,
    organizerId: "u2",
    status: "approved",
    image: heroImage,
    capacity: 1000,
    attendees: 850,
    category: "Sports",
    tags: ["sports", "soccer", "championship"],
    avgRating: 4.6,
    reviews: [],
    attendeeList: [],
    waitlist: [],
  },
  {
    id: "e5",
    title: "Midnight Breakfast",
    description: "Free pancakes for students studying for finals.",
    date: addDays(new Date(), 10),
    location: "Student Center",
    locationCoordinates: ITM_COORDINATES,
    organizerId: "u2",
    status: "pending",
    image: heroImage,
    capacity: 300,
    attendees: 0,
    category: "Social",
    tags: ["free", "food", "finals"],
    avgRating: 0,
    reviews: [],
    attendeeList: [],
    waitlist: [],
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    userId: "u4",
    message: "Reminder: Hackathon starts in 2 days!",
    read: false,
    date: new Date(),
    type: "info",
  },
  {
    id: "n2",
    userId: "u2",
    message: "Your event 'Midnight Breakfast' is awaiting approval.",
    read: true,
    date: subDays(new Date(), 1),
    type: "warning",
  },
];

// Helper functions to simulate API calls
export const getEvents = (filter?: { status?: EventStatus; organizerId?: string }) => {
  let events = [...MOCK_EVENTS];
  if (filter?.status) {
    events = events.filter((e) => e.status === filter.status);
  }
  if (filter?.organizerId) {
    events = events.filter((e) => e.organizerId === filter.organizerId);
  }
  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const getEventById = (id: string) => MOCK_EVENTS.find((e) => e.id === id);

export const createEvent = (event: Omit<Event, "id" | "attendees" | "status">) => {
  const newEvent: Event = {
    ...event,
    id: `e${Date.now()}`,
    attendees: 0,
    status: "pending", // Default to pending
  };
  MOCK_EVENTS.push(newEvent);
  return newEvent;
};

export const updateEventStatus = (id: string, status: EventStatus) => {
  const event = MOCK_EVENTS.find((e) => e.id === id);
  if (event) {
    event.status = status;
    return true;
  }
  return false;
};
