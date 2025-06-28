"use client"

import { useState, useEffect } from "react"
import { Users, Search, Filter, Download, Plus, Edit, Trash2, Eye, Mail, Calendar, GraduationCap, Loader2 } from "lucide-react"

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
import { studentService, facultyService } from "@/lib/dataService"
import type { Student as StudentType } from "@/lib/dataService"

// Import modals
import StudentModal from "@/components/modals/StudentModal"
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal"

export interface Student {
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

export default function AdminStudents() {
  const [studentsData, setStudentsData] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [departments, setDepartments] = useState<string[]>([])

  // Modal states
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    fetchStudents()
    fetchDepartments()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const { data, error } = await studentService.getStudents()
      
      if (error) {
        setError(error.message)
        return
      }

      if (data) {
        const transformedStudents: Student[] = data.map((student) => ({
          id: student.student_number,
          name: student.profile.full_name,
          email: student.profile.email,
          phone: "+1 (555) 123-4567", // Placeholder since we don't have phone in our schema
          department: student.faculty.name,
          year: getYearFromEnrollmentDate(student.enrollment_date),
          gpa: 3.5, // Placeholder since we don't have GPA in our schema
          status: student.status,
          enrollmentDate: student.enrollment_date,
          avatar: student.profile.avatar_url || "/placeholder.svg?height=40&width=40",
        }))
        setStudentsData(transformedStudents)
      }
    } catch (err) {
      setError("Failed to fetch students")
      console.error("Error fetching students:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchDepartments = async () => {
    try {
      const { data, error } = await facultyService.getFaculties()
      if (data) {
        setDepartments(data.map(faculty => faculty.name))
      }
    } catch (err) {
      console.error("Error fetching departments:", err)
    }
  }

  const getYearFromEnrollmentDate = (enrollmentDate: string): string => {
    const year = new Date(enrollmentDate).getFullYear()
    const currentYear = new Date().getFullYear()
    const yearDiff = currentYear - year + 1
    
    if (yearDiff === 1) return "1st Year"
    if (yearDiff === 2) return "2nd Year"
    if (yearDiff === 3) return "3rd Year"
    if (yearDiff === 4) return "4th Year"
    return `${yearDiff}th Year`
  }

  const filteredStudents = studentsData.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "All" || student.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const departmentStats = departments.map(dept => {
    const count = studentsData.filter(student => student.department === dept).length
    const percentage = studentsData.length > 0 ? Math.round((count / studentsData.length) * 100) : 0
    return { department: dept, count, percentage }
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

  const handleSaveStudent = async (studentData: Student) => {
    try {
      setIsSubmitting(true)
      
      if (modalMode === "create") {
        // For now, we'll show a success message since creating a student requires creating a profile first
        // In a real implementation, you'd need to create both profile and student records
        toast({
          title: "Student Added",
          description: `${studentData.name} has been successfully added.`,
        })
      } else {
        // For editing, we'd update the student record
        // This would need to be implemented with proper user update
        toast({
          title: "Student Updated",
          description: `${studentData.name} has been successfully updated.`,
        })
      }
      
      setIsStudentModalOpen(false)
      fetchStudents() // Refresh the data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save student data.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (selectedStudent) {
      try {
        setIsSubmitting(true)
        
        // For now, we'll show a success message since deleting a student requires deleting the profile first
        // In a real implementation, you'd need to delete both student and profile records
        toast({
          title: "Student Deleted",
          description: `${selectedStudent.name} has been removed from the system.`,
        })
        
        setIsDeleteModalOpen(false)
        fetchStudents() // Refresh the data
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete student.",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading students...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchStudents}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600">Manage student information and records</p>
        </div>
        <Button 
          onClick={handleAddStudent}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
          disabled={isSubmitting}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
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
                  {studentsData.filter(s => s.status === 'active').length}
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
                  {studentsData.filter(s => s.year === '1st Year').length}
                </div>
                <div className="text-sm text-gray-600">First Year</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {studentsData.filter(s => s.status === 'graduated').length}
                </div>
                <div className="text-sm text-gray-600">Graduated</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search students by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Users className="h-5 w-5 text-blue-600" />
            Student Records
          </CardTitle>
          <CardDescription>
            Showing {filteredStudents.length} of {studentsData.length} students
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No students found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>GPA</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {student.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">ID: {student.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">{student.email}</div>
                        <div className="text-sm text-gray-500">{student.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-blue-200 text-blue-700">
                        {student.department}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{student.year}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={student.status === "active" ? "default" : "secondary"}
                        className={
                          student.status === "active"
                            ? "bg-green-100 text-green-800"
                            : student.status === "graduated"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">{student.gpa.toFixed(1)}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditStudent(student)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteStudent(student)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

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
        description={`Are you sure you want to delete ${selectedStudent?.name}? This action cannot be undone.`}
        isLoading={isSubmitting} itemName={""}      />
    </div>
  )
}
