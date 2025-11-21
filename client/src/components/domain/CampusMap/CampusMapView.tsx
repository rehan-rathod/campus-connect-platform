import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import { CAMPUS_LOCATIONS, CAMPUS_CENTER, CampusLocation } from "@/lib/geoJsonData";
import { getIconByType } from "./MapIcons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Navigation, MapPin, Calendar, Layers, Globe, Map as MapIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import "leaflet/dist/leaflet.css";

// Map Controller to handle programmatic moves
function MapController({ center, zoom }: { center: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 18, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

interface CampusMapViewProps {
  selectedLocationId?: string;
  onLocationSelect?: (location: CampusLocation | null) => void;
  height?: string;
  interactive?: boolean;
  showControls?: boolean;
  initialCenter?: [number, number];
  singleMarker?: boolean; 
  customLocation?: CampusLocation;
}

export function CampusMapView({
  selectedLocationId,
  onLocationSelect,
  height = "100%",
  interactive = true,
  showControls = true,
  initialCenter = CAMPUS_CENTER,
  singleMarker = false,
  customLocation,
}: CampusMapViewProps) {
  const [activeLocation, setActiveLocation] = useState<CampusLocation | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapStyle, setMapStyle] = useState<'satellite' | 'street'>('satellite');
  const isMobile = useIsMobile();

  // Sync internal state with prop
  useEffect(() => {
    if (selectedLocationId) {
      const loc = CAMPUS_LOCATIONS.find((l) => l.id === selectedLocationId);
      if (loc) setActiveLocation(loc);
    }
  }, [selectedLocationId]);

  const handleMarkerClick = (location: CampusLocation) => {
    if (!interactive) return;
    setActiveLocation(location);
    if (onLocationSelect) onLocationSelect(location);
  };

  const handleCloseDetails = () => {
    setActiveLocation(null);
    if (onLocationSelect) onLocationSelect(null);
  };

  const handleGetDirections = (loc: CampusLocation) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${loc.coordinates[0]},${loc.coordinates[1]}`, '_blank');
  };

  // Determine which locations to render
  let locationsToRender = CAMPUS_LOCATIONS;
  
  if (customLocation) {
    locationsToRender = [customLocation];
  } else if (singleMarker && activeLocation) {
    locationsToRender = [activeLocation];
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg border shadow-sm bg-muted/10 group isolate" style={{ height }}>
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
          <Skeleton className="w-full h-full" />
          <span className="absolute text-muted-foreground font-medium">Loading Campus Map...</span>
        </div>
      )}

      {/* Custom Layer Switcher - Top Right */}
      {interactive && showControls && (
        <div className="absolute top-4 right-4 z-[400]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="secondary" 
                size="sm" 
                className="shadow-md bg-background/90 backdrop-blur hover:bg-background border-primary/20 transition-all"
              >
                <Layers className="h-4 w-4 mr-2" />
                {mapStyle === 'satellite' ? 'Satellite' : 'Street'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[500]">
              <DropdownMenuItem onClick={() => setMapStyle('satellite')}>
                <Globe className="h-4 w-4 mr-2" /> Satellite
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMapStyle('street')}>
                <MapIcon className="h-4 w-4 mr-2" /> Street Map
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <MapContainer
        center={initialCenter}
        zoom={17}
        style={{ height: "100%", width: "100%" }}
        whenReady={() => setIsMapReady(true)}
        scrollWheelZoom={interactive}
        dragging={interactive}
        touchZoom={interactive}
        doubleClickZoom={interactive}
        zoomControl={false}
      >
        {showControls && <ZoomControl position="topleft" />}
        
        {mapStyle === 'satellite' ? (
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />
        ) : (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        )}
        
        <MapController center={activeLocation ? activeLocation.coordinates : initialCenter} />

        {locationsToRender.map((loc) => (
          <Marker
            key={loc.id}
            position={loc.coordinates}
            icon={getIconByType(loc.type)}
            eventHandlers={{
              click: () => handleMarkerClick(loc),
            }}
          >
            {!interactive && (
              <Popup>
                <div className="text-sm font-semibold">{loc.name}</div>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>

      {/* Desktop Side Panel Details */}
      {interactive && !isMobile && activeLocation && (
        <div className="absolute top-4 left-14 z-[400] w-80">
          <Card className="shadow-xl border-primary/20 backdrop-blur-md bg-background/95 animate-in slide-in-from-left-5 duration-300">
            <CardHeader className="pb-2 relative">
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-2 top-2 h-6 w-6 p-0 hover:bg-muted" 
                onClick={handleCloseDetails}
              >
                ✕
              </Button>
              <CardTitle className="text-lg leading-tight pr-6">{activeLocation.name}</CardTitle>
              <Badge variant="secondary" className="w-fit capitalize mt-1">{activeLocation.type.replace(/_/g, ' ')}</Badge>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="text-muted-foreground">{activeLocation.description || "No description available."}</p>
              
              {activeLocation.capacity && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Capacity: {activeLocation.capacity} people</span>
                </div>
              )}

              {activeLocation.events && activeLocation.events.length > 0 && (
                <div className="space-y-2 pt-2 border-t">
                  <span className="font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" /> Upcoming Events
                  </span>
                  <ul className="list-disc list-inside text-muted-foreground text-xs space-y-1">
                    <li>Coding Workshop (Today)</li>
                    <li>Guest Lecture (Tomorrow)</li>
                  </ul>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button className="w-full" size="sm" onClick={() => handleGetDirections(activeLocation)}>
                  <Navigation className="h-3 w-3 mr-2" /> Directions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mobile Sheet Details */}
      {interactive && isMobile && (
        <Sheet open={!!activeLocation} onOpenChange={(open) => !open && handleCloseDetails()}>
          <SheetContent side="bottom" className="rounded-t-xl z-[1000]">
            <SheetHeader className="text-left">
              <SheetTitle>{activeLocation?.name}</SheetTitle>
              <SheetDescription>
                <Badge variant="secondary" className="capitalize mb-2">
                  {activeLocation?.type.replace(/_/g, ' ')}
                </Badge>
                <p className="mb-4">{activeLocation?.description}</p>
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-4">
              <Button className="w-full" onClick={() => activeLocation && handleGetDirections(activeLocation)}>
                <Navigation className="h-4 w-4 mr-2" /> Get Directions
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
