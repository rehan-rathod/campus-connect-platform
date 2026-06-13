import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Calendar, Menu, User, LogOut, Map, Sun, Moon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useGetNotifications } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { MobileNav } from "@/components/domain/MobileNav";
import { useTheme } from "next-themes";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  const { data: notificationsData } = useGetNotifications(user?.id || "");
  const notifications = notificationsData || [];
  const unreadNotifications = notifications.filter((n: any) => !n.read).length;

  // Check if we are on the login or register page
  const isAuthPage = location === "/login" || location === "/register";

  if (isAuthPage) {
    return (
      <main className="min-h-screen bg-background">
        {children}
      </main>
    );
  }

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/campus-map", label: "Campus Map" },
    { href: "/analytics", label: "Analytics" },
    ...(user ? [{ href: "/dashboard", label: "Dashboard" }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        {/* Decorative Glow Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[100px] left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-blue-500/20 blur-[80px] rounded-full opacity-50" />
          <div className="absolute -top-[100px] left-1/4 -translate-x-1/2 w-[400px] h-[200px] bg-purple-500/20 blur-[80px] rounded-full opacity-50" />
          <div className="absolute -top-[100px] right-1/4 translate-x-1/2 w-[400px] h-[200px] bg-pink-500/20 blur-[80px] rounded-full opacity-50" />
        </div>
        <div className="container relative flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-heading font-bold text-xl text-primary hover:opacity-90 transition-opacity">
              <Calendar className="h-6 w-6" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                CampusConnect
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent/50 ${
                      isActive 
                        ? "text-foreground font-semibold" 
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                  <SheetDescription className="sr-only">Navigation links</SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href} className="text-lg font-medium">
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No new notifications
                  </div>
                ) : (
                  notifications.slice(0, 3).map((n: any) => {
                    const dateVal = n.createdAt ? new Date(n.createdAt) : new Date();
                    return (
                      <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 p-3">
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium text-xs uppercase text-muted-foreground">
                            {n.type}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {dateVal.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{n.message}</p>
                      </DropdownMenuItem>
                    );
                  })
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-primary font-medium">
                  View all
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="mr-1"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-muted-foreground hover:text-foreground" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-muted-foreground hover:text-foreground" />
              <span className="sr-only">Toggle Theme</span>
            </Button>

            {/* User Menu / Role Switcher */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || undefined} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      <Badge variant="outline" className="w-fit mt-2 capitalize">
                        {user.role}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logoutMutation.mutate()} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Link href="/login">
                  <Button size="sm" variant="ghost">
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      <footer className="border-t bg-muted/30 py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 CampusConnect - ITM SLS Baroda University. Built for the University Community.
          </p>
        </div>
      </footer>
    </div>
  );
}
