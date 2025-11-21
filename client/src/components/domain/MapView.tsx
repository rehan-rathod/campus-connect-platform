import { useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapViewProps {
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export function MapView({ location, coordinates }: MapViewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (!coordinates) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Event Location
        </h3>
        <div className="p-6 border rounded-lg bg-muted/30 text-center">
          <p className="text-muted-foreground">{location}</p>
          <p className="text-sm text-muted-foreground mt-2">Map coordinates not available</p>
        </div>
      </div>
    );
  }

  const mapUrl = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3691.234!2d${coordinates.lng}!3d${coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDI3JzAwLjYiTiA3M8KwMjEnMDguMSJF!5e0!3m2!1sen!2sin!4v1234567890`;
  
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
  const viewInMapsUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" />
        Event Location
      </h3>
      
      <p className="text-muted-foreground mb-4">{location}</p>

      <div className="rounded-lg overflow-hidden shadow-md border relative">
        {loading && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <div className="text-muted-foreground text-sm">Loading map...</div>
          </div>
        )}
        
        {!error ? (
          <iframe
            width="100%"
            height="400"
            className="md:h-[400px] h-[300px]"
            frameBorder="0"
            style={{ border: 0 }}
            src={mapUrl}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setLoading(false)}
            onError={() => {
              setError(true);
              setLoading(false);
            }}
          />
        ) : (
          <div className="h-[300px] md:h-[400px] bg-muted flex items-center justify-center">
            <div className="text-center p-6">
              <p className="text-muted-foreground mb-4">Unable to load map</p>
              <Button asChild variant="outline">
                <a href={viewInMapsUrl} target="_blank" rel="noopener noreferrer">
                  Open in Google Maps
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-4">
        <Button asChild variant="default" size="sm">
          <a 
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            Get Directions
          </a>
        </Button>
        
        <Button asChild variant="outline" size="sm">
          <a 
            href={viewInMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            View in Maps
          </a>
        </Button>
      </div>
    </div>
  );
}
