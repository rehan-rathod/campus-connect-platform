import { useState, useMemo, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { CAMPUS_CENTER } from "@/lib/geoJsonData";
import { DefaultIcon } from "./CampusMap/MapIcons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crosshair } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface LocationPickerProps {
  initialCoordinates?: { lat: number; lng: number };
  onLocationChange: (coords: { lat: number; lng: number }) => void;
}

function DraggableMarker({ position, onDragEnd }: { position: [number, number], onDragEnd: (pos: any) => void }) {
  const markerRef = useRef<any>(null);
  
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          onDragEnd(marker.getLatLng());
        }
      },
    }),
    [onDragEnd],
  );

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={DefaultIcon}
    />
  );
}

function MapClickHandler({ onClick }: { onClick: (latlng: any) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

export function LocationPicker({ initialCoordinates, onLocationChange }: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number]>(
    initialCoordinates 
      ? [initialCoordinates.lat, initialCoordinates.lng] 
      : CAMPUS_CENTER
  );

  const handleDragEnd = (latlng: any) => {
    const newPos: [number, number] = [latlng.lat, latlng.lng];
    setPosition(newPos);
    onLocationChange({ lat: latlng.lat, lng: latlng.lng });
  };

  const handleClick = (latlng: any) => {
    const newPos: [number, number] = [latlng.lat, latlng.lng];
    setPosition(newPos);
    onLocationChange({ lat: latlng.lat, lng: latlng.lng });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="lat">Latitude</Label>
          <Input id="lat" value={position[0]} readOnly className="bg-muted" />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="lng">Longitude</Label>
          <Input id="lng" value={position[1]} readOnly className="bg-muted" />
        </div>
      </div>

      <div className="relative h-[300px] w-full rounded-md border overflow-hidden">
        <MapContainer
          center={position}
          zoom={16}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <DraggableMarker position={position} onDragEnd={handleDragEnd} />
          <MapClickHandler onClick={handleClick} />
        </MapContainer>
        
        <div className="absolute top-2 right-2 z-[400] bg-background/80 backdrop-blur p-2 rounded text-xs text-muted-foreground shadow-sm pointer-events-none">
          Click map or drag pin to set location
        </div>
      </div>
    </div>
  );
}
