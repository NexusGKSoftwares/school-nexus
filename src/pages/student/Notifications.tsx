import { Bell, CheckCircle, AlertTriangle, Info, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const notifications = [
  {
    id: 1,
    title: "Assignment Due Tomorrow",
    message: "Your Mathematics assignment is due tomorrow at 11:59 PM. Don't forget to submit!",
    type: "warning",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    title: "New Course Material Available",
    message: "Dr. Smith has uploaded new lecture notes for Computer Science 201.",
    type: "info",
    time: "4 hours ago",
    read: false,
  },
  {
    id: 3,
    title: "Grade Posted",
    message: "Your grade for Physics Lab Report has been posted. Check your results!",
    type: "success",
    time: "1 day ago",
    read: true,
  },
  {
    id: 4,
    title: "Class Cancelled",
    message: "Tomorrow's English Literature class has been cancelled due to instructor illness.",
    type: "warning",
    time: "1 day ago",
    read: true,
  },
  {
    id: 5,
    title: "Library Book Due",
    message: "Your library book 'Advanced Calculus' is due in 3 days.",
    type: "info",
    time: "2 days ago",
    read: true,
  },
  {
    id: 6,
    title: "Exam Schedule Released",
    message: "The midterm exam schedule has been released. Check your student portal for details.",
    type: "info",
    time: "3 days ago",
    read: true,
  },
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle className="h-5 w-5 text-green-600" />
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-orange-600" />
    case "info":
    default:
      return <Info className="h-5 w-5 text-blue-600" />
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case "success":
      return "border-green-200 bg-green-50"
    case "warning":
      return "border-orange-200 bg-orange-50"
    case "info":
    default:
      return "border-blue-200 bg-blue-50"
  }
}

export default function Notifications() {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with your academic activities</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="destructive" className="text-sm">
            {unreadCount} Unread
          </Badge>
          <Button variant="outline">Mark All as Read</Button>
        </div>
      </div>

      {/* Notification Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                <Bell className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{notifications.length}</div>
                <div className="text-sm text-gray-600">Total Notifications</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{unreadCount}</div>
                <div className="text-sm text-gray-600">Unread</div>
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
                <div className="text-2xl font-bold text-gray-800">{notifications.length - unreadCount}</div>
                <div className="text-sm text-gray-600">Read</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Bell className="h-5 w-5 text-blue-600" />
            Recent Notifications
          </CardTitle>
          <CardDescription>Your latest updates and announcements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                notification.read ? "bg-white border-gray-200" : getNotificationColor(notification.type)
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className={`font-semibold ${notification.read ? "text-gray-700" : "text-gray-900"}`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className={`text-sm ${notification.read ? "text-gray-600" : "text-gray-700"}`}>
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{notification.time}</span>
                    {!notification.read && (
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
