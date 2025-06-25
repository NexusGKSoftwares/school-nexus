import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  UserPlus,
  BookPlus,
  CreditCard,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const adminData = {
  name: "Dr. Michael Chen",
  role: "System Administrator",
}

const quickStats = {
  totalStudents: 2847,
  activeLecturers: 156,
  totalCourses: 89,
  outstandingFees: 125000,
}

const recentActivity = [
  {
    id: 1,
    type: "registration",
    user: "Sarah Johnson",
    action: "New student registration",
    time: "2 minutes ago",
    status: "pending",
  },
  {
    id: 2,
    type: "payment",
    user: "Michael Brown",
    action: "Tuition payment received",
    time: "15 minutes ago",
    status: "completed",
  },
  {
    id: 3,
    type: "grade",
    user: "Dr. Smith",
    action: "Submitted grades for CS 301",
    time: "1 hour ago",
    status: "completed",
  },
  {
    id: 4,
    type: "upload",
    user: "Prof. Davis",
    action: "Uploaded course materials",
    time: "2 hours ago",
    status: "completed",
  },
  {
    id: 5,
    type: "registration",
    user: "Emily Wilson",
    action: "Course registration request",
    time: "3 hours ago",
    status: "pending",
  },
]

const systemAlerts = [
  {
    id: 1,
    title: "Server Maintenance Scheduled",
    message: "System maintenance scheduled for this weekend",
    type: "info",
    time: "1 hour ago",
  },
  {
    id: 2,
    title: "Payment Gateway Issue",
    message: "Some payment transactions are failing",
    type: "warning",
    time: "2 hours ago",
  },
  {
    id: 3,
    title: "New Feature Released",
    message: "Mobile app version 2.1 is now available",
    type: "success",
    time: "1 day ago",
  },
]

const getActivityIcon = (type: string) => {
  switch (type) {
    case "registration":
      return <UserPlus className="h-4 w-4 text-blue-600" />
    case "payment":
      return <DollarSign className="h-4 w-4 text-green-600" />
    case "grade":
      return <FileText className="h-4 w-4 text-purple-600" />
    case "upload":
      return <BookOpen className="h-4 w-4 text-orange-600" />
    default:
      return <Activity className="h-4 w-4 text-gray-600" />
  }
}

const getAlertIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle className="h-5 w-5 text-green-600" />
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-orange-600" />
    case "info":
    default:
      return <Clock className="h-5 w-5 text-blue-600" />
  }
}

export default function AdminDashboard() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Welcome Section */}
      <Card className="overflow-hidden bg-gradient-to-r from-purple-500 via-violet-600 to-indigo-600 text-white shadow-xl border-0">
        <CardContent className="p-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Welcome back, {adminData.name}! 👨‍💼</h1>
            <p className="text-purple-100 text-lg">{adminData.role}</p>
            <p className="text-purple-200">{currentDate}</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{quickStats.totalStudents.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Students</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-green-600 text-white">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{quickStats.activeLecturers}</div>
                <div className="text-sm text-gray-600">Active Lecturers</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{quickStats.totalCourses}</div>
                <div className="text-sm text-gray-600">Total Courses</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">${quickStats.outstandingFees.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Outstanding Fees</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Actions */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Key Actions
          </CardTitle>
          <CardDescription>Quick access to important administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-auto p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
              <div className="flex flex-col items-center gap-2">
                <UserPlus className="h-6 w-6" />
                <span className="font-medium">Add New Student</span>
              </div>
            </Button>
            <Button className="h-auto p-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
              <div className="flex flex-col items-center gap-2">
                <BookPlus className="h-6 w-6" />
                <span className="font-medium">Create New Course</span>
              </div>
            </Button>
            <Button className="h-auto p-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white">
              <div className="flex flex-col items-center gap-2">
                <CreditCard className="h-6 w-6" />
                <span className="font-medium">Approve Payments</span>
              </div>
            </Button>
            <Button className="h-auto p-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
              <div className="flex flex-col items-center gap-2">
                <FileText className="h-6 w-6" />
                <span className="font-medium">Generate Report</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity Log */}
        <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Activity className="h-5 w-5 text-blue-600" />
              Recent Activity Log
            </CardTitle>
            <CardDescription>Latest system activities and user actions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-100">{getActivityIcon(activity.type)}</div>
                        <span className="font-medium">{activity.user}</span>
                      </div>
                    </TableCell>
                    <TableCell>{activity.action}</TableCell>
                    <TableCell className="text-sm text-gray-600">{activity.time}</TableCell>
                    <TableCell>
                      <Badge
                        variant={activity.status === "completed" ? "default" : "secondary"}
                        className={activity.status === "completed" ? "bg-green-500" : "bg-orange-500"}
                      >
                        {activity.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              System Alerts
            </CardTitle>
            <CardDescription>Important system notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">{getAlertIcon(alert.type)}</div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-medium text-gray-800">{alert.title}</h4>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
