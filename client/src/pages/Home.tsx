import { useGetEvents } from "@/lib/api";
import { type Event } from "@shared/schema";
import { EventCard } from "@/components/domain/EventCard";
import { ActivityFeed } from "@/components/domain/ActivityFeed";
import { SearchBar } from "@/components/domain/SearchBar";
import { CategoryCard } from "@/components/domain/CategoryCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Star, Users, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import heroImage from "@assets/generated_images/modern_university_campus_hero_image.png";

export default function Home() {
  const { data: allEvents, isLoading } = useGetEvents("approved");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground animate-pulse">Loading amazing campus experiences...</p>
        </div>
      </div>
    );
  }

  const eventsList = allEvents || [];
  const featuredEvents = eventsList.slice(0, 3);

  // Count events by category
  const categoryCounts = eventsList.reduce((acc: Record<string, number>, event: Event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[650px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Campus" 
            className="w-full h-full object-cover scale-105 filter brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/70 via-purple-950/60 to-background" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto space-y-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-heading font-bold leading-tight mb-4 tracking-tight drop-shadow-md">
              Discover Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400">Campus Experience</span>
            </h1>
            <p className="text-lg md:text-2xl text-white/95 font-light max-w-3xl mx-auto drop-shadow">
              The central hub for all ITM SLS Baroda University events, workshops, and activities.
            </p>
          </motion.div>

          {/* Search Bar Container with Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"
          >
            <SearchBar />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-2"
          >
            <Link href="/events">
              <Button size="lg" className="text-lg px-8 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20" data-testid="button-browse-events">
                Browse Events <ArrowRight className="ml-2 h-5 w-5 animate-pulse" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8 h-14 bg-white/5 backdrop-blur border-white/20 text-white hover:bg-white/10 hover:border-white/30" data-testid="button-organize-event">
                Organize Event
              </Button>
            </Link>
          </motion.div>

          {/* Quick Stats Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="grid grid-cols-3 divide-x divide-white/10 max-w-md mx-auto pt-6 text-white/80"
          >
            <div className="flex flex-col items-center">
              <TrendingUp className="h-5 w-5 text-blue-400 mb-1" />
              <span className="text-sm font-semibold">{eventsList.length}+ Events</span>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-5 w-5 text-indigo-400 mb-1" />
              <span className="text-sm font-semibold">{eventsList.reduce((sum: number, e: Event) => sum + e.attendees, 0)}+ RSVPs</span>
            </div>
            <div className="flex flex-col items-center">
              <Star className="h-5 w-5 text-pink-400 mb-1" />
              <span className="text-sm font-semibold">4.8 Rating</span>
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
          {featuredEvents.map((event: Event) => (
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
                  {featuredEvents.slice(0, 2).map((event: Event) => (
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
