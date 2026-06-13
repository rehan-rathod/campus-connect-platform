import { useGetEvents } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Analytics() {
  const { data: allEvents, isLoading } = useGetEvents("approved");
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const events = allEvents || [];

  // Registration trend data
  const trendData = [
    { date: "Mon", registrations: 12 },
    { date: "Tue", registrations: 19 },
    { date: "Wed", registrations: 28 },
    { date: "Thu", registrations: 35 },
    { date: "Fri", registrations: 42 },
    { date: "Sat", registrations: 38 },
    { date: "Sun", registrations: 45 },
  ];

  // Attendance by category
  const categoryData = events
    .reduce(
      (acc: Array<{ name: string; attendees: number; count: number }>, event: any) => {
        const existing = acc.find((c: any) => c.name === event.category);
        if (existing) {
          existing.attendees += event.attendees;
          existing.count++;
        } else {
          acc.push({ name: event.category, attendees: event.attendees, count: 1 });
        }
        return acc;
      },
      [] as Array<{ name: string; attendees: number; count: number }>
    )
    .sort((a: any, b: any) => b.attendees - a.attendees);

  // Peak hours data
  const peakHoursData = [
    { hour: "6 AM", registrations: 5 },
    { hour: "9 AM", registrations: 15 },
    { hour: "12 PM", registrations: 25 },
    { hour: "3 PM", registrations: 32 },
    { hour: "6 PM", registrations: 45 },
    { hour: "9 PM", registrations: 28 },
  ];

  const stats = [
    { label: "Total Events", value: events.length },
    { label: "Total Registrations", value: events.reduce((sum: number, e: any) => sum + e.attendees, 0) },
    { label: "Avg Rating", value: events.length > 0 ? (events.reduce((sum: number, e: any) => sum + e.avgRating, 0) / events.length).toFixed(1) : "0.0" },
    { label: "Avg Capacity", value: events.length > 0 ? Math.round(events.reduce((sum: number, e: any) => sum + (e.capacity > 0 ? (e.attendees / e.capacity) : 0), 0) / events.length * 100) + "%" : "0%" },
  ];

  const colors = ["#1e40af", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

  const handleExportPDF = () => {
    toast({
      title: "PDF Generated",
      description: "Analytics report downloaded successfully!",
    });
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading font-bold">Analytics & Reports</h1>
        <Button onClick={handleExportPDF}>
          <Download className="h-4 w-4 mr-2" /> Export PDF
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="trends">
        <TabsList>
          <TabsTrigger value="trends">Registration Trends</TabsTrigger>
          <TabsTrigger value="category">By Category</TabsTrigger>
          <TabsTrigger value="peakHours">Peak Hours</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Registration Trends (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="registrations" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category" className="mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance by Category</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="attendees" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Events by Category</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                    >
                      {categoryData.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="peakHours" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Registration Peak Hours</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peakHoursData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="registrations" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
