import { useState } from "react";
import { Search, Calendar as CalendarIcon, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-white/95 backdrop-blur-md shadow-lg rounded-xl p-2 border border-gray-200/50">
        <div className="flex flex-col md:flex-row gap-2">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search events, workshops, activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              data-testid="input-search-events"
            />
          </div>

          {/* Category Filter */}
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-40 h-12 border-0 bg-transparent" data-testid="select-category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="social">Social</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="music">Music</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Filter */}
          <Select defaultValue="upcoming">
            <SelectTrigger className="w-full md:w-40 h-12 border-0 bg-transparent" data-testid="select-date">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>

          {/* Search Button */}
          <Button size="lg" className="h-12 px-8" data-testid="button-search">
            <Search className="h-5 w-5 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
