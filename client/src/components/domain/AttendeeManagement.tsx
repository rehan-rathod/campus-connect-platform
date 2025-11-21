import { Event, Attendee } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface AttendeeManagementProps {
  event: Event;
}

export function AttendeeManagement({ event }: AttendeeManagementProps) {
  const [attendees, setAttendees] = useState(event.attendeeList);
  const { toast } = useToast();

  const handleCheckIn = (attendeeId: string) => {
    setAttendees(
      attendees.map((a) =>
        a.id === attendeeId
          ? { ...a, status: "checked-in" as const, checkedInAt: new Date() }
          : a
      )
    );
    toast({ title: "Attendee Checked In", variant: "default" });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">Attendee List</h3>
        <Badge variant="outline">{attendees.length} Total</Badge>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendees.map((attendee) => (
              <TableRow key={attendee.id}>
                <TableCell className="font-medium">{attendee.name}</TableCell>
                <TableCell className="text-sm">{attendee.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={attendee.status === "checked-in" ? "default" : "outline"}
                    className={attendee.status === "checked-in" ? "bg-green-500" : ""}
                  >
                    {attendee.status === "checked-in" ? "✓ Checked In" : "Registered"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {attendee.checkedInAt?.toLocaleTimeString() || "—"}
                </TableCell>
                <TableCell>
                  {attendee.status !== "checked-in" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCheckIn(attendee.id)}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {event.waitlist.length > 0 && (
        <div className="mt-6 pt-6 border-t space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4" /> Waitlist ({event.waitlist.length})
          </h4>
          <div className="space-y-2">
            {event.waitlist.slice(0, 5).map((person, idx) => (
              <div key={person.id} className="flex justify-between text-sm p-2 bg-muted rounded">
                <span>#{idx + 1} - {person.name}</span>
                <Button size="sm" variant="outline">Move Up</Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
