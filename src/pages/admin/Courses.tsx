"use client"

import { useState } from "react"
import { BookOpen, Search, Filter, Plus, Edit, Trash2, Eye, Clock, Users, Calendar } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const coursesData = [
  {
    id: "CS101",
    name: "Introduction to Computer Science",
    department: "Computer Science",
    lecturer: "Dr. Sarah Mitchell",
    credits: 3,
    semester: "Fall 2024",
    enrolled: 45,
    capacity: 50,
    schedule: "MWF 10:00-11:00",
    room: "CS-201",
    status: "Active",
    level: "Undergraduate",
  },
  {
    id: "MATH201",
    name: "Calculus II",
    department: "Mathematics",
    lecturer: "Prof. Michael Johnson",
    credits: 4,
    semester: "Fall 2024",
    enrolled: 38,
    capacity: 40,
    schedule: "TTh 14:00-16:00",
    room: "MATH-105",
    status: "Active",
    level: "Undergraduate",
  },
  {
    id: "PHY301",
    name: "Quantum Physics",
    department: "Physics",
    lecturer: "Dr. Emily Chen",
    credits: 3,
    semester: "Fall 2024",
    enrolled: 22,
    capacity: 30,
    schedule: "MWF 13:00-14:00",
    room: "PHY-301",
    status: "Active",
    level: "Graduate",
  },
  {
    id: "ENG102",
    name: "English Literature",
    department: "English",
    lecturer: "Prof. David Wilson",
    credits: 3,
    semester: "Fall 2024",
    enrolled: 35,
    capacity: 40,
    schedule: "TTh 10:00-11:30",
    room: "ENG-201",
    status: "Active",
    level: "Undergraduate",
  },
  {
    id: "BIO401",
    name: "Advanced Genetics",
    department: "Biology",
    lecturer: "Dr. Lisa Anderson",
    credits: 4,
    semester: "Fall 2024",
    enrolled: 18,
    capacity: 25,
    schedule: "MWF 15:00-17:00",
    room: "BIO-Lab1",
    status: "Active",
    level: "Graduate",
  },
]

const scheduleData = [
  {
    time: "08:00-09:00",
    monday: "CS101 - CS-201",
    tuesday: "",
    wednesday: "CS101 - CS-201",
    thursday: "",
    friday: "CS101 - CS-201",
  },
  {
    time: "09:00-10:00",
    monday: "",
    tuesday: "MATH201 - MATH-105",
    wednesday: "",
    thursday: "MATH201 - MATH-105",
    friday: "",
  },
  {
    time: "10:00-11:00",
    monday: "ENG102 - ENG-201",
    tuesday: "",
    wednesday: "PHY301 - PHY-301",
    thursday: "ENG102 - ENG-201",
    friday: "PHY301 - PHY-301",
  },
  {
    time: "11:00-12:00",
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
  },
  {
    time: "13:00-14:00",
    monday: "PHY301 - PHY-301",
    tuesday: "",
    wednesday: "PHY301 - PHY-301",
    thursday: "",
    friday: "PHY301 - PHY-301",
  },
  {
    time: "14:00-15:00",
    monday: "",
    tuesday: "MATH201 - MATH-105",
    wednesday: "",
    thursday: "MATH201 - MATH-105",
    friday: "",
  },
  {
    time: "15:00-16:00",
    monday: "BIO401 - BIO-Lab1",
    tuesday: "",
    wednesday: "BIO401 - BIO-Lab1",
    thursday: "",
    friday: "BIO401 - BIO-Lab1",
  },
]

export default function AdminCourses() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All")
  const [activeTab, setActiveTab] = useState("courses")

  const departments = ["All", "Computer Science", "Mathematics", "Physics", "English", "Biology"]

  const filteredCourses = coursesData.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.lecturer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "All" || course.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses & Schedules</h1>
          <p className="text-gray-600">Manage course offerings and class schedules</p>
        </div>
        <div className="flex items-center gap-4">
          <Button className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </div>
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
                <div className="text-2xl font-bold text-gray-800">89</div>
                <div className="text-sm text-gray-600">Total Courses</div>
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
                <div className="text-2xl font-bold text-gray-800">2,158</div>
                <div className="text-sm text-gray-600">Total Enrollments</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">156</div>
                <div className="text-sm text-gray-600">Class Sessions/Week</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">85%</div>
                <div className="text-sm text-gray-600">Average Capacity</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === "courses" ? "default" : "ghost"}
          onClick={() => setActiveTab("courses")}
          className={activeTab === "courses" ? "bg-white shadow-sm" : ""}
        >
          Courses
        </Button>
        <Button
          variant={activeTab === "schedule" ? "default" : "ghost"}
          onClick={() => setActiveTab("schedule")}
          className={activeTab === "schedule" ? "bg-white shadow-sm" : ""}
        >
          Schedule Grid
        </Button>
      </div>

      {/* Courses Tab */}
      {activeTab === "courses" && (
        <>
          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {selectedDepartment}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Department</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {departments.map((dept) => (
                  <DropdownMenuItem key={dept} onClick={() => setSelectedDepartment(dept)}>
                    {dept}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <BookOpen className="h-5 w-5 text-purple-600" />
                Course Management
              </CardTitle>
              <CardDescription>Manage course offerings and enrollment</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Lecturer</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Enrollment</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{course.name}</div>
                          <div className="text-sm text-gray-600">{course.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>{course.department}</TableCell>
                      <TableCell>{course.lecturer}</TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium">{course.schedule}</div>
                          <div className="text-xs text-gray-600">{course.room}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {course.enrolled}/{course.capacity}
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
                              style={{ width: `${(course.enrolled / course.capacity) * 100}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{course.credits}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">{course.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="text-red-600">Delete Course</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {/* Schedule Tab */}
      {activeTab === "schedule" && (
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Calendar className="h-5 w-5 text-purple-600" />
              Weekly Schedule Grid
            </CardTitle>
            <CardDescription>View and manage class schedules across the week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Time</TableHead>
                    <TableHead>Monday</TableHead>
                    <TableHead>Tuesday</TableHead>
                    <TableHead>Wednesday</TableHead>
                    <TableHead>Thursday</TableHead>
                    <TableHead>Friday</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduleData.map((slot, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium bg-gray-50">{slot.time}</TableCell>
                      <TableCell>
                        {slot.monday && (
                          <div className="p-2 bg-blue-100 rounded text-xs text-blue-800 font-medium">{slot.monday}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {slot.tuesday && (
                          <div className="p-2 bg-green-100 rounded text-xs text-green-800 font-medium">
                            {slot.tuesday}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {slot.wednesday && (
                          <div className="p-2 bg-purple-100 rounded text-xs text-purple-800 font-medium">
                            {slot.wednesday}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {slot.thursday && (
                          <div className="p-2 bg-orange-100 rounded text-xs text-orange-800 font-medium">
                            {slot.thursday}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {slot.friday && (
                          <div className="p-2 bg-pink-100 rounded text-xs text-pink-800 font-medium">{slot.friday}</div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
