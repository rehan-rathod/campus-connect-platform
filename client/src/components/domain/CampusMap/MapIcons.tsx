import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { MapPin, Building2, GraduationCap, Coffee, Trophy } from "lucide-react";

// Helper to create custom div icons using Lucide React components
const createIcon = (icon: React.ReactNode, color: string) => {
  const iconMarkup = renderToStaticMarkup(
    <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-white shadow-lg ${color} text-white`}>
      {icon}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white"></div>
    </div>
  );

  return L.divIcon({
    html: iconMarkup,
    className: "custom-marker-icon", // Remove default leaflet styles
    iconSize: [40, 40],
    iconAnchor: [20, 40], // Tip of the pin
    popupAnchor: [0, -40],
  });
};

export const BuildingIcon = createIcon(<Building2 size={20} />, "bg-blue-600");
export const RoomIcon = createIcon(<GraduationCap size={20} />, "bg-indigo-600");
export const SocialIcon = createIcon(<Coffee size={20} />, "bg-orange-500");
export const SportsIcon = createIcon(<Trophy size={20} />, "bg-green-600");
export const DefaultIcon = createIcon(<MapPin size={20} />, "bg-red-600");

export const getIconByType = (type: string) => {
  switch (type) {
    case "building": return BuildingIcon;
    case "room": return RoomIcon;
    case "point_of_interest": return SocialIcon;
    default: return DefaultIcon;
  }
};
