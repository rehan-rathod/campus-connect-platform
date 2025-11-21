import { Link } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, Users, Trophy, Music, Briefcase, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CategoryCardProps {
  category: string;
  icon?: string;
  count?: number;
  gradient?: string;
}

const categoryConfig = {
  Academic: {
    icon: BookOpen,
    gradient: "from-blue-500 to-blue-600",
    color: "text-blue-600",
  },
  Social: {
    icon: Users,
    gradient: "from-purple-500 to-purple-600",
    color: "text-purple-600",
  },
  Sports: {
    icon: Trophy,
    gradient: "from-green-500 to-green-600",
    color: "text-green-600",
  },
  Music: {
    icon: Music,
    gradient: "from-pink-500 to-pink-600",
    color: "text-pink-600",
  },
  Workshop: {
    icon: Briefcase,
    gradient: "from-orange-500 to-orange-600",
    color: "text-orange-600",
  },
  All: {
    icon: Sparkles,
    gradient: "from-indigo-500 to-indigo-600",
    color: "text-indigo-600",
  },
};

export function CategoryCard({ category, count = 0 }: CategoryCardProps) {
  const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.All;
  const Icon = config.icon;

  return (
    <Link href={`/events?category=${category}`}>
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Card className="relative overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary/30 transition-all duration-300 group" data-testid={`card-category-${category.toLowerCase()}`}>
          {/* Gradient Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
          
          <div className="relative p-6 flex flex-col items-center text-center space-y-3">
            {/* Icon Container */}
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${config.gradient} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
              <Icon className="h-8 w-8 text-white" />
            </div>
            
            {/* Category Name */}
            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
              {category}
            </h3>
            
            {/* Event Count */}
            {count > 0 && (
              <p className="text-sm text-muted-foreground">
                {count} {count === 1 ? 'event' : 'events'}
              </p>
            )}
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}
