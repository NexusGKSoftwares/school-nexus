"use client"

import { useState, useEffect } from "react"
import { UserCheck, Search, Filter, CheckCircle, XCircle, Clock, Eye, Mail, Loader2, Plus, Edit, Trash2 } from "lucide-react"

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
import { registrationService, studentService, courseService } from "@/lib/dataService"
import { RegistrationModal } from "@/components/modals/RegistrationModal"
import  DeleteConfirmModal  from "@/components/modals/DeleteConfirmModal"
import { useToast } from "@/hooks/use-toast"

interface Registration {
  id: string
  studentName: string
  studentId: string
  email: string
  course: string
  courseCode: string
  semester: string
  credits: number
  requestDate: string
  status: string
  priority: string
  reason: string
  avatar: string
}

export default function AdminRegistrations() {
  const [registrationData, setRegistrationData] = useState<Registration[]>([])
  const [students, setStudents] = useState<Array<{ id: string; name: string; email: string }>>([])
  const [courses, setCourses] = useState<Array<{ id: string; name: string; code: string }>>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Modal states
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch registrations
      const { data: registrations, error: registrationsError } = await registrationService.getRegistrations()
      
      if (registrationsError) {
        setError(registrationsError.message)
        return
      }

      // Fetch students for additional data
      const { data: studentsData } = await studentService.getStudents()
      
      // Fetch courses for additional data
      const { data: coursesData } = await courseService.getCourses()

      // Transform students data for modal
      if (studentsData) {
        const transformedStudents = studentsData.map(student => ({
          id: student.id,
          name: `${student.first_name} ${student.last_name}`,
          email: student.email
        }))
        setStudents(transformedStudents)
      }

      // Transform courses data for modal
      if (coursesData) {
        const transformedCourses = coursesData.map(course => ({
          id: course.id,
          name: course.name,
          code: course.code
        }))
        setCourses(transformedCourses)
      }

      if (registrations) {
        const transformedRegistrations: Registration[] = registrations.map((reg) => {
          const student = studentsData?.find(s => s.id === reg.student_id)
          const course = coursesData?.find(c => c.id === reg.course_id)
          
          return {
            id: reg.id,
            studentName: student ? `${student.first_name} ${student.last_name}` : "Unknown Student",
            studentId: student?.student_id || "N/A",
            email: student?.email || "N/A",
            course: course?.name || "Unknown Course",
            courseCode: course?.code || "N/A",
            semester: reg.semester || "Current",
            credits: course?.credits || 0,
            requestDate: reg.created_at ? new Date(reg.created_at).toISOString().split('T')[0] : "N/A",
            status: reg.status,
            priority: reg.priority || "Medium",
            reason: reg.reason || "Course registration",
            avatar: student?.avatar_url || "/placeholder.svg?height=40&width=40",
          }
        })
        setRegistrationData(transformedRegistrations)
      }
    } catch (err) {
      setError("Failed to fetch registration data")
      console.error("Error fetching registration data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRegistration = () => {
    setSelectedRegistration(null)
    setIsRegistrationModalOpen(true)
  }

  const handleEditRegistration = (registration: Registration) => {
    // Find the original registration data
    const originalData = registrationData.find(r => r.id === registration.id)
    if (originalData) {
      setSelectedRegistration({
        id: registration.id,
        student_id: students.find(s => s.name === registration.studentName)?.id || '',
        course_id: courses.find(c => c.name === registration.course)?.id || '',
        registration_date: new Date(registration.requestDate),
        status: registration.status.toLowerCase(),
        semester: registration.semester,
        academic_year: new Date().getFullYear().toString(),
        notes: registration.reason
      })
      setIsRegistrationModalOpen(true)
    }
  }

  const handleDeleteRegistration = (registration: Registration) => {
    setSelectedRegistration(registration)
    setIsDeleteModalOpen(true)
  }

  const handleSaveRegistration = async (data: any) => {
    try {
      setIsSubmitting(true)
      
      if (selectedRegistration) {
        // Update existing registration
        const { error } = await registrationService.updateRegistration(selectedRegistration.id, data)
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
          })
          return
        }
        toast({
          title: "Success",
          description: "Registration updated successfully"
        })
      } else {
        // Create new registration
        const { error } = await registrationService.createRegistration(data)
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
          })
          return
        }
        toast({
          title: "Success",
          description: "Registration created successfully"
        })
      }
      
      setIsRegistrationModalOpen(false)
      fetchData()
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save registration",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedRegistration) return
    
    try {
      setIsSubmitting(true)
      const { error } = await registrationService.deleteRegistration(selectedRegistration.id)
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        })
        return
      }
      
      toast({
        title: "Success",
        description: "Registration deleted successfully"
      })
      
      setIsDeleteModalOpen(false)
      fetchData()
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete registration",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const statusOptions = ["All", "Pending", "Approved", "Rejected"]

  const filteredRegistrations = registrationData.filter((registration) => {
    const matchesSearch =
      registration.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "All" || registration.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-orange-500"
      case "Approved":
        return "bg-green-500"
      case "Rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "border-red-300 text-red-700 bg-red-50"
      case "Medium":
        return "border-orange-300 text-orange-700 bg-orange-50"
      case "Low":
        return "border-green-300 text-green-700 bg-green-50"
      default:
        return "border-gray-300 text-gray-700 bg-gray-50"
    }
  }

  const pendingCount = registrationData.filter((r) => r.status === "Pending").length
  const approvedCount = registrationData.filter((r) => r.status === "Approved").length
  const rejectedCount = registrationData.filter((r) => r.status === "Rejected").length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading registration data...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchData}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Registration Approvals</h1>
          <p className="text-gray-600">Review and approve student course registration requests</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleCreateRegistration} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Registration
          </Button>
          <Badge className="bg-orange-500 text-white px-3 py-1">{pendingCount} Pending Approvals</Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{pendingCount}</div>
                <div className="text-sm text-gray-600">Pending Requests</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-green-600 text-white">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{approvedCount}</div>
                <div className="text-sm text-gray-600">Approved</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-400 to-red-600 text-white">
                <XCircle className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{rejectedCount}</div>
                <div className="text-sm text-gray-600">Rejected</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{registrationData.length}</div>
                <div className="text-sm text-gray-600">Total Requests</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search registrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-blue-200 focus:border-blue-400"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
                  <Filter className="h-4 w-4 mr-2" />
                  {selectedStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {statusOptions.map((status) => (
                  <DropdownMenuItem key={status} onClick={() => setSelectedStatus(status)}>
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Registrations Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <UserCheck className="h-5 w-5 text-blue-600" />
            Registration Requests
          </CardTitle>
          <CardDescription>Review and manage course registration requests</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRegistrations.length === 0 ? (
            <div className="text-center py-8">
              <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No registration requests found matching your criteria.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={registration.avatar} alt={registration.studentName} />
                          <AvatarFallback>{registration.studentName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{registration.studentName}</div>
                          <div className="text-sm text-gray-600">{registration.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{registration.course}</div>
                        <div className="text-sm text-gray-600">{registration.courseCode}</div>
                      </div>
                    </TableCell>
                    <TableCell>{registration.semester}</TableCell>
                    <TableCell>{registration.credits}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getPriorityColor(registration.priority)}>
                        {registration.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(registration.status)}>
                        {registration.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{registration.requestDate}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditRegistration(registration)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Registration
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Contact Student
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {registration.status === "Pending" && (
                            <>
                              <DropdownMenuItem className="text-green-600">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteRegistration(registration)}
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
      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        onSave={handleSaveRegistration}
        registration={selectedRegistration}
        students={students}
        courses={courses}
        isLoading={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Registration"
        description={`Are you sure you want to delete the registration for ${selectedRegistration?.studentName || 'this student'}? This action cannot be undone.`}
        isLoading={isSubmitting}
      />
    </div>
  )
}
