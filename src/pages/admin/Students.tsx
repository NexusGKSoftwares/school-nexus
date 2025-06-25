"use client"

import { useState } from "react"
import { Users, Search, Filter, Download, Plus, Edit, Trash2, Eye, Mail, Calendar, GraduationCap } from "lucide-react"

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
import { useToast } from "@/hooks/use-toast"

// Import modals
import StudentModal from "@/components/modals/StudentModal"
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal"

interface Student {
  id: string
  name: string
  email: string
  phone: string
  department: string
  year: string
  gpa: number
  status: string
  enrollmentDate: string
  avatar?: string
}

const initialStudentsData: Student[] = [
  {
    id: "STU001",
    name: "Sarah Johnson",
    email: "sarah.johnson@student.edu",
    phone: "+1 (555) 123-4567",
    department: "Computer Science",
    year: "3rd Year",
    gpa: 3.8,
    status: "Active",
    enrollmentDate: "2022-09-01",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "STU002",
    name: "Michael Brown",
    email: "michael.brown@student.edu",
    phone: "+1 (555) 234-5678",
    department: "Mathematics",
    year: "2nd Year",
    gpa: 3.6,
    status: "Active",
    enrollmentDate: "2023-09-01",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "STU003",
    name: "Emily Davis",
    email: "emily.davis@student.edu",
    phone: "+1 (555) 345-6789",
    department: "Physics",
    year: "4th Year",
    gpa: 3.9,
    status: "Active",
    enrollmentDate: "2021-09-01",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "STU004",
    name: "James Wilson",
    email: "james.wilson@student.edu",
    phone: "+1 (555) 456-7890",
    department: "Engineering",
    year: "1st Year",
    gpa: 3.4,
    status: "Probation",
    enrollmentDate: "2024-09-01",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "STU005",
    name: "Lisa Anderson",
    email: "lisa.anderson@student.edu",
    phone: "+1 (555) 567-8901",
    department: "Biology",
    year: "3rd Year",
    gpa: 3.7,
    status: "Active",
    enrollmentDate: "2022-09-01",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const departmentStats = [
  { department: "Computer Science", count: 456, percentage: 32 },
  { department: "Engineering", count: 389, percentage: 27 },
  { department: "Mathematics", count: 234, percentage: 16 },
  { department: "Physics", count: 178, percentage: 13 },
  { department: "Biology", count: 167, percentage: 12 },
]

export default function AdminStudents() {
  const [studentsData, setStudentsData] = useState<Student[]>(initialStudentsData)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All")

  // Modal states
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")

  const { toast } = useToast()

  const filteredStudents = studentsData.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "All" || student.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const handleAddStudent = () => {
    setSelectedStudent(null)
    setModalMode("create")
    setIsStudentModalOpen(true)
  }

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student)
    setModalMode("edit")
    setIsStudentModalOpen(true)
  }

  const handleDeleteStudent = (student: Student) => {
    setSelectedStudent(student)
    setIsDeleteModalOpen(true)
  }

  const handleSaveStudent = (studentData: Student) => {
    if (modalMode === "create") {
      const newStudent = {
        ...studentData,
        id: `STU${String(studentsData.length + 1).padStart(3, "0")}`,
      }
      setStudentsData((prev) => [...prev, newStudent])
      toast({
        title: "Student Added",
        description: `${studentData.name} has been successfully added.`,
      })
    } else {
      setStudentsData((prev) =>
        prev.map((student) =>
          student.id === selectedStudent?.id ? { ...studentData, id: selectedStudent.id } : student,
        ),
      )
      toast({
        title: "Student Updated",
        description: `${studentData.name} has been successfully updated.`,
      })
    }
  }

  const handleConfirmDelete = () => {
    if (selectedStudent) {
      setStudentsData((prev) => prev.filter((student) => student.id !== selectedStudent.id))
      toast({
        title: "Student Deleted",
        description: `${selectedStudent.name} has been removed from the system.`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600">Manage student records, enrollment, and academic information</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={handleAddStudent}
            className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Student
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
                <div className="text-2xl font-bold text-gray-800">{studentsData.length}</div>
                <div className="text-sm text-gray-600">Total Students</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-green-600 text-white">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {studentsData.filter((s) => s.status === "Active").length}
                </div>
                <div className="text-sm text-gray-600">Active Students</div>
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
                <div className="text-2xl font-bold text-gray-800">
                  {studentsData.filter((s) => s.status === "Probation").length}
                </div>
                <div className="text-sm text-gray-600">On Probation</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {(studentsData.reduce((sum, s) => sum + s.gpa, 0) / studentsData.length).toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Average GPA</div>
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
            <CardDescription>Students by department</CardDescription>
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

        {/* Students Table */}
        <Card className="lg:col-span-3 bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Users className="h-5 w-5 text-purple-600" />
                  Student Records
                </CardTitle>
                <CardDescription>Manage and view all student information</CardDescription>
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
                  <TableHead>Student</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>GPA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-600">{student.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{student.id}</TableCell>
                    <TableCell>{student.department}</TableCell>
                    <TableCell>{student.year}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          student.gpa >= 3.7
                            ? "border-green-300 text-green-700 bg-green-50"
                            : student.gpa >= 3.0
                              ? "border-blue-300 text-blue-700 bg-blue-50"
                              : "border-orange-300 text-orange-700 bg-orange-50"
                        }
                      >
                        {student.gpa}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={student.status === "Active" ? "default" : "secondary"}
                        className={student.status === "Active" ? "bg-green-500" : "bg-orange-500"}
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditStudent(student)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteStudent(student)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSave={handleSaveStudent}
        student={selectedStudent}
        mode={modalMode}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Student"
        description="Are you sure you want to delete this student? This will remove all their records and cannot be undone."
        itemName={selectedStudent?.name || ""}
      />
    </div>
  )
}
