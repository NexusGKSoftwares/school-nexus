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
  Loader2,
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
import {
  lecturerService,
  courseService,
  enrollmentService,
  announcementService,
} from "../../lib/dataService";

interface DashboardOverview {
  assignedCourses: number;
  studentsTaught: number;
  classesToday: number;
  pendingGrading: number;
}

interface Course {
  id: string;
  title: string;
  code: string;
  classSize: number;
  schedule: string;
  room?: string;
}

interface UpcomingClass {
  course: string;
  time: string;
  duration: string;
  method: string;
  room: string;
}

interface RecentMessage {
  from: string;
  subject: string;
  time: string;
  unread: boolean;
}

interface Announcement {
  title: string;
  date: string;
  priority: string;
}

export default function LecturerDashboard() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<DashboardOverview>({
    assignedCourses: 0,
    studentsTaught: 0,
    classesToday: 0,
    pendingGrading: 0,
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([]);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    if (profile) {
      fetchLecturerData();
    }
  }, [profile]);

  const fetchLecturerData = async () => {
    if (!profile) return;

    try {
      setLoading(true);
      setError(null);

      // Get lecturer record
      const { data: lecturerRecord, error: lecturerError } =
        await lecturerService.getLecturerByProfile(profile.id);

      if (lecturerError) {
        setError(lecturerError.message);
        return;
      }

      if (lecturerRecord) {
        // Fetch courses for this lecturer
        const { data: lecturerCourses, error: coursesError } =
          await courseService.getCoursesByLecturer(lecturerRecord.id);

        if (coursesError) {
          setError(coursesError.message);
          return;
        }

        if (lecturerCourses) {
          // Transform courses data
          const transformedCourses: Course[] = lecturerCourses.map(
            (course) => ({
              id: course.id,
              title: course.name,
              code: course.code,
              classSize: course.enrolled_students || 0,
              schedule: course.schedule || "TBD",
              room: course.room || "TBD",
            }),
          );
          setCourses(transformedCourses);

          // Calculate overview stats
          const totalStudents = transformedCourses.reduce(
            (sum, course) => sum + course.classSize,
            0,
          );
          const assignedCourses = transformedCourses.length;

          setOverview({
            assignedCourses,
            studentsTaught: totalStudents,
            classesToday: Math.min(assignedCourses, 3), // Mock data for classes today
            pendingGrading: Math.floor(Math.random() * 20) + 5, // Mock data for pending grading
          });

          // Generate upcoming classes based on courses
          const mockUpcomingClasses: UpcomingClass[] = transformedCourses
            .slice(0, 3)
            .map((course, index) => ({
              course: course.title,
              time:
                index === 0 ? "10:00 AM" : index === 1 ? "1:00 PM" : "2:00 PM",
              duration: "1h 30m",
              method: index === 1 ? "Online" : "In-person",
              room: index === 1 ? "Zoom Meeting" : course.room || "TBD",
            }));
          setUpcomingClasses(mockUpcomingClasses);
        }
      }

      // Fetch announcements
      const { data: announcementsData, error: announcementsError } =
        await announcementService.getAnnouncements();

      if (!announcementsError && announcementsData) {
        const transformedAnnouncements: Announcement[] = announcementsData
          .slice(0, 3)
          .map((announcement, index) => ({
            title: announcement.title,
            date:
              index === 0 ? "Today" : index === 1 ? "Yesterday" : "2 days ago",
            priority: announcement.priority,
          }));
        setAnnouncements(transformedAnnouncements);
      }

      // Generate mock recent messages (since we don't have a messaging system yet)
      const mockMessages: RecentMessage[] = [
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
      ];
      setRecentMessages(mockMessages);
    } catch (err) {
      setError("Failed to fetch lecturer data");
      console.error("Error fetching lecturer data:", err);
    } finally {
      setLoading(false);
    }
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchLecturerData}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Welcome Section */}
      <Card className="overflow-hidden bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white shadow-xl border-0">
        <CardContent className="p-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">
              Welcome back, {profile?.full_name}! 👨‍🏫
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
            {courses.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No courses assigned yet.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Class Size</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">
                            {course.title}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {course.code}
                      </TableCell>
                      <TableCell>{course.classSize}</TableCell>
                      <TableCell>{course.schedule}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
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
            {upcomingClasses.length === 0 ? (
              <div className="text-center py-4">
                <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No upcoming classes</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingClasses.map((class_, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border border-gray-200"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {class_.course}
                        </h4>
                        <Badge
                          variant={
                            class_.method === "Online" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {class_.method}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {class_.time} • {class_.duration}
                      </p>
                      <p className="text-xs text-gray-500">{class_.room}</p>
                      <Button size="sm" variant="outline" className="w-full">
                        Join Class
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Messages */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Recent Messages
            </CardTitle>
            <CardDescription>Latest student communications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.map((message, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                      {message.from
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {message.from}
                      </p>
                      {message.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {message.subject}
                    </p>
                    <p className="text-xs text-gray-500">{message.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Megaphone className="h-5 w-5 text-blue-600" />
              Recent Announcements
            </CardTitle>
            <CardDescription>Latest announcements and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.length === 0 ? (
                <div className="text-center py-4">
                  <Megaphone className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">
                    No recent announcements
                  </p>
                </div>
              ) : (
                announcements.map((announcement, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border border-gray-200"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {announcement.title}
                        </h4>
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
                      <p className="text-xs text-gray-500">
                        {announcement.date}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
