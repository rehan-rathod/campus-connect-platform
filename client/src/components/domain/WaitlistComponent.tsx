import { Event } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Clock } from "lucide-react";

interface WaitlistComponentProps {
  event: Event;
  isFull: boolean;
}

export function WaitlistComponent({ event, isFull }: WaitlistComponentProps) {
  const [isOnWaitlist, setIsOnWaitlist] = useState(false);
  const { toast } = useToast();

  if (!isFull) return null;

  const handleJoinWaitlist = () => {
    setIsOnWaitlist(!isOnWaitlist);
    toast({
      title: isOnWaitlist ? "Removed from Waitlist" : "Added to Waitlist",
      description: isOnWaitlist
        ? "You've been removed from the waitlist."
        : `You're #${event.waitlist.length + 1} on the waitlist. We'll notify you if a spot opens up!`,
    });
  };

  return (
    <div className="border border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-4 space-y-3">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">Event is Full</h4>
          <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
            This event has reached capacity, but you can join the waitlist to be notified if a spot opens up.
          </p>
        </div>
      </div>
      <Button
        variant={isOnWaitlist ? "outline" : "secondary"}
        className="w-full"
        onClick={handleJoinWaitlist}
      >
        <Clock className="h-4 w-4 mr-2" />
        {isOnWaitlist ? "Remove from Waitlist" : "Join Waitlist"}
      </Button>
      {isOnWaitlist && (
        <p className="text-xs text-yellow-700 dark:text-yellow-300">
          Position on waitlist: #{event.waitlist.length + 1}
        </p>
      )}
    </div>
  );
}
