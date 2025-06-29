import { useEffect, useState } from "react";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "../../contexts/AuthContext";
import {
  studentService,
  lecturerService,
  courseService,
  paymentService,
  announcementService,
} from "../../lib/dataService";

interface DashboardStats {
  totalStudents: number;
  activeLecturers: number;
  totalCourses: number;
  outstandingFees: number;
  totalAnnouncements: number;
}

interface RecentActivity {
  id: string;
  type: string;
  user: string;
  action: string;
  time: string;
  status: string;
}

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeLecturers: 0,
    totalCourses: 0,
    outstandingFees: 0,
    totalAnnouncements: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "registration":
        return <UserPlus className="h-4 w-4 text-blue-600" />;
      case "payment":
        return <DollarSign className="h-4 w-4 text-green-600" />;
      case "announcement":
        return <FileText className="h-4 w-4 text-purple-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Welcome Section */}
      <Card className="overflow-hidden bg-gradient-to-r from-purple-500 via-violet-600 to-indigo-600 text-white shadow-xl border-0">
        <CardContent className="p-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">
              Welcome back, {profile?.full_name || "Admin"}! 👨‍💼
            </h1>
            <p className="text-purple-100 text-lg">System Administrator</p>
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
                <div className="text-2xl font-bold text-gray-800">
                  {stats.totalStudents.toLocaleString()}
                </div>
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
                <div className="text-2xl font-bold text-gray-800">
                  {stats.activeLecturers}
                </div>
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
                <div className="text-2xl font-bold text-gray-800">
                  {stats.totalCourses}
                </div>
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
                <div className="text-2xl font-bold text-gray-800">
                  ${stats.outstandingFees.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Outstanding Fees</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest system activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-500 text-center py-4">
                No recent activity
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button className="justify-start" variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Add New Student
              </Button>
              <Button className="justify-start" variant="outline">
                <GraduationCap className="mr-2 h-4 w-4" />
                Add New Lecturer
              </Button>
              <Button className="justify-start" variant="outline">
                <BookPlus className="mr-2 h-4 w-4" />
                Create Course
              </Button>
              <Button className="justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Post Announcement
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
