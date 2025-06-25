"use client"

import { useState } from "react"
import { Users, Search, Filter, Download, Plus, Edit, Trash2, Eye, Mail, Calendar, BookOpen, Award } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

const lecturersData = [
  {
    id: "LEC001",
    name: "Dr. Sarah Mitchell",
    email: "sarah.mitchell@university.edu",
    phone: "+1 (555) 123-4567",
    department: "Computer Science",
    position: "Professor",
    experience: "15 years",
    courses: 3,
    students: 120,
    status: "Active",
    joinDate: "2009-08-15",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "LEC002",
    name: "Prof. Michael Johnson",
    email: "michael.johnson@university.edu",
    phone: "+1 (555) 234-5678",
    department: "Mathematics",
    position: "Associate Professor",
    experience: "12 years",
    courses: 4,
    students: 95,
    status: "Active",
    joinDate: "2012-01-10",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "LEC003",
    name: "Dr. Emily Chen",
    email: "emily.chen@university.edu",
    phone: "+1 (555) 345-6789",
    department: "Physics",
    position: "Assistant Professor",
    experience: "8 years",
    courses: 2,
    students: 75,
    status: "Active",
    joinDate: "2016-09-01",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "LEC004",
    name: "Prof. David Wilson",
    email: "david.wilson@university.edu",
    phone: "+1 (555) 456-7890",
    department: "Engineering",
    position: "Professor",
    experience: "20 years",
    courses: 5,
    students: 150,
    status: "On Leave",
    joinDate: "2004-03-15",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "LEC005",
    name: "Dr. Lisa Anderson",
    email: "lisa.anderson@university.edu",
    phone: "+1 (555) 567-8901",
    department: "Biology",
    position: "Associate Professor",
    experience: "10 years",
    courses: 3,
    students: 85,
    status: "Active",
    joinDate: "2014-08-20",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const departmentStats = [
  { department: "Computer Science", count: 25, percentage: 28 },
  { department: "Engineering", count: 22, percentage: 25 },
  { department: "Mathematics", count: 18, percentage: 20 },
  { department: "Physics", count: 12, percentage: 14 },
  { department: "Biology", count: 11, percentage: 13 },
]

export default function AdminLecturers() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All")

  const filteredLecturers = lecturersData.filter((lecturer) => {
    const matchesSearch =
      lecturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "All" || lecturer.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lecturer Management</h1>
          <p className="text-gray-600">Manage faculty members, their courses, and academic responsibilities</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Lecturer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">156</div>
                <div className="text-sm text-gray-600">Total Lecturers</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-green-600 text-white">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">89</div>
                <div className="text-sm text-gray-600">Active Courses</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">23</div>
                <div className="text-sm text-gray-600">Professors</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">12.5</div>
                <div className="text-sm text-gray-600">Avg Experience (Years)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Department Distribution */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Department Distribution</CardTitle>
            <CardDescription>Lecturers by department</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {departmentStats.map((dept, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{dept.department}</span>
                  <span className="text-gray-600">{dept.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-400 to-violet-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${dept.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Lecturers Table */}
        <Card className="lg:col-span-3 bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Users className="h-5 w-5 text-purple-600" />
                  Faculty Records
                </CardTitle>
                <CardDescription>Manage and view all lecturer information</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search lecturers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
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
                    <DropdownMenuItem onClick={() => setSelectedDepartment("All")}>All Departments</DropdownMenuItem>
                    {departmentStats.map((dept) => (
                      <DropdownMenuItem key={dept.department} onClick={() => setSelectedDepartment(dept.department)}>
                        {dept.department}
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
                  <TableHead>Lecturer</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLecturers.map((lecturer) => (
                  <TableRow key={lecturer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={lecturer.avatar || "/placeholder.svg"} alt={lecturer.name} />
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            {lecturer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{lecturer.name}</div>
                          <div className="text-sm text-gray-600">{lecturer.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{lecturer.id}</TableCell>
                    <TableCell>{lecturer.department}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">
                        {lecturer.position}
                      </Badge>
                    </TableCell>
                    <TableCell>{lecturer.courses}</TableCell>
                    <TableCell>{lecturer.students}</TableCell>
                    <TableCell>
                      <Badge
                        variant={lecturer.status === "Active" ? "default" : "secondary"}
                        className={lecturer.status === "Active" ? "bg-green-500" : "bg-orange-500"}
                      >
                        {lecturer.status}
                      </Badge>
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
                          <Mail className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-red-600">Remove Lecturer</DropdownMenuItem>
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
    </div>
  )
}
