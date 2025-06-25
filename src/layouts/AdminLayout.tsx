"use client"

import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
import {
  Users,
  GraduationCap,
  UserCheck,
  Building,
  BookOpen,
  Calendar,
  UserPlus,
  DollarSign,
  CreditCard,
  Award,
  RefreshCw,
  BarChart3,
  FileText,
  TrendingUp,
  Activity,
  Megaphone,
  ClipboardCheck,
  Settings,
  HelpCircle,
  Search,
  Bell,
  LogOut,
  Shield,
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
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// Navigation items for admin
const navigationItems = [
  {
    title: "User Management",
    items: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: BarChart3,
      },
      {
        title: "Students",
        url: "/admin/students",
        icon: Users,
      },
      {
        title: "Lecturers",
        url: "/admin/lecturers",
        icon: GraduationCap,
      },
      {
        title: "Staff",
        url: "/admin/staff",
        icon: UserCheck,
      },
    ],
  },
  {
    title: "Academic Management",
    items: [
      {
        title: "Faculties & Departments",
        url: "/admin/faculties",
        icon: Building,
      },
      {
        title: "Courses & Schedules",
        url: "/admin/courses",
        icon: BookOpen,
      },
      {
        title: "Academic Calendar",
        url: "/admin/calendar",
        icon: Calendar,
      },
      {
        title: "Course Registration Approvals",
        url: "/admin/registrations",
        icon: UserPlus,
        badge: "12",
      },
    ],
  },
  {
    title: "Finance Management",
    items: [
      {
        title: "Tuition & Fees",
        url: "/admin/tuition",
        icon: DollarSign,
      },
      {
        title: "Payment Tracking",
        url: "/admin/payments",
        icon: CreditCard,
      },
      {
        title: "Scholarships/Waivers",
        url: "/admin/scholarships",
        icon: Award,
      },
      {
        title: "Refund Approvals",
        url: "/admin/refunds",
        icon: RefreshCw,
        badge: "3",
      },
    ],
  },
  {
    title: "Reports & Analytics",
    items: [
      {
        title: "Enrollment Reports",
        url: "/admin/enrollment-reports",
        icon: FileText,
      },
      {
        title: "Financial Reports",
        url: "/admin/financial-reports",
        icon: TrendingUp,
      },
      {
        title: "GPA & Performance Analysis",
        url: "/admin/performance",
        icon: Activity,
      },
      {
        title: "Attendance Trends",
        url: "/admin/attendance",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "System Management",
    items: [
      {
        title: "Announcements & Messaging",
        url: "/admin/announcements",
        icon: Megaphone,
      },
      {
        title: "Exams & Results Management",
        url: "/admin/exams",
        icon: ClipboardCheck,
      },
      {
        title: "System Settings",
        url: "/admin/settings",
        icon: Settings,
      },
      {
        title: "Support Tickets",
        url: "/admin/support",
        icon: HelpCircle,
        badge: "8",
      },
    ],
  },
]

function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar variant="inset" className="border-r-0">
      <SidebarHeader className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-violet-50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/admin" className="flex items-center gap-3">
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-lg">
                  <Shield className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-gray-900">EduPlatform</span>
                  <span className="truncate text-xs text-purple-600">Admin Portal</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-white/80 backdrop-blur-sm">
        {navigationItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-purple-600 font-semibold">{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                      className="h-10 hover:bg-purple-50 data-[active=true]:bg-gradient-to-r data-[active=true]:from-purple-500 data-[active=true]:to-violet-600 data-[active=true]:text-white data-[active=true]:shadow-lg"
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="size-4" />
                        <span className="font-medium text-sm">{item.title}</span>
                        {item.badge && (
                          <Badge className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5">{item.badge}</Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

export default function AdminLayout() {
  const navigate = useNavigate()

  // Get user data from localStorage
  const user = localStorage.getItem("user")
  const userData = user ? JSON.parse(user) : null

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Top Navbar */}
          <header className="flex h-16 shrink-0 items-center gap-4 border-b border-purple-100 bg-white/80 backdrop-blur-sm px-6">
            <SidebarTrigger className="-ml-1 text-purple-600" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-purple-200" />

            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-400" />
                <Input
                  placeholder="Search users, courses, reports..."
                  className="pl-10 border-purple-200 focus:border-purple-400 bg-white/70 backdrop-blur-sm"
                />
              </div>

              <Button variant="outline" size="icon" className="relative border-purple-200 hover:bg-purple-50">
                <Bell className="h-4 w-4 text-purple-600" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white p-0 flex items-center justify-center">
                  5
                </Badge>
              </Button>

              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 ring-2 ring-purple-200">
                  <AvatarImage src="/placeholder.svg" alt={userData?.email || "User"} />
                  <AvatarFallback className="bg-purple-100 text-purple-600">
                    {userData?.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-purple-600 hover:bg-purple-50"
                  onClick={handleLogout}
                >
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
