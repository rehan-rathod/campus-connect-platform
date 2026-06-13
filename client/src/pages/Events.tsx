import { useGetEvents } from "@/lib/api";
import { EventCard } from "@/components/domain/EventCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Search, Filter, Calendar, Grid, List, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Events() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const { data: allEvents, isLoading } = useGetEvents("approved");
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const eventsList = allEvents || [];
  
  const filteredEvents = eventsList.filter((event: any) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2">Campus Events</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Discover what's happening around campus - {filteredEvents.length} events found
          </p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search events..." 
              className="pl-10 h-11" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-search-events"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] h-11" data-testid="select-filter-category">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Academic">Academic</SelectItem>
              <SelectItem value="Social">Social</SelectItem>
              <SelectItem value="Sports">Sports</SelectItem>
              <SelectItem value="Music">Music</SelectItem>
              <SelectItem value="Workshop">Workshop</SelectItem>
            </SelectContent>
          </Select>
          
          {/* View Mode Toggle */}
          <div className="hidden md:flex gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="h-9 w-9"
              onClick={() => setViewMode("grid")}
              data-testid="button-view-grid"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="h-9 w-9"
              onClick={() => setViewMode("list")}
              data-testid="button-view-list"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Active Filters */}
      {(searchTerm || categoryFilter !== "all") && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 flex-wrap"
        >
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Search: "{searchTerm}"
              <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-destructive">×</button>
            </Badge>
          )}
          {categoryFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Category: {categoryFilter}
              <button onClick={() => setCategoryFilter("all")} className="ml-1 hover:text-destructive">×</button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {setSearchTerm(""); setCategoryFilter("all")}}
            className="h-6 text-xs"
          >
            Clear all
          </Button>
        </motion.div>
      )}

      {filteredEvents.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {filteredEvents.map((event: any, index: number) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <EventCard event={event} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-lg"
        >
          <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-xl font-medium mb-2">No events found</p>
          <p className="text-sm mb-4">Try adjusting your search or filters</p>
          <Button
            variant="outline"
            onClick={() => {setSearchTerm(""); setCategoryFilter("all")}}
            data-testid="button-clear-filters"
          >
            Clear all filters
          </Button>
        </motion.div>
      )}
    </div>
  );
}
