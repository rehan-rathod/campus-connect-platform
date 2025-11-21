import { getEvents } from "@/lib/mockData";
import { EventCard } from "./EventCard";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";

export function RecommendedEvents() {
  const { user } = useAuth();

  // Get recommendations based on user role/interests
  const allEvents = getEvents({ status: "approved" });
  
  // Mock recommendation algorithm: if attendee, show by rating
  const recommendations = allEvents
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 3);

  if (recommendations.length === 0) return null;

  return (
    <section className="py-12">
      <h2 className="text-2xl font-heading font-bold mb-6">Recommended For You</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((event, idx) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <EventCard event={event} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
