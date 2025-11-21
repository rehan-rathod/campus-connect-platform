import { Event } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CalendarExportProps {
  event: Event;
}

export function CalendarExport({ event }: CalendarExportProps) {
  const { toast } = useToast();

  const generateICS = () => {
    const startDate = event.date.toISOString().replace(/[:-]/g, "").split(".")[0];
    const endDate = new Date(event.date.getTime() + 2 * 60 * 60000)
      .toISOString()
      .replace(/[:-]/g, "")
      .split(".")[0];

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CampusConnect//Event Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${event.id}@campusconnect.edu
DTSTAMP:${new Date().toISOString().replace(/[:-]/g, "").split(".")[0]}Z
DTSTART:${startDate}Z
DTEND:${endDate}Z
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
ATTACH;FILENAME=${event.title}.ics:https://campusconnect.edu/events/${event.id}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`
    );
    element.setAttribute("download", `${event.title}.ics`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({ title: "Calendar file downloaded", description: "Import to Google, Outlook, or Apple Calendar" });
  };

  return (
    <Button onClick={generateICS} variant="outline" size="sm">
      <Calendar className="h-4 w-4 mr-2" /> Add to Calendar
    </Button>
  );
}
