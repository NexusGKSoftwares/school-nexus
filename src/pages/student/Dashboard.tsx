import { BookOpen, TrendingUp, FileText, AlertTriangle, Play, Eye, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const studentData = {
  name: "Haleema",
}

const coursesData = [
  {
    subject: "Mathematics",
    code: "MATH 101",
    progress: 85,
    status: "enrolled",
  },
  {
    subject: "Computer Science",
    code: "CS 201",
    progress: 92,
    status: "enrolled",
  },
  {
    subject: "Physics",
    code: "PHY 101",
    progress: 78,
    status: "enrolled",
  },
  {
    subject: "English Literature",
    code: "ENG 102",
    progress: 0,
    status: "available",
  },
]

const recentResults = [
  { subject: "Math Quiz", score: 85, maxScore: 100 },
  { subject: "CS Assignment", score: 92, maxScore: 100 },
  { subject: "Physics Lab", score: 78, maxScore: 100 },
  { subject: "English Essay", score: 88, maxScore: 100 },
]

export default function StudentDashboard() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Welcome Section */}
      <Card className="overflow-hidden bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white shadow-xl border-0">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Hello {studentData.name}! 👋</h1>
              <p className="text-blue-100 text-lg">Ready to continue your learning journey?</p>
              <Button className="mt-4 bg-white text-blue-600 hover:bg-blue-50 font-semibold">
                <Play className="h-4 w-4 mr-2" />
                Continue Learning
              </Button>
            </div>
            <div className="hidden md:block">
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Student with laptop"
                className="rounded-lg shadow-lg opacity-90"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Your Courses */}
        <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Your Courses
            </CardTitle>
            <CardDescription>Track your progress and continue learning</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {coursesData.map((course, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100"
              >
                <div className="space-y-2">
                  <div className="font-semibold text-gray-800">{course.subject}</div>
                  <div className="text-sm text-blue-600 font-medium">{course.code}</div>
                  {course.status === "enrolled" && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2 bg-blue-100" />
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {course.status === "enrolled" ? (
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                      <UserPlus className="h-4 w-4 mr-1" />
                      Enroll
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Results */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Recent Results
            </CardTitle>
            <CardDescription>Your latest quiz and assignment scores</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentResults.map((result, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{result.subject}</span>
                  <span className="font-bold text-blue-600">{result.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${result.score}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Info Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 text-white">
                <FileText className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-800">Leave Request</h3>
                <p className="text-sm text-gray-600">Submit your leave application</p>
              </div>
              <Button variant="outline" className="ml-auto border-orange-300 text-orange-600 hover:bg-orange-50">
                Apply
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 text-white">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-800">Complaint Submission</h3>
                <p className="text-sm text-gray-600">Report issues or concerns</p>
              </div>
              <Button variant="outline" className="ml-auto border-purple-300 text-purple-600 hover:bg-purple-50">
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
