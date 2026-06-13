import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { Layout } from "@/components/layout/Layout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Events from "@/pages/Events";
import Dashboard from "@/pages/Dashboard";
import Analytics from "@/pages/Analytics";
import EventDetails from "@/pages/EventDetails";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import CampusMap from "@/pages/CampusMap";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/events" component={Events} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/campus-map" component={CampusMap} />
        <Route path="/event/:id" component={EventDetails} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

import { ThemeProvider } from "next-themes";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Router />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
