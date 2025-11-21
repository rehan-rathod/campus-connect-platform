import { getEvents } from "@/lib/mockData";
import { EventCard } from "@/components/domain/EventCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/modern_university_campus_hero_image.png";

export default function Home() {
  const featuredEvents = getEvents({ status: "approved" }).slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Campus" 
            className="w-full h-full object-cover filter brightness-[0.7]"
          />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            Discover Your Next Campus Experience
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            The central hub for all university events, workshops, and activities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Link href="/events">
              <Button size="lg" className="text-lg px-8 h-12 bg-primary hover:bg-primary/90">
                Browse Events
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8 h-12 bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20">
                Organize Event
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="container py-16 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-heading font-bold text-foreground">Featured Events</h2>
          <Link href="/events">
            <Button variant="ghost" className="group">
              View All <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* Categories/Quick Links */}
      <section className="bg-muted/30 py-16">
        <div className="container text-center space-y-8">
          <h2 className="text-3xl font-heading font-bold">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Academic', 'Social', 'Sports', 'Music'].map((cat) => (
              <Link key={cat} href={`/events?category=${cat}`}>
                <div className="bg-background p-6 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border hover:border-primary/50 group">
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{cat}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
