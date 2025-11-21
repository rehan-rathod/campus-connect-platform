import { Event } from "@/lib/mockData";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const statusColors = {
    approved: "bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20 border-green-500/20",
    pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/20 border-yellow-500/20",
    rejected: "bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20 border-red-500/20",
    cancelled: "bg-gray-500/10 text-gray-700 dark:text-gray-400 hover:bg-gray-500/20 border-gray-500/20",
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link href={`/event/${event.id}`}>
        <Card className="h-full overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-border/50">
          <div className="aspect-video w-full overflow-hidden relative">
            <img
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <Badge 
              className={`absolute top-2 right-2 capitalize backdrop-blur-sm shadow-sm ${statusColors[event.status]}`}
              variant="outline"
            >
              {event.status}
            </Badge>
            <Badge className="absolute bottom-2 left-2 bg-black/60 text-white hover:bg-black/70 border-none backdrop-blur-sm">
              {event.category}
            </Badge>
          </div>
          
          <CardHeader className="p-4 pb-2">
            <h3 className="font-heading font-bold text-lg leading-tight line-clamp-2">
              {event.title}
            </h3>
          </CardHeader>
          
          <CardContent className="p-4 pt-0 space-y-3">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {event.description}
            </p>
            
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span>{format(event.date, "PPP 'at' p")}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>{event.attendees} / {event.capacity} attending</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-0 mt-auto">
            <Button className="w-full" variant="secondary">
              View Details
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
