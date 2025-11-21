import { useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CampusMapView } from "./CampusMap/CampusMapView";
import { CampusLocation } from "@/lib/geoJsonData";

interface MapViewProps {
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export function MapView({ location, coordinates }: MapViewProps) {
  const [error, setError] = useState(false);

  // Fallback URL if map fails or no coordinates
  const viewInMapsUrl = coordinates 
    ? `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  // Construct a temporary CampusLocation object for the map view
  const tempLocation: CampusLocation | undefined = coordinates ? {
    id: "temp-event-loc",
    name: location,
    type: "point_of_interest",
    coordinates: [coordinates.lat, coordinates.lng],
    description: "Event Location"
  } : undefined;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" />
        Event Location
      </h3>
      
      <p className="text-muted-foreground mb-4">{location}</p>

      <div className="rounded-lg overflow-hidden shadow-md border relative h-[400px]">
        {coordinates && !error ? (
          <CampusMapView 
            initialCenter={[coordinates.lat, coordinates.lng]}
            customLocation={tempLocation}
            interactive={false}
            showControls={false}
          />
        ) : (
          <div className="h-full bg-muted flex items-center justify-center flex-col p-6 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-4">
              {coordinates ? "Unable to load map view." : "Map coordinates not available for this event."}
            </p>
            <Button asChild variant="outline">
              <a href={viewInMapsUrl} target="_blank" rel="noopener noreferrer">
                Open in Google Maps
              </a>
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-4">
        <Button asChild variant="default" size="sm">
          <a 
            href={viewInMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            View in Google Maps
          </a>
        </Button>
      </div>
    </div>
  );
}
