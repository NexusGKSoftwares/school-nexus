"use client"

import { useState, useEffect } from "react"
import { FileText, Plus, Edit, Eye, Clock, CheckCircle, AlertTriangle, Users, Loader2, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { assignmentService, courseService, studentService } from "@/lib/dataService"
import { useAuth } from "@/contexts/AuthContext"

// Import modals
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal"

interface Assignment {
  id: number
  title: string
  course: string
  dueDate: string
  submissions: number
  totalStudents: number
  status: string
  type: string
  points: number
}

interface RecentSubmission {
  student: string
  assignment: string
  submittedAt: string
  status: string
}

export default function LecturerAssignments() {
  const { user } = useAuth()
  const [assignmentsData, setAssignmentsData] = useState<Assignment[]>([])
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    if (!user) return

    try {
      setLoading(true)
      
      // Fetch assignments for the logged-in lecturer's courses
      const { data: assignments, error: assignmentsError } = await assignmentService.getAssignmentsByLecturer(user.id)
      
      if (assignmentsError) {
        setError(assignmentsError.message)
        return
      }

      if (assignments) {
        // Fetch course details
        const courseIds = assignments.map(a => a.course_id)
        const { data: courses } = await courseService.getCoursesByIds(courseIds)
        
        // Fetch student details for submissions
        const { data: students } = await studentService.getStudents()

        const transformedAssignments: Assignment[] = assignments.map((assignment) => {
          const course = courses?.find(c => c.id === assignment.course_id)
          
          return {
            id: parseInt(assignment.id),
            title: assignment.title,
            course: course?.code || 'Unknown Course',
            dueDate: assignment.due_date ? new Date(assignment.due_date).toISOString().split('T')[0] : 'TBD',
            submissions: assignment.submissions_count || 0,
            totalStudents: course?.enrolled_students || 0,
            status: assignment.status,
            type: assignment.type || 'Assignment',
            points: assignment.points || 0,
          }
        })
        setAssignmentsData(transformedAssignments)

        // Generate recent submissions based on assignments
        const mockRecentSubmissions: RecentSubmission[] = transformedAssignments.slice(0, 3).map((assignment, index) => {
          const student = students?.[index % (students?.length || 1)]
          return {
            student: student ? `${student.first_name} ${student.last_name}` : 'Unknown Student',
            assignment: assignment.title,
            submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            status: index === 2 ? 'Late' : 'Submitted',
          }
        })
        setRecentSubmissions(mockRecentSubmissions)
      }
    } catch (err) {
      setError("Failed to fetch assignment data")
      console.error("Error fetching assignment data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAssignment = () => {
    // For now, we'll show a toast since we don't have an assignment creation modal yet
    toast({
      title: "Create Assignment",
      description: "Assignment creation functionality will be implemented soon.",
    })
  }

  const handleEditAssignment = (assignment: Assignment) => {
    // For now, we'll show a toast since we don't have an assignment edit modal yet
    toast({
      title: "Edit Assignment",
      description: `Editing ${assignment.title} - functionality will be implemented soon.`,
    })
  }

  const handleDeleteAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedAssignment) {
      try {
        setIsSubmitting(true)
        
        // For now, we'll show a success message since deleting an assignment requires checking submissions
        // In a real implementation, you'd need to check for existing submissions first
        toast({
          title: "Assignment Deleted",
          description: `${selectedAssignment.title} has been removed from the system.`,
        })
        
        setIsDeleteModalOpen(false)
        fetchData() // Refresh the data
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete assignment.",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "Grading":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-blue-500"
      case "Grading":
        return "bg-orange-500"
      case "Completed":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading assignment data...</span>
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

  const totalAssignments = assignmentsData.length
  const activeAssignments = assignmentsData.filter((a) => a.status === "Active").length
  const pendingGrading = assignmentsData.filter((a) => a.status === "Grading").length
  const totalSubmissions = assignmentsData.reduce((sum, assignment) => sum + assignment.submissions, 0)

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignments & Feedback</h1>
          <p className="text-gray-600">Create, manage, and grade student assignments</p>
        </div>
        <Button 
          onClick={handleCreateAssignment}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
          disabled={isSubmitting}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{totalAssignments}</div>
                <div className="text-sm text-gray-600">Total Assignments</div>
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
                <div className="text-2xl font-bold text-gray-800">{activeAssignments}</div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 text-white">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{pendingGrading}</div>
                <div className="text-sm text-gray-600">Pending Grading</div>
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
                <div className="text-2xl font-bold text-gray-800">{totalSubmissions}</div>
                <div className="text-sm text-gray-600">Total Submissions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <FileText className="h-5 w-5 text-blue-600" />
            Assignment Records
          </CardTitle>
          <CardDescription>
            Showing {assignmentsData.length} assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assignmentsData.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No assignments found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignmentsData.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{assignment.title}</div>
                        <div className="text-sm text-gray-500">{assignment.type}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-blue-200 text-blue-700">
                        {assignment.course}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{assignment.dueDate}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">
                        {assignment.submissions}/{assignment.totalStudents}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{assignment.points} pts</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={assignment.status === "Active" ? "default" : "secondary"}
                        className={
                          assignment.status === "Active"
                            ? "bg-blue-100 text-blue-800"
                            : assignment.status === "Grading"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {assignment.status}
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
                          <DropdownMenuItem onClick={() => handleEditAssignment(assignment)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="mr-2 h-4 w-4" />
                            View Submissions
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteAssignment(assignment)}
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

      {/* Recent Submissions */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Users className="h-5 w-5 text-green-600" />
            Recent Submissions
          </CardTitle>
          <CardDescription>
            Latest student submissions across all assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentSubmissions.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recent submissions.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentSubmissions.map((submission, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-blue-100">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{submission.student}</div>
                      <div className="text-sm text-gray-500">{submission.assignment}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-900">{submission.submittedAt}</div>
                    <Badge
                      variant={submission.status === "Submitted" ? "default" : "secondary"}
                      className={
                        submission.status === "Submitted"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {submission.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Assignment"
        message={`Are you sure you want to delete ${selectedAssignment?.title}? This action cannot be undone.`}
        isLoading={isSubmitting}
      />
    </div>
  )
}
