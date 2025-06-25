import { Link } from "react-router-dom"
import { GraduationCap, BookOpen, Users, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex aspect-square size-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
              <GraduationCap className="size-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">EduPlatform</h1>
              <p className="text-blue-600 font-medium">Smart University System</p>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Welcome to the comprehensive university management system. Choose your portal to get started.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                  <BookOpen className="h-8 w-8" />
                </div>
              </div>
              <CardTitle className="text-2xl text-gray-800">Student Portal</CardTitle>
              <CardDescription className="text-gray-600">
                Access your courses, assignments, grades, and academic resources
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Course enrollment and progress tracking</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Assignment submissions and grades</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Class schedules and announcements</span>
                </div>
              </div>
              <Link to="/student" className="block">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg">
                  Enter Student Portal
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-400 to-green-600 text-white">
                  <Users className="h-8 w-8" />
                </div>
              </div>
              <CardTitle className="text-2xl text-gray-800">Lecturer Portal</CardTitle>
              <CardDescription className="text-gray-600">
                Manage courses, students, assignments, and academic performance
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Course and student management</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Assignment creation and grading</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Performance analytics and reports</span>
                </div>
              </div>
              <Link to="/lecturer" className="block">
                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg">
                  Enter Lecturer Portal
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white">
                  <Shield className="h-8 w-8" />
                </div>
              </div>
              <CardTitle className="text-2xl text-gray-800">Admin Portal</CardTitle>
              <CardDescription className="text-gray-600">
                Complete system administration, user management, and analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>User and role management</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Financial and academic oversight</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>System configuration and reports</span>
                </div>
              </div>
              <Link to="/admin" className="block">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white shadow-lg">
                  Enter Admin Portal
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            © 2024 EduPlatform. All rights reserved. | Smart University Management System
          </p>
        </div>
      </div>
    </div>
  )
}
