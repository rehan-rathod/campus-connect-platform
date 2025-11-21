import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createEvent } from "@/lib/mockData";
import { useState } from "react";
import { Plus, MapPin } from "lucide-react";
import { LocationPicker } from "@/components/domain/LocationPicker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().refine((val) => new Date(val) > new Date(), "Date must be in the future"),
  location: z.string().min(2, "Location is required"),
  category: z.enum(["Academic", "Social", "Sports", "Workshop", "Music"]),
  capacity: z.string().transform((val) => parseInt(val, 10)).refine((val) => val > 0, "Capacity must be positive"),
  locationCoordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional(),
});

export function EventForm({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      location: "",
      category: "Academic",
      capacity: 50,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newEvent = createEvent({
      ...values,
      date: new Date(values.date),
      organizerId: "u2", // Hardcoded for demo
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1000&q=80",
      category: values.category as any,
      tags: [],
      reviews: [],
      attendeeList: [],
      waitlist: [],
      avgRating: 0,
      locationCoordinates: values.locationCoordinates,
    });

    toast({
      title: "Event Request Submitted",
      description: "Your event has been submitted for approval.",
    });

    setOpen(false);
    form.reset();
    if (onSuccess) onSuccess();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Submit a new event proposal. This will require approval from an administrator.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Annual Science Fair" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Academic">Academic</SelectItem>
                        <SelectItem value="Social">Social</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="Workshop">Workshop</SelectItem>
                        <SelectItem value="Music">Music</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date & Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="location">Location Map</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Room 302" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your event..." 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="location" className="space-y-4">
                <FormItem>
                  <FormLabel>Pin Location on Map</FormLabel>
                  <FormControl>
                    <LocationPicker 
                      onLocationChange={(coords) => {
                        form.setValue("locationCoordinates", coords);
                      }} 
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Drag the marker to set the precise location of the event.
                  </p>
                </FormItem>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="submit">Submit for Approval</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
