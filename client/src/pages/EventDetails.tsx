import { useParams, Link } from "wouter";
import { getEventById } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, ArrowLeft, Share2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { QRCheckIn } from "@/components/domain/QRCheckIn";
import { ReviewsSection } from "@/components/domain/ReviewsSection";
import { WaitlistComponent } from "@/components/domain/WaitlistComponent";
import { AttendeeManagement } from "@/components/domain/AttendeeManagement";
import { RecommendedEvents } from "@/components/domain/RecommendedEvents";
import { useAuth } from "@/hooks/use-auth";

export default function EventDetails() {
  const { id } = useParams();
  const event = getEventById(id || "");
  const { toast } = useToast();
  const { user } = useAuth();
  const [isRegistered, setIsRegistered] = useState(false);

  if (!event) {
    return <div className="container py-20 text-center">Event not found</div>;
  }

  const handleRSVP = () => {
    setIsRegistered(!isRegistered);
    toast({
      title: isRegistered ? "Registration Cancelled" : "RSVP Confirmed",
      description: isRegistered 
        ? "You have been removed from the attendee list." 
        : "You have successfully registered for this event!",
      variant: isRegistered ? "destructive" : "default",
    });
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Header */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 z-20 container pb-8">
          <Link href="/events">
            <Button variant="ghost" className="mb-4 text-white/80 hover:text-white hover:bg-white/10 pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
            </Button>
          </Link>
          <Badge className="mb-4">{event.category}</Badge>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white shadow-sm mb-2">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-white/90">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {event.date.toLocaleString()}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {event.location}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold mb-4">About this Event</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {event.description}
              </p>
              <p className="mt-4 text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>

            {/* Tags */}
            {event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}

            {/* Reviews Section */}
            <div className="border-t pt-8">
              <ReviewsSection event={event} />
            </div>

            {/* Attendee Management (Only for organizers) */}
            {user?.role === "organizer" && (
              <div className="border-t pt-8">
                <AttendeeManagement event={event} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="border rounded-lg p-6 bg-card shadow-sm sticky top-24">
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Spots Remaining</span>
                  <span className="font-medium">{event.capacity - event.attendees} / {event.capacity}</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${(event.attendees / event.capacity) * 100}%` }}
                  />
                </div>
              </div>

              {/* Check capacity for RSVP/Waitlist */}
              {event.attendees >= event.capacity ? (
                <>
                  <WaitlistComponent event={event} isFull={true} />
                </>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    className={`w-full text-lg ${isRegistered ? 'bg-green-600 hover:bg-green-700' : ''}`}
                    onClick={handleRSVP}
                  >
                    {isRegistered ? (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" /> Registered
                      </>
                    ) : (
                      "RSVP Now"
                    )}
                  </Button>
                </>
              )}
              
              <Button variant="outline" className="w-full mt-3">
                <Share2 className="mr-2 h-4 w-4" /> Share Event
              </Button>

              {/* QR Check-in for organizers */}
              {user?.role === "organizer" && (
                <div className="mt-3">
                  <QRCheckIn event={event} />
                </div>
              )}
            </div>
            
            <div className="border rounded-lg p-6">
               <h3 className="font-bold mb-4">Organizer</h3>
               <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                   <Users className="h-5 w-5" />
                 </div>
                 <div>
                   <p className="font-medium">Student Activities Board</p>
                   <p className="text-xs text-muted-foreground">Verified Organizer</p>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Recommended Events */}
        <RecommendedEvents />
      </div>
    </div>
  );
}
