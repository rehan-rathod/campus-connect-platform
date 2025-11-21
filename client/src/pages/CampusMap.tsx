import { useState } from "react";
import { CampusMapView } from "@/components/domain/CampusMap/CampusMapView";
import { CAMPUS_LOCATIONS, BUILDINGS, ROOMS, CampusLocation } from "@/lib/geoJsonData";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Search, Map as MapIcon, Navigation } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function CampusMap() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState<string>("all");
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [activeLocationId, setActiveLocationId] = useState<string | undefined>(undefined);

  // Filter logic
  const filteredLocations = CAMPUS_LOCATIONS.filter(loc => {
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBuilding = selectedBuilding === "all" || (loc.type === "building" && loc.id === selectedBuilding);
    const matchesRoom = selectedRoom === "all" || (loc.type === "room" && loc.id === selectedRoom);
    return matchesSearch && (selectedBuilding === "all" || matchesBuilding) && (selectedRoom === "all" || matchesRoom);
  });

  const handleLocationSelect = (loc: CampusLocation | null) => {
    if (loc) {
      setActiveLocationId(loc.id);
    } else {
      setActiveLocationId(undefined);
    }
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        alert(`Current Location: ${position.coords.latitude}, ${position.coords.longitude}`);
        // In a real app, we would flyTo these coordinates
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header & Controls */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container py-4 space-y-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Campus Map</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search buildings, rooms, facilities..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={selectedBuilding} onValueChange={(val) => { setSelectedBuilding(val); if(val !== 'all') setActiveLocationId(val); }}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select Building" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Buildings</SelectItem>
                {BUILDINGS.map(b => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedRoom} onValueChange={(val) => { setSelectedRoom(val); if(val !== 'all') setActiveLocationId(val); }}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select Room" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rooms</SelectItem>
                {ROOMS.map(r => (
                  <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={handleLocateMe}>
              <Navigation className="h-4 w-4 mr-2" /> Locate Me
            </Button>
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-muted/10">
        <CampusMapView 
          selectedLocationId={activeLocationId}
          onLocationSelect={handleLocationSelect}
        />
        
        {/* Floating Legend/Info (Optional) */}
        <div className="absolute bottom-6 left-6 z-[400] hidden md:block">
          <Card className="p-3 bg-background/90 backdrop-blur border-none shadow-lg">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <MapIcon className="h-4 w-4" />
              <span>ITM SLS Baroda University Campus</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
