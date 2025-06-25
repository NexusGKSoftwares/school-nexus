"use client"

import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
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
  GraduationCap,
  UserCheck,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
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
    url: "/lecturer",
    icon: BookOpen,
  },
  {
    title: "My Profile",
    url: "/lecturer/profile",
    icon: User,
  },
  {
    title: "My Courses",
    url: "/lecturer/courses",
    icon: GraduationCap,
  },
  {
    title: "Attendance",
    url: "/lecturer/attendance",
    icon: UserCheck,
  },
  {
    title: "Upload Materials",
    url: "/lecturer/materials",
    icon: Upload,
  },
  {
    title: "Assignments & Feedback",
    url: "/lecturer/assignments",
    icon: FileText,
    badge: "5",
  },
  {
    title: "Quizzes & Exams",
    url: "/lecturer/quizzes",
    icon: ClipboardCheck,
  },
  {
    title: "Grading & Results",
    url: "/lecturer/grading",
    icon: BarChart3,
    badge: "12",
  },
  {
    title: "Announcements",
    url: "/lecturer/announcements",
    icon: Megaphone,
  },
  {
    title: "Messages",
    url: "/lecturer/messages",
    icon: MessageSquare,
    badge: "8",
  },
  {
    title: "Performance Reports",
    url: "/lecturer/reports",
    icon: TrendingUp,
  },
  {
    title: "Settings",
    url: "/lecturer/settings",
    icon: Settings,
  },
]

function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar variant="inset" className="border-r-0">
      <SidebarHeader className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/lecturer" className="flex items-center gap-3">
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                  <GraduationCap className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-gray-900">EduPlatform</span>
                  <span className="truncate text-xs text-blue-600">Lecturer Portal</span>
                </div>
              </Link>
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
                    isActive={location.pathname === item.url}
                    className="h-11 hover:bg-blue-50 data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-500 data-[active=true]:to-indigo-600 data-[active=true]:text-white data-[active=true]:shadow-lg"
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="size-5" />
                      <span className="font-medium">{item.title}</span>
                      {item.badge && (
                        <Badge className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5">{item.badge}</Badge>
                      )}
                    </Link>
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

export default function LecturerLayout() {
  const navigate = useNavigate()

  // Get user data from localStorage
  const user = localStorage.getItem("user")
  const userData = user ? JSON.parse(user) : null

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/auth/login")
  }

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
                  <AvatarImage src="/placeholder.svg" alt={userData?.email || "User"} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {userData?.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
