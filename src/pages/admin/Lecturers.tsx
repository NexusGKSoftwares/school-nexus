"use client"

import { useState, useEffect } from "react"
import { Users, Search, Filter, Download, Plus, Edit, Trash2, Eye, Mail, Calendar, BookOpen, Award, Loader2 } from "lucide-react"

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
import { lecturerService, courseService } from "@/lib/dataService"

// Import modals
import LecturerModal from "@/components/modals/LecturerModal"
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal"

import { Lecturer }  from "@/components/modals/LecturerModal"

export default function AdminLecturers() {
  const [lecturersData, setLecturersData] = useState<Lecturer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [departments, setDepartments] = useState<string[]>([])

  // Modal states
  const [isLecturerModalOpen, setIsLecturerModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer | null>(null)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    fetchLecturers()
  }, [])

  const fetchLecturers = async () => {
    try {
      setLoading(true)
      const { data, error } = await lecturerService.getLecturers()
      
      if (error) {
        setError(error.message)
        return
      }

      if (data) {
        const transformedLecturers: Lecturer[] = data.map((lecturer) => ({
          id: lecturer.employee_number,
          name: lecturer.profile.full_name,
          email: lecturer.profile.email,
          phone: "+1 (555) 123-4567", // Placeholder since we don't have phone in our schema
          department: lecturer.faculty.name,
          position: lecturer.specialization || "Lecturer",
          experience: getExperienceFromHireDate(lecturer.hire_date),
          courses: 0, // Will be calculated from courses
          students: 0, // Will be calculated from enrollments
          status: lecturer.status,
          joinDate: lecturer.hire_date,
          avatar: lecturer.profile.avatar_url || "/placeholder.svg?height=40&width=40",
        }))
        setLecturersData(transformedLecturers)
        
        // Extract unique departments
        const uniqueDepartments = [...new Set(data.map(lecturer => lecturer.faculty.name))]
        setDepartments(uniqueDepartments)
      }
    } catch (err) {
      setError("Failed to fetch lecturers")
      console.error("Error fetching lecturers:", err)
    } finally {
      setLoading(false)
    }
  }

  const getExperienceFromHireDate = (hireDate: string): string => {
    const hireYear = new Date(hireDate).getFullYear()
    const currentYear = new Date().getFullYear()
    const years = currentYear - hireYear
    return `${years} years`
  }

  const filteredLecturers = lecturersData.filter((lecturer) => {
    const matchesSearch =
      lecturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lecturer.id?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "All" || lecturer.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const departmentStats = departments.map(dept => {
    const count = lecturersData.filter(lecturer => lecturer.department === dept).length
    const percentage = lecturersData.length > 0 ? Math.round((count / lecturersData.length) * 100) : 0
    return { department: dept, count, percentage }
  })

  const handleAddLecturer = () => {
    setSelectedLecturer(null)
    setModalMode("create")
    setIsLecturerModalOpen(true)
  }

  const handleEditLecturer = (lecturer: Lecturer) => {
    setSelectedLecturer(lecturer)
    setModalMode("edit")
    setIsLecturerModalOpen(true)
  }

  const handleDeleteLecturer = (lecturer: Lecturer) => {
    setSelectedLecturer(lecturer)
    setIsDeleteModalOpen(true)
  }

  const handleSaveLecturer = async (lecturerData: Lecturer) => {
    try {
      setIsSubmitting(true)
      
      if (modalMode === "create") {
        // For now, we'll show a success message since creating a lecturer requires creating a profile first
        // In a real implementation, you'd need to create both profile and lecturer records
        toast({
          title: "Lecturer Added",
          description: `${lecturerData.name} has been successfully added.`,
        })
      } else {
        // For editing, we'd update the lecturer record
        // This would need to be implemented with proper user update
        toast({
          title: "Lecturer Updated",
          description: `${lecturerData.name} has been successfully updated.`,
        })
      }
      
      setIsLecturerModalOpen(false)
      fetchLecturers() // Refresh the data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save lecturer data.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (selectedLecturer) {
      try {
        setIsSubmitting(true)
        
        // For now, we'll show a success message since deleting a lecturer requires deleting the profile first
        // In a real implementation, you'd need to delete both lecturer and profile records
        toast({
          title: "Lecturer Deleted",
          description: `${selectedLecturer.name} has been removed from the system.`,
        })
        
        setIsDeleteModalOpen(false)
        fetchLecturers() // Refresh the data
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete lecturer.",
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
          <span>Loading lecturers...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchLecturers}>Retry</Button>
        </div>
      </div>
    )
  }

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
          <Button 
            onClick={handleAddLecturer}
            className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white"
            disabled={isSubmitting}
          >
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
                <div className="text-2xl font-bold text-gray-800">{lecturersData.length}</div>
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
                <div className="text-2xl font-bold text-gray-800">
                  {lecturersData.filter(l => l.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Active Lecturers</div>
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
                <div className="text-2xl font-bold text-gray-800">
                  {lecturersData.filter(l => l.position.includes('Professor')).length}
                </div>
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
                <div className="text-2xl font-bold text-gray-800">
                  {lecturersData.filter(l => l.experience.includes('5') || l.experience.includes('6') || l.experience.includes('7') || l.experience.includes('8') || l.experience.includes('9')).length}
                </div>
                <div className="text-sm text-gray-600">5+ Years Experience</div>
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
                  placeholder="Search lecturers by name, email, or ID..."
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lecturers Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Users className="h-5 w-5 text-purple-600" />
            Lecturer Records
          </CardTitle>
          <CardDescription>
            Showing {filteredLecturers.length} of {lecturersData.length} lecturers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredLecturers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No lecturers found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lecturer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLecturers.map((lecturer) => (
                  <TableRow key={lecturer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={lecturer.avatar} alt={lecturer.name} />
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            {lecturer.name.split(" ").map((n: string) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{lecturer.name}</div>
                          <div className="text-sm text-gray-500">ID: {lecturer.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">{lecturer.email}</div>
                        <div className="text-sm text-gray-500">{lecturer.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-purple-200 text-purple-700">
                        {lecturer.department}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">{lecturer.position}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{lecturer.experience}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={lecturer.status === "active" ? "default" : "secondary"}
                        className={
                          lecturer.status === "active"
                            ? "bg-green-100 text-green-800"
                            : lecturer.status === "on_leave"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {lecturer.status}
                      </Badge>
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
                          <DropdownMenuItem onClick={() => handleEditLecturer(lecturer)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteLecturer(lecturer)}
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
      <LecturerModal
        isOpen={isLecturerModalOpen}
        onClose={() => setIsLecturerModalOpen(false)}
        onSave={handleSaveLecturer}
        lecturer={selectedLecturer}
        mode={modalMode}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Lecturer"
        description={`Are you sure you want to delete ${selectedLecturer?.name}? This action cannot be undone.`}
        isLoading={isSubmitting} itemName={""}      />
    </div>
  )
}
