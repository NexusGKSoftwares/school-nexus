"use client"

import { useState } from "react"
import { Building2, Search, Plus, Edit, Trash2, Users, BookOpen, GraduationCap, Eye } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const facultiesData = [
  {
    id: "FAC001",
    name: "Faculty of Engineering",
    dean: "Dr. Robert Johnson",
    departments: 5,
    lecturers: 45,
    students: 1250,
    courses: 28,
    established: "1985",
    status: "Active",
    description: "Engineering and Technology programs",
  },
  {
    id: "FAC002",
    name: "Faculty of Science",
    dean: "Prof. Sarah Mitchell",
    departments: 4,
    lecturers: 38,
    students: 980,
    courses: 24,
    established: "1978",
    status: "Active",
    description: "Natural Sciences and Mathematics",
  },
  {
    id: "FAC003",
    name: "Faculty of Arts & Humanities",
    dean: "Dr. Michael Chen",
    departments: 6,
    lecturers: 32,
    students: 750,
    courses: 35,
    established: "1972",
    status: "Active",
    description: "Liberal Arts and Humanities programs",
  },
  {
    id: "FAC004",
    name: "Faculty of Business",
    dean: "Prof. Lisa Anderson",
    departments: 3,
    lecturers: 28,
    students: 890,
    courses: 18,
    established: "1990",
    status: "Active",
    description: "Business Administration and Management",
  },
]

const departmentsData = [
  {
    id: "DEPT001",
    name: "Computer Science",
    faculty: "Faculty of Engineering",
    head: "Dr. Emily Davis",
    lecturers: 12,
    students: 456,
    courses: 8,
    status: "Active",
  },
  {
    id: "DEPT002",
    name: "Mechanical Engineering",
    faculty: "Faculty of Engineering",
    head: "Prof. James Wilson",
    lecturers: 15,
    students: 389,
    courses: 10,
    status: "Active",
  },
  {
    id: "DEPT003",
    name: "Mathematics",
    faculty: "Faculty of Science",
    head: "Dr. Maria Rodriguez",
    lecturers: 10,
    students: 234,
    courses: 6,
    status: "Active",
  },
  {
    id: "DEPT004",
    name: "Physics",
    faculty: "Faculty of Science",
    head: "Prof. David Thompson",
    lecturers: 8,
    students: 178,
    courses: 5,
    status: "Active",
  },
  {
    id: "DEPT005",
    name: "English Literature",
    faculty: "Faculty of Arts & Humanities",
    head: "Dr. Jennifer Adams",
    lecturers: 9,
    students: 167,
    courses: 7,
    status: "Active",
  },
]

export default function AdminFaculties() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("faculties")

  const filteredFaculties = facultiesData.filter(
    (faculty) =>
      faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.dean.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredDepartments = departmentsData.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.head.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.faculty.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Faculties & Departments</h1>
          <p className="text-gray-600">Manage academic faculties and their departments</p>
        </div>
        <div className="flex items-center gap-4">
          <Button className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add {activeTab === "faculties" ? "Faculty" : "Department"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">4</div>
                <div className="text-sm text-gray-600">Total Faculties</div>
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
                <div className="text-2xl font-bold text-gray-800">18</div>
                <div className="text-sm text-gray-600">Total Departments</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">143</div>
                <div className="text-sm text-gray-600">Total Lecturers</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">3,870</div>
                <div className="text-sm text-gray-600">Total Students</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === "faculties" ? "default" : "ghost"}
          onClick={() => setActiveTab("faculties")}
          className={activeTab === "faculties" ? "bg-white shadow-sm" : ""}
        >
          Faculties
        </Button>
        <Button
          variant={activeTab === "departments" ? "default" : "ghost"}
          onClick={() => setActiveTab("departments")}
          className={activeTab === "departments" ? "bg-white shadow-sm" : ""}
        >
          Departments
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Faculties Tab */}
      {activeTab === "faculties" && (
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Building2 className="h-5 w-5 text-purple-600" />
              Faculty Management
            </CardTitle>
            <CardDescription>Manage academic faculties and their leadership</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Faculty Name</TableHead>
                  <TableHead>Dean</TableHead>
                  <TableHead>Departments</TableHead>
                  <TableHead>Lecturers</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFaculties.map((faculty) => (
                  <TableRow key={faculty.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{faculty.name}</div>
                        <div className="text-sm text-gray-600">{faculty.description}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{faculty.dean}</TableCell>
                    <TableCell>{faculty.departments}</TableCell>
                    <TableCell>{faculty.lecturers}</TableCell>
                    <TableCell>{faculty.students}</TableCell>
                    <TableCell>{faculty.courses}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">{faculty.status}</Badge>
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
                            <DropdownMenuItem className="text-red-600">Delete Faculty</DropdownMenuItem>
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
      )}

      {/* Departments Tab */}
      {activeTab === "departments" && (
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Users className="h-5 w-5 text-purple-600" />
              Department Management
            </CardTitle>
            <CardDescription>Manage academic departments and their heads</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department Name</TableHead>
                  <TableHead>Faculty</TableHead>
                  <TableHead>Department Head</TableHead>
                  <TableHead>Lecturers</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium">{dept.name}</TableCell>
                    <TableCell>{dept.faculty}</TableCell>
                    <TableCell>{dept.head}</TableCell>
                    <TableCell>{dept.lecturers}</TableCell>
                    <TableCell>{dept.students}</TableCell>
                    <TableCell>{dept.courses}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">{dept.status}</Badge>
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
                            <DropdownMenuItem className="text-red-600">Delete Department</DropdownMenuItem>
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
      )}
    </div>
  )
}
