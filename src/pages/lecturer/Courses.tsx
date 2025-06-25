import { BookOpen, Users, Clock, Plus, Edit, Eye, Settings, Calendar, BarChart3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const coursesData = [
  {
    id: "CS301",
    title: "Data Structures & Algorithms",
    code: "CS 301",
    semester: "Fall 2024",
    students: 45,
    schedule: "MWF 10:00 AM - 11:30 AM",
    room: "CS-101",
    credits: 3,
    status: "Active",
    progress: 65,
  },
  {
    id: "CS401",
    title: "Database Management Systems",
    code: "CS 401",
    semester: "Fall 2024",
    students: 38,
    schedule: "TTh 2:00 PM - 3:30 PM",
    room: "CS-205",
    credits: 4,
    status: "Active",
    progress: 58,
  },
  {
    id: "CS402",
    title: "Software Engineering",
    code: "CS 402",
    semester: "Fall 2024",
    students: 42,
    schedule: "MWF 1:00 PM - 2:30 PM",
    room: "CS-102",
    credits: 3,
    status: "Active",
    progress: 72,
  },
  {
    id: "CS350",
    title: "Web Development",
    code: "CS 350",
    semester: "Fall 2024",
    students: 31,
    schedule: "TTh 11:00 AM - 12:30 PM",
    room: "Lab-105",
    credits: 3,
    status: "Active",
    progress: 45,
  },
]

const upcomingClasses = [
  {
    course: "Data Structures & Algorithms",
    time: "10:00 AM",
    room: "CS-101",
    type: "Lecture",
    topic: "Binary Search Trees",
  },
  {
    course: "Software Engineering",
    time: "1:00 PM",
    room: "CS-102",
    type: "Lab",
    topic: "Agile Development",
  },
  {
    course: "Database Management Systems",
    time: "2:00 PM",
    room: "CS-205",
    type: "Lecture",
    topic: "SQL Joins",
  },
]

export default function LecturerCourses() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600">Manage your assigned courses and class schedules</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Request New Course
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{coursesData.length}</div>
                <div className="text-sm text-gray-600">Active Courses</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-green-600 text-white">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {coursesData.reduce((sum, course) => sum + course.students, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Students</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">12</div>
                <div className="text-sm text-gray-600">Hours/Week</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {Math.round(coursesData.reduce((sum, course) => sum + course.progress, 0) / coursesData.length)}%
                </div>
                <div className="text-sm text-gray-600">Avg Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Courses Table */}
        <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Course Management
            </CardTitle>
            <CardDescription>Overview of all your assigned courses</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coursesData.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{course.title}</div>
                        <div className="text-sm text-gray-600">
                          {course.code} • {course.credits} Credits
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{course.students}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{course.schedule}</div>
                        <div className="text-gray-500">{course.room}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${course.progress}%` }} />
                        </div>
                        <span className="text-sm text-gray-600">{course.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Today's Classes */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Calendar className="h-5 w-5 text-orange-600" />
              Today's Classes
            </CardTitle>
            <CardDescription>Your schedule for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingClasses.map((class_, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100"
              >
                <div className="space-y-2">
                  <div className="font-semibold text-gray-800">{class_.course}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{class_.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{class_.room}</span>
                    <Badge variant="outline" className="text-xs">
                      {class_.type}
                    </Badge>
                  </div>
                  <div className="text-sm text-blue-600 font-medium">Topic: {class_.topic}</div>
                  <Button size="sm" className="w-full mt-2">
                    Start Class
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
