import { Event } from "@/lib/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EmailNotificationsProps {
  event: Event;
}

export function EmailNotifications({ event }: EmailNotificationsProps) {
  const [subject, setSubject] = useState(`Reminder: ${event.title}`);
  const [message, setMessage] = useState(
    `Hi there!\n\nDon't forget about ${event.title} happening on ${event.date.toLocaleString()} at ${event.location}.\n\nWe can't wait to see you there!\n\nBest,\nCampusConnect Team`
  );
  const { toast } = useToast();

  const handleSendEmails = () => {
    const recipientCount = event.attendeeList.length;
    toast({
      title: "Emails Sent",
      description: `Email sent to ${recipientCount} attendees!`,
    });
  };

  const emailPreview = `
From: events@campusconnect.edu
To: attendee@university.edu
Subject: ${subject}

${message}
  `.trim();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Mail className="h-4 w-4 mr-2" /> Send Emails
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Email Notifications</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="compose">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium">Subject</label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-64 resize-none"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              📧 Will be sent to <strong>{event.attendeeList.length} attendees</strong>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            <div className="bg-muted p-4 rounded-lg text-sm font-mono whitespace-pre-wrap break-words max-h-96 overflow-auto">
              {emailPreview}
            </div>
          </TabsContent>
        </Tabs>

        <Button onClick={handleSendEmails} className="w-full mt-4">
          <Send className="h-4 w-4 mr-2" /> Send {event.attendeeList.length} Emails
        </Button>
      </DialogContent>
    </Dialog>
  );
}
