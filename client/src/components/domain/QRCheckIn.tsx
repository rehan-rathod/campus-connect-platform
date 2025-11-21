import React, { useRef } from "react";
import QRCode from "qrcode.react";
import { Event } from "@/lib/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRCheckInProps {
  event: Event;
}

export function QRCheckIn({ event }: QRCheckInProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const qrData = JSON.stringify({
    eventId: event.id,
    eventTitle: event.title,
    date: event.date.toISOString(),
    location: event.location,
  });

  const downloadQR = () => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector("canvas");
      if (canvas) {
        const url = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = url;
        link.download = `${event.id}-qr.png`;
        link.click();
        toast({ title: "QR Code Downloaded" });
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <QrCode className="h-4 w-4 mr-2" /> Check-in QR
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Event Check-in QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6">
          <div ref={qrRef} className="bg-white p-4 rounded-lg">
            <QRCode value={qrData} size={256} />
          </div>
          <div className="text-center">
            <p className="font-semibold text-sm">{event.title}</p>
            <p className="text-xs text-muted-foreground">{event.date.toLocaleString()}</p>
          </div>
          <Button onClick={downloadQR} className="w-full">
            <Download className="h-4 w-4 mr-2" /> Download QR
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
