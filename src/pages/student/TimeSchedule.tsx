import { Calendar, Clock, MapPin, Video } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const scheduleData = [
  {
    time: "09:00 AM - 10:30 AM",
    subject: "Mathematics",
    code: "MATH 101",
    instructor: "Dr. Johnson",
    room: "Room 201",
    type: "Lecture",
    day: "Monday",
  },
  {
    time: "11:00 AM - 12:30 PM",
    subject: "Computer Science",
    code: "CS 201",
    instructor: "Prof. Smith",
    room: "Lab 105",
    type: "Lab",
    day: "Monday",
  },
  {
    time: "02:00 PM - 03:30 PM",
    subject: "Physics",
    code: "PHY 101",
    instructor: "Dr. Brown",
    room: "Room 301",
    type: "Lecture",
    day: "Monday",
  },
  {
    time: "10:00 AM - 11:30 AM",
    subject: "English Literature",
    code: "ENG 102",
    instructor: "Prof. Davis",
    room: "Room 150",
    type: "Seminar",
    day: "Tuesday",
  },
  {
    time: "01:00 PM - 02:30 PM",
    subject: "Mathematics",
    code: "MATH 101",
    instructor: "Dr. Johnson",
    room: "Online",
    type: "Tutorial",
    day: "Tuesday",
  },
]

const upcomingClasses = [
  {
    subject: "Mathematics",
    time: "09:00 AM",
    duration: "1h 30m",
    room: "Room 201",
    type: "Lecture",
    status: "upcoming",
  },
  {
    subject: "Computer Science",
    time: "11:00 AM",
    duration: "1h 30m",
    room: "Lab 105",
    type: "Lab",
    status: "upcoming",
  },
  {
    subject: "Physics",
    time: "02:00 PM",
    duration: "1h 30m",
    room: "Room 301",
    type: "Lecture",
    status: "upcoming",
  },
]

export default function TimeSchedule() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Time Schedule</h1>
          <p className="text-gray-600">Manage your class timetable and upcoming sessions</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
          <Calendar className="h-4 w-4 mr-2" />
          Export Schedule
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Classes */}
        <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Calendar className="h-5 w-5 text-blue-600" />
              Weekly Schedule
            </CardTitle>
            <CardDescription>Your complete class timetable</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduleData.map((class_, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{class_.time}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{class_.subject}</div>
                        <div className="text-sm text-gray-500">{class_.code}</div>
                      </div>
                    </TableCell>
                    <TableCell>{class_.instructor}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {class_.room === "Online" ? (
                          <Video className="h-4 w-4 text-green-600" />
                        ) : (
                          <MapPin className="h-4 w-4 text-blue-600" />
                        )}
                        <span>{class_.room}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={class_.type === "Lab" ? "default" : "secondary"}>{class_.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        Join
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Upcoming Classes */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Clock className="h-5 w-5 text-orange-600" />
              Today's Classes
            </CardTitle>
            <CardDescription>Your classes for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingClasses.map((class_, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-800">{class_.subject}</div>
                    <Badge variant={class_.type === "Lab" ? "default" : "secondary"}>{class_.type}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      {class_.time} ({class_.duration})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{class_.room}</span>
                  </div>
                  <Button size="sm" className="w-full mt-2">
                    Join Class
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Calendar View */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Calendar className="h-5 w-5 text-purple-600" />
            Calendar View
          </CardTitle>
          <CardDescription>Visual representation of your schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 text-center">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="p-2 font-semibold text-gray-700 bg-gray-100 rounded">
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }, (_, i) => (
              <div key={i} className="p-2 h-20 border border-gray-200 rounded hover:bg-blue-50 cursor-pointer">
                <div className="text-sm text-gray-600">{((i % 31) + 1).toString()}</div>
                {i % 7 < 5 && i > 6 && i < 28 && (
                  <div className="text-xs bg-blue-100 text-blue-800 rounded px-1 mt-1">Class</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
