# CampusConnect - Event Management & Notification Platform

CampusConnect is a premium, unified event management and notification platform built for universities. It provides a full-stack dashboard for students to discover and register for events, for organizers to host and manage check-ins, and for administrators to approve event submissions.

---

## 🌟 Key Features

*   **Premium Visual Aesthetics**: Beautiful dark/light mode toggle with vibrant gradients, glassmorphism cards, and smooth micro-animations powered by `framer-motion` and Tailwind CSS.
*   **Dynamic Event Listing & Search**: Browse, search, and filter approved events by category and tags in real time.
*   **Interactive Campus Map**: Location search and custom marker pin rendering powered by Leaflet and custom vector marker pins.
*   **Real-time RSVP & Waitlist**: Automated seat capacity monitoring. If an event is full, attendees are placed on a waitlist.
*   **QR Check-in & Logs**: Event organizers can manage check-ins using scan coordinates, which automatically generates live student activity log feeds.
*   **Live User Notifications**: System-wide notifications notifying attendees of schedule updates and organizers of event approval status changes.
*   **Dynamic Analytics Dashboard**: Computes dynamic event status summaries, average ratings, and registration analytics.

---

## 🛠️ Technology Stack

### Frontend
*   **Framework**: React (TypeScript) with Vite
*   **Routing**: Wouter
*   **State Management**: TanStack Query (React Query)
*   **Styling**: Tailwind CSS + Shadcn UI
*   **Animations**: Framer Motion
*   **Maps**: React Leaflet / Leaflet CSS

### Backend
*   **Runtime**: Node.js / Express
*   **Database ORM**: Drizzle ORM
*   **Database**: PostgreSQL (fallback to automatic `MemStorage` seeding when unconfigured)
*   **Auth**: JWT (JSON Web Tokens) stored in HttpOnly cookies & bcryptjs

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/rehan-rathod/campus-connect-platform.git
    cd campus-connect-platform
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Run the development server:
    ```bash
    npm run dev
    ```
    This starts the backend API server and proxies the Vite dev frontend on port **5000**. Open [http://localhost:5000](http://localhost:5000) in your browser.

---

## 👥 Seed Credentials for Testing

The local memory database is pre-seeded with three roles. You can log in using the following details:

| Role | Email | Password | Access / Capabilities |
| :--- | :--- | :--- | :--- |
| **Attendee (Student)** | `dave@university.edu` | `password123` | Browse events, RSVP, write reviews, and receive notifications. |
| **Organizer** | `jane@university.edu` | `password123` | Create events, view attendee list, trigger QR check-ins, and send notifications. |
| **Approver (Admin)** | `sarah@university.edu` | `password123` | Approve or reject pending event proposals. |

---

## 📦 Building for Production

To compile both the React client bundle and the Express server for production:

1. Build the assets:
    ```bash
    npm run build
    ```
    *Client files will compile to `dist/public`, and server files compile to `dist/index.js`.*

2. Start the production server:
    ```bash
    npm run start
    ```
