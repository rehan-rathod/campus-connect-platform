import { getEvents } from "@/lib/mockData";
import { EventCard } from "@/components/domain/EventCard";
import { ActivityFeed } from "@/components/domain/ActivityFeed";
import { SearchBar } from "@/components/domain/SearchBar";
import { CategoryCard } from "@/components/domain/CategoryCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Star, Users } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import heroImage from "@assets/generated_images/modern_university_campus_hero_image.png";

export default function Home() {
  const featuredEvents = getEvents({ status: "approved" }).slice(0, 3);
  const allEvents = getEvents({ status: "approved" });

  // Count events by category
  const categoryCounts = allEvents.reduce((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Campus" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 via-purple-900/50 to-background/90" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto space-y-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-heading font-bold leading-tight mb-4">
              Discover Your Next Campus Experience
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light max-w-3xl mx-auto">
              The central hub for all ITM SLS Baroda University events, workshops, and activities.
            </p>
          </motion.div>

          {/* Search Bar */}
          <SearchBar />

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Link href="/events">
              <Button size="lg" className="text-lg px-8 h-14 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30" data-testid="button-browse-events">
                Browse Events <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8 h-14 bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20" data-testid="button-organize-event">
                Organize Event
              </Button>
            </Link>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-8 pt-8 text-white/80"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm">{allEvents.length}+ Events</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm">{allEvents.reduce((sum, e) => sum + e.attendees, 0)}+ Attendees</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              <span className="text-sm">4.7 Avg Rating</span>
            </div>
          </motion.div>
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

      {/* Browse by Category */}
      <section className="bg-gradient-to-b from-muted/30 to-background py-20">
        <div className="container space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-4xl font-heading font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore events tailored to your interests across various categories
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Academic', 'Social', 'Sports', 'Music'].map((cat, index) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <CategoryCard category={cat} count={categoryCounts[cat] || 0} />
              </motion.div>
            ))}
          </div>

          {/* Live Activity Feed */}
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 md:order-1 order-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-heading font-bold mb-6">Trending Events</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredEvents.slice(0, 2).map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </motion.div>
            </div>
            <motion.div
              className="md:order-2 order-1"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <ActivityFeed />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
