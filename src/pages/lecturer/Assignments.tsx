import { FileText, Plus, Edit, Eye, Clock, CheckCircle, AlertTriangle, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const assignmentsData = [
  {
    id: 1,
    title: "Binary Search Tree Implementation",
    course: "CS 301",
    dueDate: "2024-01-20",
    submissions: 42,
    totalStudents: 45,
    status: "Active",
    type: "Programming",
    points: 100,
  },
  {
    id: 2,
    title: "Database Design Project",
    course: "CS 401",
    dueDate: "2024-01-25",
    submissions: 28,
    totalStudents: 38,
    status: "Active",
    type: "Project",
    points: 150,
  },
  {
    id: 3,
    title: "Software Requirements Analysis",
    course: "CS 402",
    dueDate: "2024-01-18",
    submissions: 40,
    totalStudents: 42,
    status: "Grading",
    type: "Report",
    points: 75,
  },
  {
    id: 4,
    title: "Web Application Development",
    course: "CS 350",
    dueDate: "2024-01-15",
    submissions: 31,
    totalStudents: 31,
    status: "Completed",
    type: "Project",
    points: 200,
  },
]

const recentSubmissions = [
  {
    student: "Sarah Johnson",
    assignment: "Binary Search Tree Implementation",
    submittedAt: "2024-01-16 14:30",
    status: "Submitted",
  },
  {
    student: "Michael Brown",
    assignment: "Database Design Project",
    submittedAt: "2024-01-16 16:45",
    status: "Submitted",
  },
  {
    student: "Emily Davis",
    assignment: "Software Requirements Analysis",
    submittedAt: "2024-01-16 09:15",
    status: "Late",
  },
]

export default function LecturerAssignments() {
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
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
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
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-400 to-red-600 text-white">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{pendingGrading}</div>
                <div className="text-sm text-gray-600">Pending Grading</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Assignments Table */}
        <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <FileText className="h-5 w-5 text-blue-600" />
              Assignment Management
            </CardTitle>
            <CardDescription>Overview of all assignments across your courses</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignmentsData.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{assignment.title}</div>
                        <div className="text-sm text-gray-600">
                          {assignment.type} • {assignment.points} pts
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{assignment.course}</TableCell>
                    <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>
                          {assignment.submissions}/{assignment.totalStudents}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(assignment.status)}
                        <Badge className={`${getStatusColor(assignment.status)} text-white`}>{assignment.status}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Submissions */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Recent Submissions
            </CardTitle>
            <CardDescription>Latest student submissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentSubmissions.map((submission, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100"
              >
                <div className="space-y-2">
                  <div className="font-semibold text-gray-800">{submission.student}</div>
                  <div className="text-sm text-gray-600">{submission.assignment}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{submission.submittedAt}</span>
                    <Badge
                      variant={submission.status === "Submitted" ? "default" : "secondary"}
                      className={submission.status === "Submitted" ? "bg-green-500" : "bg-orange-500"}
                    >
                      {submission.status}
                    </Badge>
                  </div>
                  <Button size="sm" className="w-full mt-2">
                    Review Submission
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
