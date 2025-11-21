import { Link, useLocation } from "wouter";
import { Home, Calendar, PlusCircle, BarChart3, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";

export function MobileNav() {
  const [location] = useLocation();
  const { user } = useAuth();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/dashboard", label: "Create", icon: PlusCircle, highlight: true },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard", label: "Profile", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200 safe-area-inset-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item, index) => {
          const isActive = location === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center justify-center relative px-4 py-2 rounded-xl transition-all ${
                  item.highlight
                    ? "bg-primary text-white shadow-lg shadow-primary/30 -mt-6 px-6 py-3"
                    : isActive
                    ? "text-primary"
                    : "text-gray-500"
                }`}
                data-testid={`nav-mobile-${item.label.toLowerCase()}`}
              >
                <Icon className={`h-6 w-6 ${item.highlight ? "h-7 w-7" : ""}`} />
                <span className={`text-xs mt-1 font-medium ${item.highlight ? "hidden" : ""}`}>
                  {item.label}
                </span>

                {/* Active Indicator */}
                {isActive && !item.highlight && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
