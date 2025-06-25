import {
  BookOpen,
  User,
  Upload,
  FileText,
  ClipboardCheck,
  BarChart3,
  Megaphone,
  MessageSquare,
  TrendingUp,
  Settings,
  Search,
  Bell,
  Video,
  LogOut,
  Users,
  Clock,
  GraduationCap,
  UserCheck,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// Navigation items for lecturer
const navigationItems = [
  {
    title: "Dashboard",
    url: "#",
    icon: BookOpen,
    isActive: true,
  },
  {
    title: "My Profile",
    url: "#",
    icon: User,
  },
  {
    title: "My Courses",
    url: "#",
    icon: GraduationCap,
  },
  {
    title: "Attendance",
    url: "#",
    icon: UserCheck,
  },
  {
    title: "Upload Materials",
    url: "#",
    icon: Upload,
  },
  {
    title: "Assignments & Feedback",
    url: "#",
    icon: FileText,
    badge: "5",
  },
  {
    title: "Quizzes & Exams",
    url: "#",
    icon: ClipboardCheck,
  },
  {
    title: "Grading & Results",
    url: "#",
    icon: BarChart3,
    badge: "12",
  },
  {
    title: "Announcements",
    url: "#",
    icon: Megaphone,
  },
  {
    title: "Messages",
    url: "#",
    icon: MessageSquare,
    badge: "8",
  },
  {
    title: "Performance Reports",
    url: "#",
    icon: TrendingUp,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

// Sample lecturer data
const lecturerData = {
  name: "Dr. Sarah Mitchell",
  department: "Computer Science Department",
  avatar: "/placeholder.svg?height=40&width=40",
  title: "Associate Professor",
}

// Sample dashboard data
const dashboardData = {
  overview: {
    assignedCourses: 4,
    studentsTaught: 156,
    classesToday: 3,
    pendingGrading: 12,
  },
  courses: [
    {
      title: "Data Structures & Algorithms",
      code: "CS 301",
      classSize: 45,
      schedule: "MWF 10:00 AM",
    },
    {
      title: "Database Management Systems",
      code: "CS 401",
      classSize: 38,
      schedule: "TTh 2:00 PM",
    },
    {
      title: "Software Engineering",
      code: "CS 402",
      classSize: 42,
      schedule: "MWF 1:00 PM",
    },
    {
      title: "Web Development",
      code: "CS 350",
      classSize: 31,
      schedule: "TTh 11:00 AM",
    },
  ],
  upcomingClasses: [
    {
      course: "Data Structures & Algorithms",
      time: "10:00 AM",
      duration: "1h 30m",
      method: "In-person",
      room: "CS-101",
    },
    {
      course: "Software Engineering",
      time: "1:00 PM",
      duration: "1h 30m",
      method: "Online",
      room: "Zoom Meeting",
    },
    {
      course: "Database Management Systems",
      time: "2:00 PM",
      duration: "1h 30m",
      method: "In-person",
      room: "CS-205",
    },
  ],
  recentMessages: [
    {
      from: "John Smith",
      subject: "Question about Assignment 3",
      time: "2 hours ago",
      unread: true,
    },
    {
      from: "Emily Johnson",
      subject: "Request for Extension",
      time: "4 hours ago",
      unread: true,
    },
    {
      from: "Michael Brown",
      subject: "Thank you for the feedback",
      time: "1 day ago",
      unread: false,
    },
  ],
  announcements: [
    {
      title: "Midterm Exam Schedule Updated",
      date: "Today",
      priority: "high",
    },
    {
      title: "New Assignment Posted - CS 301",
      date: "Yesterday",
      priority: "medium",
    },
    {
      title: "Office Hours Changed",
      date: "2 days ago",
      priority: "low",
    },
  ],
}

function AppSidebar() {
  return (
    <Sidebar variant="inset" className="border-r-0">
      <SidebarHeader className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-3">
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                  <GraduationCap className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-gray-900">EduPlatform</span>
                  <span className="truncate text-xs text-blue-600">Lecturer Portal</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-white/80 backdrop-blur-sm">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    className="h-11 hover:bg-blue-50 data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-500 data-[active=true]:to-indigo-600 data-[active=true]:text-white data-[active=true]:shadow-lg"
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="size-5" />
                      <span className="font-medium">{item.title}</span>
                      {item.badge && (
                        <Badge className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5">{item.badge}</Badge>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

export default function LecturerDashboard() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Top Navbar */}
          <header className="flex h-16 shrink-0 items-center gap-4 border-b border-blue-100 bg-white/80 backdrop-blur-sm px-6">
            <SidebarTrigger className="-ml-1 text-blue-600" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-blue-200" />

            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
                <Input
                  placeholder="Search courses, students, materials..."
                  className="pl-10 border-blue-200 focus:border-blue-400 bg-white/70 backdrop-blur-sm"
                />
              </div>

              <Button variant="outline" size="icon" className="relative border-blue-200 hover:bg-blue-50">
                <Bell className="h-4 w-4 text-blue-600" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white p-0 flex items-center justify-center">
                  3
                </Badge>
              </Button>

              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg">
                <Video className="h-4 w-4 mr-2" />
                Start Lecture
              </Button>

              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 ring-2 ring-blue-200">
                  <AvatarImage src={lecturerData.avatar || "/placeholder.svg"} alt={lecturerData.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">SM</AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-6 p-6">
            {/* Welcome Section */}
            <Card className="overflow-hidden bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white shadow-xl border-0">
              <CardContent className="p-8">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold">Welcome back, {lecturerData.name}! 👨‍🏫</h1>
                  <p className="text-blue-100 text-lg">{lecturerData.department}</p>
                  <p className="text-blue-200">{currentDate}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">{dashboardData.overview.assignedCourses}</div>
                      <div className="text-sm text-gray-600">Assigned Courses</div>
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
                      <div className="text-2xl font-bold text-gray-800">{dashboardData.overview.studentsTaught}</div>
                      <div className="text-sm text-gray-600">Students Taught</div>
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
                      <div className="text-2xl font-bold text-gray-800">{dashboardData.overview.classesToday}</div>
                      <div className="text-sm text-gray-600">Classes Today</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-red-400 to-red-600 text-white">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">{dashboardData.overview.pendingGrading}</div>
                      <div className="text-sm text-gray-600">Pending Grading</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* My Courses */}
              <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    My Courses
                  </CardTitle>
                  <CardDescription>Manage your assigned courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Schedule</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dashboardData.courses.map((course, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{course.title}</TableCell>
                          <TableCell>{course.code}</TableCell>
                          <TableCell>{course.classSize}</TableCell>
                          <TableCell className="text-sm text-gray-600">{course.schedule}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" className="h-8 px-2">
                                <UserCheck className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 px-2">
                                <Upload className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 px-2">
                                <BarChart3 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Upcoming Classes */}
              <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Clock className="h-5 w-5 text-orange-600" />
                    Upcoming Classes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dashboardData.upcomingClasses.map((class_, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100"
                    >
                      <div className="space-y-2">
                        <div className="font-semibold text-gray-800">{class_.course}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>
                            {class_.time} ({class_.duration})
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant={class_.method === "Online" ? "default" : "secondary"}>{class_.method}</Badge>
                          <span className="text-xs text-gray-500">{class_.room}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recent Messages and Announcements */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    Recent Messages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dashboardData.recentMessages.map((message, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 cursor-pointer">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                          {message.from
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{message.from}</span>
                          <span className="text-xs text-gray-500">{message.time}</span>
                        </div>
                        <div className="text-sm text-gray-600">{message.subject}</div>
                        {message.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Megaphone className="h-5 w-5 text-purple-600" />
                    Recent Announcements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dashboardData.announcements.map((announcement, index) => (
                    <div key={index} className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{announcement.title}</div>
                          <div className="text-xs text-gray-500">{announcement.date}</div>
                        </div>
                        <Badge
                          variant={
                            announcement.priority === "high"
                              ? "destructive"
                              : announcement.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {announcement.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
