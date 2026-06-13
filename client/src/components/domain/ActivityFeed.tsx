import { useGetActivities } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { UserPlus, CheckCircle2, MessageSquare, Loader2 } from "lucide-react";

interface Activity {
  id: string;
  type: "registered" | "checked-in" | "reviewed" | string;
  userName: string;
  createdAt: string | Date;
  detail?: string;
}

export function ActivityFeed() {
  const { data: activities, isLoading } = useGetActivities();

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

  const formatTime = (dateInput: string | Date) => {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (!date) return "";
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  if (isLoading) {
    return (
      <Card className="p-4 bg-gradient-to-b from-primary/5 to-transparent flex items-center justify-center h-48">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-to-b from-primary/5 to-transparent">
      <h3 className="font-bold text-lg mb-4">Live Activity</h3>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {!activities || activities.length === 0 ? (
          <p className="text-muted-foreground text-sm py-4 text-center">No recent activity.</p>
        ) : (
          activities.map((activity: Activity) => (
            <div key={activity.id} className="flex gap-3 pb-3 border-b last:border-b-0">
              <div className="mt-1">{getIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.userName}</span>
                  <span className="text-muted-foreground"> {activity.detail}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">{formatTime(activity.createdAt)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
