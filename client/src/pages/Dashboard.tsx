import { useAuth } from "@/hooks/use-auth";
import { useGetEvents, useGetAnalytics, useUpdateEventStatus, useGetUserEvents } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Clock, Calendar, Users, Loader2 } from "lucide-react";
import { EventForm } from "@/components/domain/EventForm";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const { data: allEvents, isLoading: eventsLoading } = useGetEvents();
  const { data: analytics, isLoading: analyticsLoading } = useGetAnalytics();
  const { data: userEvents, isLoading: userEventsLoading } = useGetUserEvents(user?.id || "");

  // Mutations
  const updateStatusMutation = useUpdateEventStatus();

  if (!user) return <div className="p-8 text-center text-muted-foreground">Please log in.</div>;

  const isLoading = eventsLoading || analyticsLoading || userEventsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const eventsList = allEvents || [];

  const handleApproval = (id: string, approved: boolean) => {
    updateStatusMutation.mutate(
      { id, status: approved ? "approved" : "rejected" },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["events"] });
          queryClient.invalidateQueries({ queryKey: ["analytics"] });
          toast({
            title: approved ? "Event Approved" : "Event Rejected",
            description: `The event has been ${approved ? "approved" : "rejected"}.`,
            variant: approved ? "default" : "destructive",
          });
        },
        onError: (err: any) => {
          toast({
            title: "Operation Failed",
            description: err.message || "Something went wrong.",
            variant: "destructive",
          });
        },
      }
    );
  };

  // Approver/Admin View
  if (user.role === "admin" || user.role === "approver") {
    const pendingEvents = eventsList.filter((e: any) => e.status === "pending");
    const stats = [
      { name: "Total Events", value: analytics?.total || 0 },
      { name: "Pending", value: analytics?.pending || 0 },
      { name: "Approved", value: analytics?.approved || 0 },
      { name: "Total Attendees", value: analytics?.totalAttendees || 0 },
    ];

    // Compute category counts for chart dynamically from eventsList
    const categoryChartData = eventsList.reduce((acc: Array<{ name: string; attendees: number }>, event: any) => {
      if (event.status === "approved") {
        const existing = acc.find(c => c.name === event.category);
        if (existing) {
          existing.attendees += event.attendees;
        } else {
          acc.push({ name: event.category, attendees: event.attendees });
        }
      }
      return acc;
    }, [] as Array<{ name: string; attendees: number }>);

    return (
      <div className="container py-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-heading font-bold">Admin Dashboard</h1>
          <EventForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ["events"] })} />
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Approval Queue */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Approval Queue</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingEvents.length === 0 ? (
                <p className="text-muted-foreground text-sm">No pending requests.</p>
              ) : (
                <div className="space-y-4">
                  {pendingEvents.map((event: any) => {
                    const eventDate = typeof event.date === "string" || typeof event.date === "number"
                      ? new Date(event.date)
                      : event.date;
                    return (
                      <div key={event.id} className="flex items-center justify-between border p-3 rounded-lg bg-muted/30">
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {eventDate ? eventDate.toLocaleDateString() : "No Date"} • {event.organizerId}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleApproval(event.id, true)}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleApproval(event.id, false)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analytics Chart */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Attendance by Category</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData.length > 0 ? categoryChartData : [
                  { name: 'Academic', attendees: 0 },
                  { name: 'Social', attendees: 0 },
                  { name: 'Sports', attendees: 0 },
                  { name: 'Music', attendees: 0 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="attendees" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Organizer View
  if (user.role === "organizer") {
    const myEvents = eventsList.filter((e: any) => e.organizerId === user.id);
    return (
      <div className="container py-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-heading font-bold">Organizer Dashboard</h1>
          <EventForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ["events"] })} />
        </div>

        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="space-y-4 mt-4">
             {myEvents.length === 0 ? (
               <p className="text-muted-foreground p-4 text-center border border-dashed rounded-lg">No upcoming events created.</p>
             ) : (
               myEvents.map((event: any) => (
                 <div key={event.id} className="flex items-center justify-between border p-4 rounded-lg bg-card/50">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">{event.title}</h3>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                          <span className="capitalize flex items-center gap-1">
                            {event.status === 'approved' && <Check className="h-3 w-3 text-green-500" />}
                            {event.status === 'pending' && <Clock className="h-3 w-3 text-yellow-500" />}
                            {event.status}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Users className="h-3 w-3"/> {event.attendees} Attendees</span>
                        </div>
                      </div>
                   </div>
                   <Link href={`/event/${event.id}`}>
                     <Button variant="outline" size="sm">Manage</Button>
                   </Link>
                 </div>
               ))
             )}
          </TabsContent>
          <TabsContent value="past">
            <p className="text-muted-foreground p-4">No past events to display.</p>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Attendee View
  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-heading font-bold">My Schedule</h1>
      <div className="grid gap-4">
        {userEvents && userEvents.length > 0 ? (
          userEvents.map((event: any) => {
            const eventDate = typeof event.date === "string" || typeof event.date === "number"
              ? new Date(event.date)
              : event.date;
            return (
              <div key={event.id} className="flex items-center gap-4 border p-4 rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0 bg-muted">
                  <img src={event.image || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d"} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/event/${event.id}`}>
                    <h3 className="font-bold hover:underline cursor-pointer truncate">{event.title}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">{eventDate ? eventDate.toLocaleString() : "No Date"}</p>
                  <div className="mt-2">
                    <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-0.5 rounded-full capitalize font-medium">
                      {event.registrationStatus || "Registered"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-muted-foreground p-8 text-center border-2 border-dashed rounded-lg bg-muted/20">
            You haven't RSVP'd to any events yet.
          </p>
        )}
      </div>
    </div>
  );
}
