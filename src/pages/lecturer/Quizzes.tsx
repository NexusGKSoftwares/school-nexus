import { ClipboardCheck, Plus, Edit, Eye, Play, BarChart3, Users, Clock, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const quizzesData = [
  {
    id: 1,
    title: "Data Structures Fundamentals",
    course: "CS 301",
    questions: 15,
    duration: 30,
    attempts: 42,
    totalStudents: 45,
    status: "Active",
    avgScore: 78,
    dueDate: "2024-01-22",
  },
  {
    id: 2,
    title: "SQL Basics Quiz",
    course: "CS 401",
    questions: 20,
    duration: 45,
    attempts: 35,
    totalStudents: 38,
    status: "Active",
    avgScore: 82,
    dueDate: "2024-01-24",
  },
  {
    id: 3,
    title: "Software Testing Methods",
    course: "CS 402",
    questions: 12,
    duration: 25,
    attempts: 40,
    totalStudents: 42,
    status: "Completed",
    avgScore: 75,
    dueDate: "2024-01-18",
  },
  {
    id: 4,
    title: "HTML & CSS Fundamentals",
    course: "CS 350",
    questions: 18,
    duration: 35,
    attempts: 28,
    totalStudents: 31,
    status: "Draft",
    avgScore: 0,
    dueDate: "2024-01-26",
  },
]

const recentAttempts = [
  {
    student: "Sarah Johnson",
    quiz: "Data Structures Fundamentals",
    score: 85,
    completedAt: "2024-01-16 15:30",
    duration: "28 min",
  },
  {
    student: "Michael Brown",
    quiz: "SQL Basics Quiz",
    score: 92,
    completedAt: "2024-01-16 14:15",
    duration: "42 min",
  },
  {
    student: "Emily Davis",
    quiz: "Software Testing Methods",
    score: 78,
    completedAt: "2024-01-16 11:45",
    duration: "23 min",
  },
]

export default function LecturerQuizzes() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <Play className="h-4 w-4 text-green-600" />
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "Draft":
        return <Edit className="h-4 w-4 text-orange-600" />
      default:
        return <ClipboardCheck className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500"
      case "Completed":
        return "bg-blue-500"
      case "Draft":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const totalQuizzes = quizzesData.length
  const activeQuizzes = quizzesData.filter((q) => q.status === "Active").length
  const totalAttempts = quizzesData.reduce((sum, quiz) => sum + quiz.attempts, 0)
  const avgScore = Math.round(
    quizzesData.filter((q) => q.status !== "Draft").reduce((sum, quiz) => sum + quiz.avgScore, 0) /
      quizzesData.filter((q) => q.status !== "Draft").length,
  )

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quizzes & Exams</h1>
          <p className="text-gray-600">Create and manage assessments for your courses</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Quiz
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                <ClipboardCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{totalQuizzes}</div>
                <div className="text-sm text-gray-600">Total Quizzes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-green-600 text-white">
                <Play className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{activeQuizzes}</div>
                <div className="text-sm text-gray-600">Active Quizzes</div>
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
                <div className="text-2xl font-bold text-gray-800">{totalAttempts}</div>
                <div className="text-sm text-gray-600">Total Attempts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{avgScore}%</div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quizzes Table */}
        <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <ClipboardCheck className="h-5 w-5 text-blue-600" />
              Quiz Management
            </CardTitle>
            <CardDescription>Overview of all quizzes and exams</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quiz</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Attempts</TableHead>
                  <TableHead>Avg Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quizzesData.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{quiz.title}</div>
                        <div className="text-sm text-gray-600">
                          {quiz.duration} min • Due: {new Date(quiz.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{quiz.course}</TableCell>
                    <TableCell>{quiz.questions}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>
                          {quiz.attempts}/{quiz.totalStudents}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${quiz.avgScore}%` }} />
                        </div>
                        <span className="text-sm text-gray-600">{quiz.avgScore}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(quiz.status)}
                        <Badge className={`${getStatusColor(quiz.status)} text-white`}>{quiz.status}</Badge>
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
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Attempts */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Clock className="h-5 w-5 text-green-600" />
              Recent Attempts
            </CardTitle>
            <CardDescription>Latest quiz submissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAttempts.map((attempt, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100"
              >
                <div className="space-y-2">
                  <div className="font-semibold text-gray-800">{attempt.student}</div>
                  <div className="text-sm text-gray-600">{attempt.quiz}</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500 text-white">{attempt.score}%</Badge>
                      <span className="text-xs text-gray-500">{attempt.duration}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{attempt.completedAt}</div>
                  <Button size="sm" className="w-full mt-2">
                    View Details
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
