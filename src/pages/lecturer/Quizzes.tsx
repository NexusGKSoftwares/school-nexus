"use client"

import { ClipboardCheck, Plus, Edit, Eye, Play, BarChart3, Users, Clock, CheckCircle, Loader2, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { quizService, courseService } from "@/lib/dataService"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { QuizModal } from "@/components/modals/QuizModal"
import DeleteConfirmModal  from "@/components/modals/DeleteConfirmModal"

interface Quiz {
  id: string
  title: string
  description: string
  course_id: string
  lecturer_id: string
  questions_count: number
  duration_minutes: number
  total_points: number
  status: string
  due_date: string
  created_at: string
  course?: {
    code: string
    name: string
  }
}

interface RecentAttempt {
  student: string
  quiz: string
  score: number
  completedAt: string
  duration: string
}

export default function LecturerQuizzes() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [courses, setCourses] = useState<Array<{ id: string; name: string; code: string }>>([])
  const [recentAttempts, setRecentAttempts] = useState<RecentAttempt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Modal states
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Fetch quizzes for the logged-in lecturer
      const { data: quizzesData, error: quizzesError } = await quizService.getQuizzesByLecturer(user.id)
      
      if (quizzesError) {
        setError(quizzesError.message)
        return
      }

      // Fetch courses for modal
      const { data: coursesData } = await courseService.getCoursesByLecturer(user.id)
      
      // Transform courses data for modal
      if (coursesData) {
        const transformedCourses = coursesData.map(course => ({
          id: course.id,
          name: course.name,
          code: course.code
        }))
        setCourses(transformedCourses)
      }

      if (quizzesData) {
        setQuizzes(quizzesData)

        // Generate mock recent attempts based on quizzes
        const mockAttempts: RecentAttempt[] = quizzesData.slice(0, 3).map((quiz, index) => ({
          student: `Student ${index + 1}`,
          quiz: quiz.title,
          score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
          completedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          duration: `${Math.floor(Math.random() * 20) + 15} min`,
        }))
        setRecentAttempts(mockAttempts)
      }
    } catch (err) {
      setError("Failed to fetch quiz data")
      console.error("Error fetching quiz data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateQuiz = () => {
    setSelectedQuiz(null)
    setIsQuizModalOpen(true)
  }

  const handleEditQuiz = (quiz: Quiz) => {
    setSelectedQuiz({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      course_id: quiz.course_id,
      lecturer_id: quiz.lecturer_id,
      questions_count: quiz.questions_count,
      duration_minutes: quiz.duration_minutes,
      total_points: quiz.total_points,
      status: quiz.status,
      due_date: quiz.due_date ? new Date(quiz.due_date) : null,
      instructions: '',
      passing_score: 60,
      max_attempts: 1,
      shuffle_questions: false,
      show_results: true,
      time_limit: quiz.duration_minutes
    })
    setIsQuizModalOpen(true)
  }

  const handleDeleteQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    setIsDeleteModalOpen(true)
  }

  const handleSaveQuiz = async (data: any) => {
    try {
      setIsSubmitting(true)
      
      if (selectedQuiz) {
        // Update existing quiz
        const { error } = await quizService.updateQuiz(selectedQuiz.id, data)
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
          description: "Quiz updated successfully"
        })
      } else {
        // Create new quiz
        const { error } = await quizService.createQuiz(data)
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
          description: "Quiz created successfully"
        })
      }
      
      setIsQuizModalOpen(false)
      fetchData()
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save quiz",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedQuiz) return
    
    try {
      setIsSubmitting(true)
      const { error } = await quizService.deleteQuiz(selectedQuiz.id)
      
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
        description: "Quiz deleted successfully"
      })
      
      setIsDeleteModalOpen(false)
      fetchData()
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete quiz",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="h-4 w-4 text-green-600" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "draft":
        return <Edit className="h-4 w-4 text-orange-600" />
      default:
        return <ClipboardCheck className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "completed":
        return "bg-blue-500"
      case "draft":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading quizzes...</span>
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

  const totalQuizzes = quizzes.length
  const activeQuizzes = quizzes.filter((q) => q.status === "active").length
  const totalAttempts = quizzes.reduce((sum, quiz) => sum + (quiz.attempts_count || 0), 0)
  const avgScore = quizzes.filter((q) => q.status !== "draft").length > 0 
    ? Math.round(quizzes.filter((q) => q.status !== "draft").reduce((sum, quiz) => sum + (quiz.average_score || 0), 0) / quizzes.filter((q) => q.status !== "draft").length)
    : 0

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quizzes & Exams</h1>
          <p className="text-gray-600">Create and manage assessments for your courses</p>
        </div>
        <Button 
          onClick={handleCreateQuiz}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
        >
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
            {quizzes.length === 0 ? (
              <div className="text-center py-8">
                <ClipboardCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No quizzes created yet.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quiz</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quizzes.map((quiz) => (
                    <TableRow key={quiz.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{quiz.title}</div>
                          <div className="text-sm text-gray-600">{quiz.description}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{quiz.course?.code || 'Unknown'}</TableCell>
                      <TableCell>{quiz.questions_count}</TableCell>
                      <TableCell>{quiz.duration_minutes} min</TableCell>
                      <TableCell>
                        {quiz.due_date ? new Date(quiz.due_date).toLocaleDateString() : 'No due date'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(quiz.status)}
                          <Badge className={getStatusColor(quiz.status)}>
                            {quiz.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditQuiz(quiz)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteQuiz(quiz)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Recent Attempts */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Recent Attempts
            </CardTitle>
            <CardDescription>Latest student quiz attempts</CardDescription>
          </CardHeader>
          <CardContent>
            {recentAttempts.length === 0 ? (
              <div className="text-center py-4">
                <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No recent attempts</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAttempts.map((attempt, index) => (
                  <div key={index} className="p-3 rounded-lg border border-gray-200">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 text-sm">{attempt.student}</h4>
                        <Badge variant={attempt.score >= 80 ? "default" : attempt.score >= 60 ? "secondary" : "destructive"} className="text-xs">
                          {attempt.score}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{attempt.quiz}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{attempt.completedAt}</span>
                        <span>{attempt.duration}</span>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <QuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        onSave={handleSaveQuiz}
        quiz={selectedQuiz}
        courses={courses}
        isLoading={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Quiz"
        description={`Are you sure you want to delete the quiz "${selectedQuiz?.title || 'this quiz'}"? This action cannot be undone.`}
        isLoading={isSubmitting}
      />
    </div>
  )
}
