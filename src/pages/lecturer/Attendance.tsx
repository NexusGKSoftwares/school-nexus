"use client"

import { UserCheck, Users, Download, Filter, Search, Check, X, Clock } from "lucide-react"
import { useState } from "react"
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

const attendanceData = [
  {
    id: "STU001",
    name: "Sarah Johnson",
    course: "CS 301",
    date: "2024-01-15",
    status: "Present",
    time: "10:00 AM",
  },
  {
    id: "STU002",
    name: "Michael Brown",
    course: "CS 301",
    date: "2024-01-15",
    status: "Absent",
    time: "10:00 AM",
  },
  {
    id: "STU003",
    name: "Emily Davis",
    course: "CS 301",
    date: "2024-01-15",
    status: "Late",
    time: "10:15 AM",
  },
  {
    id: "STU004",
    name: "James Wilson",
    course: "CS 401",
    date: "2024-01-15",
    status: "Present",
    time: "2:00 PM",
  },
  {
    id: "STU005",
    name: "Lisa Anderson",
    course: "CS 401",
    date: "2024-01-15",
    status: "Present",
    time: "2:00 PM",
  },
]

const courseStats = [
  { course: "CS 301", present: 42, absent: 3, late: 2, total: 47 },
  { course: "CS 401", present: 35, absent: 2, late: 1, total: 38 },
  { course: "CS 402", present: 40, absent: 1, late: 1, total: 42 },
  { course: "CS 350", present: 29, absent: 2, late: 0, total: 31 },
]

export default function LecturerAttendance() {
  const [selectedCourse, setSelectedCourse] = useState("All Courses")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAttendance = attendanceData.filter((record) => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse = selectedCourse === "All Courses" || record.course === selectedCourse
    return matchesSearch && matchesCourse
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Present":
        return <Check className="h-4 w-4 text-green-600" />
      case "Absent":
        return <X className="h-4 w-4 text-red-600" />
      case "Late":
        return <Clock className="h-4 w-4 text-orange-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "bg-green-500"
      case "Absent":
        return "bg-red-500"
      case "Late":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600">Track and manage student attendance for your courses</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
            <UserCheck className="h-4 w-4 mr-2" />
            Take Attendance
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-green-600 text-white">
                <Check className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {courseStats.reduce((sum, course) => sum + course.present, 0)}
                </div>
                <div className="text-sm text-gray-600">Present Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-400 to-red-600 text-white">
                <X className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {courseStats.reduce((sum, course) => sum + course.absent, 0)}
                </div>
                <div className="text-sm text-gray-600">Absent Today</div>
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
                <div className="text-2xl font-bold text-gray-800">
                  {courseStats.reduce((sum, course) => sum + course.late, 0)}
                </div>
                <div className="text-sm text-gray-600">Late Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {Math.round(
                    (courseStats.reduce((sum, course) => sum + course.present, 0) /
                      courseStats.reduce((sum, course) => sum + course.total, 0)) *
                      100,
                  )}
                  %
                </div>
                <div className="text-sm text-gray-600">Attendance Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Course Statistics */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Course Statistics</CardTitle>
            <CardDescription>Attendance by course</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {courseStats.map((course, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{course.course}</span>
                  <span className="text-gray-600">{Math.round((course.present / course.total) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(course.present / course.total) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Present: {course.present}</span>
                  <span>Total: {course.total}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Attendance Records */}
        <Card className="lg:col-span-3 bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                  Attendance Records
                </CardTitle>
                <CardDescription>Today's attendance for all courses</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      {selectedCourse}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by Course</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSelectedCourse("All Courses")}>All Courses</DropdownMenuItem>
                    {courseStats.map((course) => (
                      <DropdownMenuItem key={course.course} onClick={() => setSelectedCourse(course.course)}>
                        {course.course}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.map((record) => (
                  <TableRow key={`${record.id}-${record.date}`}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{record.name}</div>
                        <div className="text-sm text-gray-600">{record.id}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{record.course}</TableCell>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>{record.time}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <Badge className={`${getStatusColor(record.status)} text-white`}>{record.status}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            Update
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Mark Present</DropdownMenuItem>
                          <DropdownMenuItem>Mark Absent</DropdownMenuItem>
                          <DropdownMenuItem>Mark Late</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
