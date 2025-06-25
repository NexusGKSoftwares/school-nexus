import { GraduationCap, Target, BookOpen, Award, TrendingUp, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const learningGoals = [
  {
    id: 1,
    title: "Complete Mathematics Fundamentals",
    description: "Master calculus, algebra, and statistics",
    progress: 75,
    deadline: "Dec 2024",
    status: "in-progress",
  },
  {
    id: 2,
    title: "Programming Proficiency",
    description: "Learn Python, JavaScript, and data structures",
    progress: 60,
    deadline: "Jan 2025",
    status: "in-progress",
  },
  {
    id: 3,
    title: "Research Project",
    description: "Complete final year research project",
    progress: 30,
    deadline: "May 2025",
    status: "in-progress",
  },
  {
    id: 4,
    title: "Internship Application",
    description: "Apply for summer internships",
    progress: 100,
    deadline: "Nov 2024",
    status: "completed",
  },
]

const recommendedCourses = [
  {
    title: "Advanced Data Structures",
    code: "CS 301",
    credits: 3,
    difficulty: "Advanced",
    rating: 4.8,
  },
  {
    title: "Machine Learning Basics",
    code: "CS 350",
    credits: 4,
    difficulty: "Intermediate",
    rating: 4.6,
  },
  {
    title: "Database Design",
    code: "CS 320",
    credits: 3,
    difficulty: "Intermediate",
    rating: 4.7,
  },
]

const achievements = [
  {
    title: "Dean's List",
    description: "Achieved GPA above 3.8",
    date: "Fall 2024",
    icon: Award,
  },
  {
    title: "Programming Contest Winner",
    description: "1st place in university coding competition",
    date: "Oct 2024",
    icon: Target,
  },
  {
    title: "Research Paper Published",
    description: "Co-authored paper in AI conference",
    date: "Sep 2024",
    icon: BookOpen,
  },
]

export default function LearningPlan() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning Plan</h1>
          <p className="text-gray-600">Track your academic progress and plan your future</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
          <Target className="h-4 w-4 mr-2" />
          Set New Goal
        </Button>
      </div>

      {/* Progress Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">4</div>
                <div className="text-sm text-gray-600">Active Goals</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-green-600 text-white">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">1</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">66%</div>
                <div className="text-sm text-gray-600">Avg Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Learning Goals */}
        <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Target className="h-5 w-5 text-blue-600" />
              Learning Goals
            </CardTitle>
            <CardDescription>Your academic objectives and progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {learningGoals.map((goal) => (
              <div
                key={goal.id}
                className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{goal.title}</h3>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>
                    <Badge
                      variant={goal.status === "completed" ? "default" : "secondary"}
                      className={goal.status === "completed" ? "bg-green-500" : ""}
                    >
                      {goal.status === "completed" ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-800">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>Due: {goal.deadline}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Award className="h-5 w-5 text-yellow-600" />
              Achievements
            </CardTitle>
            <CardDescription>Your academic milestones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-yellow-100">
                    <achievement.icon className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <span className="text-xs text-gray-500">{achievement.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recommended Courses */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <BookOpen className="h-5 w-5 text-green-600" />
            Recommended Courses
          </CardTitle>
          <CardDescription>Courses that align with your learning goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {recommendedCourses.map((course, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100"
              >
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">{course.title}</h3>
                    <p className="text-sm text-green-600 font-medium">{course.code}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{course.credits} Credits</span>
                    <Badge variant="outline">{course.difficulty}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rating: {course.rating}/5</span>
                    <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                      Enroll
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
