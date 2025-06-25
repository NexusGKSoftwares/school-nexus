"use client"

import { useState } from "react"
import { ClipboardCheck, Search, Filter, Plus, Edit, Trash2, Eye, Users } from "lucide-react"

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

const examsData = [
  {
    id: "EXM001",
    title: "Midterm Exam - CS 301",
    course: "CS 301",
    date: "2024-10-15",
    time: "10:00 AM",
    duration: "2 hours",
    questions: 50,
    totalStudents: 45,
    status: "Scheduled",
  },
  {
    id: "EXM002",
    title: "Final Exam - MATH 201",
    course: "MATH 201",
    date: "2024-12-10",
    time: "2:00 PM",
    duration: "3 hours",
    questions: 75,
    totalStudents: 38,
    status: "Grading",
  },
  {
    id: "EXM003",
    title: "Quiz 1 - ENG 101",
    course: "ENG 101",
    date: "2024-09-20",
    time: "11:00 AM",
    duration: "1 hour",
    questions: 25,
    totalStudents: 40,
    status: "Completed",
  },
  {
    id: "EXM004",
    title: "Midterm Exam - PHY 301",
    course: "PHY 301",
    date: "2024-10-18",
    time: "9:00 AM",
    duration: "2.5 hours",
    questions: 60,
    totalStudents: 32,
    status: "Scheduled",
  },
]

const courseList = ["All Courses", "CS 301", "MATH 201", "ENG 101", "PHY 301"]

export default function AdminExams() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("All Courses")

  const filteredExams = examsData.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.course.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse = selectedCourse === "All Courses" || exam.course === selectedCourse
    return matchesSearch && matchesCourse
  })

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exams & Results Management</h1>
          <p className="text-gray-600">Manage exam schedules, grading, and student results</p>
        </div>
        <div className="flex items-center gap-4">
          <Button className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Exam
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search exams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
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
            {courseList.map((course) => (
              <DropdownMenuItem key={course} onClick={() => setSelectedCourse(course)}>
                {course}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Exams Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <ClipboardCheck className="h-5 w-5 text-purple-600" />
            Exam Schedule
          </CardTitle>
          <CardDescription>Manage and view all scheduled exams</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{exam.title}</div>
                      <div className="text-sm text-gray-600">{exam.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>{exam.course}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{exam.date}</div>
                      <div className="text-sm text-gray-600">{exam.time}</div>
                    </div>
                  </TableCell>
                  <TableCell>{exam.duration}</TableCell>
                  <TableCell>{exam.questions}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{exam.totalStudents}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-500">{exam.status}</Badge>
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
                          <DropdownMenuItem className="text-red-600">Delete Exam</DropdownMenuItem>
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
    </div>
  )
}
