import { LatLngExpression } from "leaflet";

export interface CampusLocation {
  id: string;
  name: string;
  type: "building" | "room" | "point_of_interest";
  capacity?: number;
  description?: string;
  coordinates: [number, number]; // [lat, lng]
  events?: string[];
}

// Center of ITM SLS Baroda University based on screenshot
// URL: @22.4503627,73.3540306
export const CAMPUS_CENTER: [number, number] = [22.4503627, 73.3540306];

export const CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: "itm-main",
    name: "ITM SLS Baroda University",
    type: "building",
    description: "Main University Campus Building.",
    coordinates: [22.4503627, 73.3540306],
    events: ["e1", "e3"],
  },
  {
    id: "pharmacy",
    name: "ITM School of Pharmacy",
    type: "building",
    description: "Dedicated block for Pharmacy studies and labs.",
    coordinates: [22.4522, 73.3532], // North-West relative to main
    events: ["e1"],
  },
  {
    id: "itmbu-main",
    name: "ITMBU Main Building",
    type: "building",
    description: "Administrative and academic block.",
    coordinates: [22.4495, 73.3545], // South-East relative to main
    events: ["e4"],
  },
  {
    id: "sports-ground",
    name: "University Sports Ground",
    type: "point_of_interest",
    description: "Main cricket and football ground.",
    coordinates: [22.4510, 73.3525], // West relative to main
    events: ["e2"],
  },
  {
    id: "archi-block",
    name: "School of Architecture & Design",
    type: "building",
    description: "Creative studios and design workshops.",
    coordinates: [22.4490, 73.3535], // South-West
    events: ["e5"],
  },
  {
    id: "audi",
    name: "Main Auditorium",
    type: "room",
    capacity: 500,
    coordinates: [22.4500, 73.3542],
  },
  {
    id: "canteen",
    name: "Campus Canteen",
    type: "point_of_interest",
    description: "Food court and student hangout area.",
    coordinates: [22.4508, 73.3538],
  },
];

export const BUILDINGS = CAMPUS_LOCATIONS.filter((l) => l.type === "building");
export const ROOMS = CAMPUS_LOCATIONS.filter((l) => l.type === "room");
