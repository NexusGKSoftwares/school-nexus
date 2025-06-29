import { useState, useEffect } from "react";
import {
  BookOpen,
  Users,
  Clock,
  FileText,
  MessageSquare,
  BarChart3,
  UserCheck,
  Upload,
  Megaphone,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

export default function LecturerDashboard() {
  const { profile } = useAuth();
  const [overview, setOverview] = useState({
    assignedCourses: 0,
    studentsTaught: 0,
    classesToday: 0,
    pendingGrading: 0,
  });
  const [courses, setCourses] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Welcome Section */}
      <Card className="overflow-hidden bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white shadow-xl border-0">
        <CardContent className="p-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">
              Welcome back, {profile?.full_name || "Lecturer"}! ‍
            </h1>
            <p className="text-blue-100 text-lg">Lecturer</p>
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
                <div className="text-2xl font-bold text-gray-800">
                  {overview.assignedCourses}
                </div>
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
                <div className="text-2xl font-bold text-gray-800">
                  {overview.studentsTaught}
                </div>
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
                <div className="text-2xl font-bold text-gray-800">
                  {overview.classesToday}
                </div>
                <div className="text-sm text-gray-600">Classes Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {overview.pendingGrading}
                </div>
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
              <BookOpen className="h-5 w-5 text-blue-600" />
              My Courses
            </CardTitle>
            <CardDescription>
              Your assigned courses and class schedules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No courses assigned yet.</p>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Classes */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Clock className="h-5 w-5 text-blue-600" />
              Upcoming Classes
            </CardTitle>
            <CardDescription>Your next scheduled classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No upcoming classes</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
