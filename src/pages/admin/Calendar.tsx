"use client"

import { useState } from "react"
import { CalendarIcon, Plus, Edit, Clock, MapPin, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const academicEvents = [
  {
    id: 1,
    title: "Fall Semester Begins",
    date: "2024-09-02",
    type: "semester",
    description: "First day of fall semester classes",
    location: "Campus-wide",
    status: "confirmed",
  },
  {
    id: 2,
    title: "Registration Deadline",
    date: "2024-09-15",
    type: "deadline",
    description: "Last day for course registration",
    location: "Online/Registrar",
    status: "confirmed",
  },
  {
    id: 3,
    title: "Midterm Exams",
    date: "2024-10-15",
    type: "exam",
    description: "Midterm examination period begins",
    location: "Various Halls",
    status: "confirmed",
  },
  {
    id: 4,
    title: "Fall Break",
    date: "2024-11-25",
    type: "holiday",
    description: "Thanksgiving break begins",
    location: "Campus-wide",
    status: "confirmed",
  },
  {
    id: 5,
    title: "Final Exams",
    date: "2024-12-10",
    type: "exam",
    description: "Final examination period",
    location: "Various Halls",
    status: "confirmed",
  },
  {
    id: 6,
    title: "Graduation Ceremony",
    date: "2024-12-20",
    type: "ceremony",
    description: "Fall semester graduation",
    location: "Main Auditorium",
    status: "confirmed",
  },
]

const upcomingEvents = [
  {
    id: 1,
    title: "Faculty Meeting",
    date: "2024-01-15",
    time: "14:00",
    type: "meeting",
    attendees: 45,
  },
  {
    id: 2,
    title: "Student Orientation",
    date: "2024-01-20",
    time: "09:00",
    type: "orientation",
    attendees: 200,
  },
  {
    id: 3,
    title: "Research Symposium",
    date: "2024-01-25",
    time: "10:00",
    type: "conference",
    attendees: 150,
  },
]

const getEventTypeColor = (type: string) => {
  switch (type) {
    case "semester":
      return "bg-blue-500"
    case "deadline":
      return "bg-red-500"
    case "exam":
      return "bg-orange-500"
    case "holiday":
      return "bg-green-500"
    case "ceremony":
      return "bg-purple-500"
    case "meeting":
      return "bg-gray-500"
    case "orientation":
      return "bg-indigo-500"
    case "conference":
      return "bg-pink-500"
    default:
      return "bg-gray-500"
  }
}

export default function AdminCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedView, setSelectedView] = useState("calendar")

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Academic Calendar</h1>
          <p className="text-gray-600">Manage academic events, deadlines, and important dates</p>
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
                <div className="text-2xl font-bold text-gray-800">24</div>
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
                <div className="text-2xl font-bold text-gray-800">8</div>
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
                <div className="text-2xl font-bold text-gray-800">3</div>
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
                <div className="text-2xl font-bold text-gray-800">5</div>
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
              <CalendarIcon className="h-5 w-5 text-purple-600" />
              Calendar View
            </CardTitle>
            <CardDescription>Navigate through academic calendar</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Clock className="h-5 w-5 text-orange-600" />
              Upcoming Events
            </CardTitle>
            <CardDescription>Next scheduled events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium text-gray-800">{event.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarIcon className="h-4 w-4" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      {event.attendees} attendees
                    </div>
                  </div>
                  <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Academic Events List */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <CalendarIcon className="h-5 w-5 text-purple-600" />
            Academic Events
          </CardTitle>
          <CardDescription>Manage important academic dates and deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {academicEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full ${getEventTypeColor(event.type)}`} />
                  <div className="space-y-1">
                    <h4 className="font-medium text-gray-800">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Event</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete Event</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
