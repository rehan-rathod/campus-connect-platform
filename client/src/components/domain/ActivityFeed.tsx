import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { UserPlus, CheckCircle2, MessageSquare } from "lucide-react";

interface Activity {
  id: string;
  type: "registered" | "checked-in" | "reviewed";
  userName: string;
  timestamp: Date;
  detail?: string;
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "a1",
      type: "registered",
      userName: "Emma Johnson",
      timestamp: new Date(Date.now() - 5 * 60000),
      detail: "registered for Hackathon",
    },
    {
      id: "a2",
      type: "checked-in",
      userName: "Alex Chen",
      timestamp: new Date(Date.now() - 10 * 60000),
      detail: "checked in to AI Ethics",
    },
    {
      id: "a3",
      type: "reviewed",
      userName: "Sarah Parker",
      timestamp: new Date(Date.now() - 15 * 60000),
      detail: "left a 5-star review",
    },
    {
      id: "a4",
      type: "registered",
      userName: "David Kumar",
      timestamp: new Date(Date.now() - 20 * 60000),
      detail: "registered for Concert",
    },
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case "registered":
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      case "checked-in":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "reviewed":
        return <MessageSquare className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <Card className="p-4 bg-gradient-to-b from-primary/5 to-transparent">
      <h3 className="font-bold text-lg mb-4">Live Activity</h3>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3 pb-3 border-b last:border-b-0">
            <div className="mt-1">{getIcon(activity.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium">{activity.userName}</span>
                <span className="text-muted-foreground"> {activity.detail}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">{formatTime(activity.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
