import { useAuth } from "@/hooks/use-auth";
import { MOCK_EVENTS, updateEventStatus, Event } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Check, X, Clock, Calendar, Users } from "lucide-react";
import { EventForm } from "@/components/domain/EventForm";
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
  const [events, setEvents] = useState(MOCK_EVENTS);

  if (!user) return <div className="p-8 text-center">Please log in.</div>;

  const handleApproval = (id: string, approved: boolean) => {
    updateEventStatus(id, approved ? "approved" : "rejected");
    setEvents([...MOCK_EVENTS]); // Refresh local state
    toast({
      title: approved ? "Event Approved" : "Event Rejected",
      description: `The event has been ${approved ? "approved" : "rejected"}.`,
      variant: approved ? "default" : "destructive",
    });
  };

  // Approver/Admin View
  if (user.role === "admin" || user.role === "approver") {
    const pendingEvents = events.filter((e) => e.status === "pending");
    const stats = [
      { name: "Total Events", value: events.length },
      { name: "Pending", value: pendingEvents.length },
      { name: "Approved", value: events.filter(e => e.status === "approved").length },
      { name: "Total Attendees", value: events.reduce((acc, e) => acc + e.attendees, 0) },
    ];

    return (
      <div className="container py-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-heading font-bold">Admin Dashboard</h1>
          <EventForm onSuccess={() => setEvents([...MOCK_EVENTS])} />
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
                  {pendingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between border p-3 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.date.toLocaleDateString()} • {event.organizerId}
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
                  ))}
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
                <BarChart data={[
                  { name: 'Academic', attendees: 120 },
                  { name: 'Social', attendees: 200 },
                  { name: 'Sports', attendees: 350 },
                  { name: 'Music', attendees: 450 },
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
    const myEvents = events.filter((e) => e.organizerId === user.id);
    return (
      <div className="container py-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-heading font-bold">Organizer Dashboard</h1>
          <EventForm onSuccess={() => setEvents([...MOCK_EVENTS])} />
        </div>

        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="space-y-4 mt-4">
             {myEvents.map(event => (
               <div key={event.id} className="flex items-center justify-between border p-4 rounded-lg">
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
                 <Button variant="outline" size="sm">Manage</Button>
               </div>
             ))}
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
        {events.slice(0, 2).map(event => (
           <div key={event.id} className="flex items-center gap-4 border p-4 rounded-lg bg-card">
             <div className="h-16 w-16 rounded overflow-hidden">
               <img src={event.image} className="h-full w-full object-cover" />
             </div>
             <div>
               <h3 className="font-bold">{event.title}</h3>
               <p className="text-sm text-muted-foreground">{event.date.toLocaleString()}</p>
               <div className="mt-2">
                 <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Confirmed</span>
               </div>
             </div>
           </div>
        ))}
      </div>
    </div>
  );
}
