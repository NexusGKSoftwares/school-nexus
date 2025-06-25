"use client"

import React from "react"
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
import {
  BookOpen,
  Calendar,
  Bell,
  MessageSquare,
  GraduationCap,
  HelpCircle,
  Phone,
  Search,
  Plus,
  LogOut,
  Clock,
  Crown,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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

// Navigation items
const navigationItems = [
  {
    title: "Dashboard",
    url: "/student",
    icon: BookOpen,
  },
  {
    title: "Time Schedule",
    url: "/student/schedule",
    icon: Calendar,
  },
  {
    title: "Notifications",
    url: "/student/notifications",
    icon: Bell,
    badge: "3",
  },
  {
    title: "Messages",
    url: "/student/messages",
    icon: MessageSquare,
    badge: "12",
  },
  {
    title: "Learning Plan",
    url: "/student/learning-plan",
    icon: GraduationCap,
  },
  {
    title: "Help/Report",
    url: "/student/help",
    icon: HelpCircle,
  },
  {
    title: "Contact Us",
    url: "/student/contact",
    icon: Phone,
  },
]

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = React.useState(3600) // 1 hour in seconds

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const hours = Math.floor(timeLeft / 3600)
  const minutes = Math.floor((timeLeft % 3600) / 60)
  const seconds = timeLeft % 60

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
      <Clock className="h-4 w-4 text-blue-600" />
      <span className="text-sm font-medium text-blue-700">
        {hours > 0 ? `${hours}h ` : ""}
        {minutes}m {seconds}s remaining
      </span>
    </div>
  )
}

function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar variant="inset" className="border-r-0">
      <SidebarHeader className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/student" className="flex items-center gap-3">
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                  <GraduationCap className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-gray-900">EduPlatform</span>
                  <span className="truncate text-xs text-blue-600">Student Portal</span>
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

      <SidebarFooter className="border-t border-blue-100 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-5 w-5" />
            <span className="font-bold">Upgrade to PRO</span>
          </div>
          <p className="text-xs text-amber-100 mb-3">Unlock premium features and get unlimited access to all courses</p>
          <Button size="sm" className="w-full bg-white text-orange-600 hover:bg-gray-100 font-semibold">
            Upgrade Now
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default function StudentLayout() {
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
                  placeholder="Search courses, assignments..."
                  className="pl-10 border-blue-200 focus:border-blue-400 bg-white/70 backdrop-blur-sm"
                />
              </div>

              <CountdownTimer />

              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                New Courses
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
