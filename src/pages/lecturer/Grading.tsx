import { BarChart3, FileText, CheckCircle, Clock, AlertTriangle, Eye, Edit } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

const gradingData = [
  {
    id: 1,
    student: "Sarah Johnson",
    assignment: "Binary Search Tree Implementation",
    course: "CS 301",
    submittedAt: "2024-01-16 14:30",
    status: "Pending",
    maxPoints: 100,
    currentGrade: null,
  },
  {
    id: 2,
    student: "Michael Brown",
    assignment: "Database Design Project",
    course: "CS 401",
    submittedAt: "2024-01-15 16:45",
    status: "Graded",
    maxPoints: 150,
    currentGrade: 138,
  },
  {
    id: 3,
    student: "Emily Davis",
    assignment: "Software Requirements Analysis",
    course: "CS 402",
    submittedAt: "2024-01-14 09:15",
    status: "In Review",
    maxPoints: 75,
    currentGrade: null,
  },
  {
    id: 4,
    student: "James Wilson",
    assignment: "Web Application Development",
    course: "CS 350",
    submittedAt: "2024-01-13 11:20",
    status: "Graded",
    maxPoints: 200,
    currentGrade: 185,
  },
  {
    id: 5,
    student: "Lisa Anderson",
    assignment: "Data Structures Quiz",
    course: "CS 301",
    submittedAt: "2024-01-12 10:45",
    status: "Pending",
    maxPoints: 50,
    currentGrade: null,
  },
]

const courseGrades = [
  {
    course: "CS 301",
    totalStudents: 45,
    graded: 38,
    pending: 7,
    avgGrade: 82.5,
  },
  {
    course: "CS 401",
    totalStudents: 38,
    graded: 35,
    pending: 3,
    avgGrade: 78.2,
  },
  {
    course: "CS 402",
    totalStudents: 42,
    graded: 40,
    pending: 2,
    avgGrade: 85.1,
  },
  {
    course: "CS 350",
    totalStudents: 31,
    graded: 31,
    pending: 0,
    avgGrade: 79.8,
  },
]

export default function LecturerGrading() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Graded":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Pending":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "In Review":
        return <AlertTriangle className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Graded":
        return "bg-green-500"
      case "Pending":
        return "bg-orange-500"
      case "In Review":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const totalSubmissions = gradingData.length
  const pendingGrading = gradingData.filter((g) => g.status === "Pending").length
  const gradedSubmissions = gradingData.filter((g) => g.status === "Graded").length
  const inReview = gradingData.filter((g) => g.status === "In Review").length

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grading & Results</h1>
          <p className="text-gray-600">Review submissions and manage student grades</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
          <BarChart3 className="h-4 w-4 mr-2" />
          Grade Analytics
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
                <div className="text-2xl font-bold text-gray-800">{totalSubmissions}</div>
                <div className="text-sm text-gray-600">Total Submissions</div>
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
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{gradedSubmissions}</div>
                <div className="text-sm text-gray-600">Graded</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{inReview}</div>
                <div className="text-sm text-gray-600">In Review</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Course Progress */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Course Progress</CardTitle>
            <CardDescription>Grading progress by course</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {courseGrades.map((course, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{course.course}</span>
                  <span className="text-gray-600">{Math.round((course.graded / course.totalStudents) * 100)}%</span>
                </div>
                <Progress value={(course.graded / course.totalStudents) * 100} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Graded: {course.graded}</span>
                  <span>Pending: {course.pending}</span>
                </div>
                <div className="text-xs text-blue-600 font-medium">Avg: {course.avgGrade.toFixed(1)}%</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Grading Queue */}
        <Card className="lg:col-span-3 bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Grading Queue
            </CardTitle>
            <CardDescription>Submissions requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gradingData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium text-gray-900">{item.student}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">{item.assignment}</div>
                    </TableCell>
                    <TableCell className="font-medium">{item.course}</TableCell>
                    <TableCell>{new Date(item.submittedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {item.currentGrade !== null ? (
                          <span className="font-medium">
                            {item.currentGrade}/{item.maxPoints}
                          </span>
                        ) : (
                          <span className="text-gray-500">-/{item.maxPoints}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <Badge className={`${getStatusColor(item.status)} text-white`}>{item.status}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {item.status !== "Graded" && (
                          <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                            <Edit className="h-4 w-4 mr-1" />
                            Grade
                          </Button>
                        )}
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
