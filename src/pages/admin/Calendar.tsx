"use client";

import { useState, useEffect } from "react";
import {
  CalendarIcon,
  Plus,
  Edit,
  Clock,
  MapPin,
  Users,
  Loader2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { calendarService } from "@/lib/dataService";

interface AcademicEvent {
  id: number;
  title: string;
  date: string;
  type: string;
  description: string;
  location: string;
  status: string;
}

interface UpcomingEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
  attendees: number;
}

export default function AdminCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [selectedView, setSelectedView] = useState("calendar");
  const [academicEvents, setAcademicEvents] = useState<AcademicEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch calendar events
      const { data: events, error: eventsError } =
        await calendarService.getCalendarEvents();

      if (eventsError) {
        setError(eventsError.message);
        return;
      }

      if (events) {
        const transformedAcademicEvents: AcademicEvent[] = events
          .filter((event) => event.event_type === "academic")
          .map((event) => ({
            id: parseInt(event.id),
            title: event.title,
            date: event.event_date
              ? new Date(event.event_date).toISOString().split("T")[0]
              : "TBD",
            type: event.category || "general",
            description: event.description || "No description",
            location: event.location || "TBD",
            status: event.status,
          }));

        const transformedUpcomingEvents: UpcomingEvent[] = events
          .filter((event) => event.event_type === "upcoming")
          .map((event) => ({
            id: parseInt(event.id),
            title: event.title,
            date: event.event_date
              ? new Date(event.event_date).toISOString().split("T")[0]
              : "TBD",
            time: event.start_time || "TBD",
            type: event.category || "general",
            attendees: event.attendees || 0,
          }));

        setAcademicEvents(transformedAcademicEvents);
        setUpcomingEvents(transformedUpcomingEvents);
      }
    } catch (err) {
      setError("Failed to fetch calendar data");
      console.error("Error fetching calendar data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "semester":
        return "bg-blue-500";
      case "deadline":
        return "bg-red-500";
      case "exam":
        return "bg-orange-500";
      case "holiday":
        return "bg-green-500";
      case "ceremony":
        return "bg-purple-500";
      case "meeting":
        return "bg-gray-500";
      case "orientation":
        return "bg-indigo-500";
      case "conference":
        return "bg-pink-500";
      default:
        return "bg-gray-500";
    }
  };

  const totalEvents = academicEvents.length + upcomingEvents.length;
  const thisMonthEvents = [...academicEvents, ...upcomingEvents].filter(
    (event) => {
      const eventDate = new Date(event.date);
      const now = new Date();
      return (
        eventDate.getMonth() === now.getMonth() &&
        eventDate.getFullYear() === now.getFullYear()
      );
    },
  ).length;
  const upcomingCount = upcomingEvents.length;
  const deadlinesCount = academicEvents.filter(
    (event) => event.type === "deadline",
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading calendar data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchData}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Academic Calendar
          </h1>
          <p className="text-gray-600">
            Manage academic events, deadlines, and important dates
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                <CalendarIcon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {totalEvents}
                </div>
                <div className="text-sm text-gray-600">Total Events</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-green-600 text-white">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {thisMonthEvents}
                </div>
                <div className="text-sm text-gray-600">This Month</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {upcomingCount}
                </div>
                <div className="text-sm text-gray-600">Upcoming</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {deadlinesCount}
                </div>
                <div className="text-sm text-gray-600">Deadlines</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              Academic Calendar
            </CardTitle>
            <CardDescription>View and manage academic events</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Clock className="h-5 w-5 text-blue-600" />
              Upcoming Events
            </CardTitle>
            <CardDescription>Next scheduled events</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-4">
                <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No upcoming events</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex-shrink-0">
                      <Badge className={getEventTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {event.date} at {event.time}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Event</DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Academic Events List */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <CalendarIcon className="h-5 w-5 text-blue-600" />
            Academic Events
          </CardTitle>
          <CardDescription>All academic events and deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          {academicEvents.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No academic events found.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {academicEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={getEventTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Event</DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CalendarIcon className="h-3 w-3" />
                    <span>{event.date}</span>
                    <MapPin className="h-3 w-3 ml-2" />
                    <span>{event.location}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
