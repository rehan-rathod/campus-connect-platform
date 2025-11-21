import { Event } from "@/lib/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

interface SocialShareProps {
  event: Event;
}

export function SocialShare({ event }: SocialShareProps) {
  const { toast } = useToast();
  const shareUrl = `https://campusconnect.edu/events/${event.id}`;

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Check out: ${event.title}\n${event.date.toLocaleString()}\n${shareUrl}`)}`,
    instagram: `https://instagram.com/share?url=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${event.title} - ${event.date.toLocaleString()}`)}`,
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({ title: "Link copied to clipboard!" });
  };

  const shareCard = `
${event.title}
📅 ${event.date.toLocaleString()}
📍 ${event.location}
👥 ${event.attendees}/${event.capacity} attending

Learn more: ${shareUrl}
  `.trim();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" /> Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share This Event</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Social Media Links */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Share on Social Media</h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(shareLinks.whatsapp)}
                className="flex-1"
              >
                📱 WhatsApp
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(shareLinks.twitter)}
                className="flex-1"
              >
                𝕏 Twitter
              </Button>
            </div>
          </div>

          {/* Copy Link */}
          <div className="border-t pt-4">
            <label className="text-sm font-medium">Share Link</label>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 border rounded-md bg-muted text-sm"
              />
              <Button size="sm" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Card Preview */}
          <div className="border-t pt-4">
            <label className="text-sm font-medium mb-2 block">Event Card</label>
            <Card className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="text-sm space-y-1 font-mono whitespace-pre-wrap break-words">
                {shareCard}
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
