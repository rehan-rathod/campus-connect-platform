import L from "leaflet";

// Helper to create custom div icons using raw SVG paths and tailwind classes
const createIcon = (svgPaths: string, color: string) => {
  const iconMarkup = `
    <div class="relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-white shadow-lg ${color} text-white">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">${svgPaths}</svg>
      <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white"></div>
    </div>
  `;

  return L.divIcon({
    html: iconMarkup,
    className: "custom-marker-icon", // Remove default leaflet styles
    iconSize: [40, 40],
    iconAnchor: [20, 40], // Tip of the pin
    popupAnchor: [0, -40],
  });
};

// SVG inner paths for Lucide icons:
// Building2: <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/>
export const BuildingIcon = createIcon(
  `<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/>`,
  "bg-blue-600"
);

// GraduationCap: <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
export const RoomIcon = createIcon(
  `<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>`,
  "bg-indigo-600"
);

// Coffee: <path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2h-2"/><path d="M6 2v2"/>
export const SocialIcon = createIcon(
  `<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2h-2"/><path d="M6 2v2"/>`,
  "bg-orange-500"
);

// Trophy: <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"/><path d="M12 2a6 6 0 0 1 6 6v3.5c0 1.66-1.34 3-3 3H9c-1.66 0-3-1.34-3-3V8a6 6 0 0 1 6-6z"/>
export const SportsIcon = createIcon(
  `<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"/><path d="M12 2a6 6 0 0 1 6 6v3.5c0 1.66-1.34 3-3 3H9c-1.66 0-3-1.34-3-3V8a6 6 0 0 1 6-6z"/>`,
  "bg-green-600"
);

// MapPin: <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
export const DefaultIcon = createIcon(
  `<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>`,
  "bg-red-600"
);

export const getIconByType = (type: string) => {
  switch (type) {
    case "building": return BuildingIcon;
    case "room": return RoomIcon;
    case "point_of_interest": return SocialIcon;
    default: return DefaultIcon;
  }
};
