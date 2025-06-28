"use client";

import {
  UserCheck,
  Users,
  Download,
  Filter,
  Search,
  Check,
  X,
  Clock,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { attendanceService, courseService } from "@/lib/dataService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Attendance {
  id: string;
  student_id: string;
  course_id: string;
  date: string;
  status: string;
  created_at: string;
  student?: {
    first_name: string;
    last_name: string;
    profile?: {
      email: string;
    };
  };
  course?: {
    code: string;
    name: string;
  };
}

interface CourseStats {
  course: string;
  present: number;
  absent: number;
  late: number;
  total: number;
}

export default function LecturerAttendance() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [courseStats, setCourseStats] = useState<CourseStats[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch attendance for the logged-in lecturer
      const { data: attendanceData, error: attendanceError } =
        await attendanceService.getAttendanceByLecturer(user.id);

      if (attendanceError) {
        setError(attendanceError.message);
        return;
      }

      // Fetch courses for the lecturer
      const { data: coursesData, error: coursesError } =
        await courseService.getCoursesByLecturer(user.id);

      if (coursesError) {
        setError(coursesError.message);
        return;
      }

      if (attendanceData) {
        setAttendance(attendanceData);
      }

      if (coursesData) {
        setCourses(coursesData);

        // Generate course statistics
        const stats: CourseStats[] = coursesData.map((course) => {
          const courseAttendance =
            attendanceData?.filter((a) => a.course_id === course.id) || [];
          const present = courseAttendance.filter(
            (a) => a.status === "present",
          ).length;
          const absent = courseAttendance.filter(
            (a) => a.status === "absent",
          ).length;
          const late = courseAttendance.filter(
            (a) => a.status === "late",
          ).length;
          const total = course.enrolled_students || 0;

          return {
            course: course.code,
            present,
            absent,
            late,
            total,
          };
        });
        setCourseStats(stats);
      }
    } catch (err) {
      setError("Failed to fetch attendance data");
      console.error("Error fetching attendance data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAttendance = async (
    attendanceId: string,
    status: string,
  ) => {
    try {
      const { error } = await attendanceService.updateAttendance(attendanceId, {
        status,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Attendance updated successfully",
      });

      // Refresh the data
      fetchData();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update attendance",
        variant: "destructive",
      });
    }
  };

  const filteredAttendance = attendance.filter((record) => {
    const studentName = record.student
      ? `${record.student.first_name} ${record.student.last_name}`
      : "Unknown";
    const matchesSearch = studentName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCourse =
      selectedCourse === "All Courses" ||
      record.course?.code === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <Check className="h-4 w-4 text-green-600" />;
      case "absent":
        return <X className="h-4 w-4 text-red-600" />;
      case "late":
        return <Clock className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-500";
      case "absent":
        return "bg-red-500";
      case "late":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading attendance data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchData}>Retry</Button>
        </div>
      </div>
    );
  }

  const totalPresent = courseStats.reduce(
    (sum, course) => sum + course.present,
    0,
  );
  const totalAbsent = courseStats.reduce(
    (sum, course) => sum + course.absent,
    0,
  );
  const totalLate = courseStats.reduce((sum, course) => sum + course.late, 0);
  const totalStudents = courseStats.reduce(
    (sum, course) => sum + course.total,
    0,
  );
  const attendanceRate =
    totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Attendance Management
          </h1>
          <p className="text-gray-600">
            Track and manage student attendance for your courses
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="border-blue-200 hover:bg-blue-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
            <UserCheck className="h-4 w-4 mr-2" />
            Take Attendance
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-green-600 text-white">
                <Check className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {totalPresent}
                </div>
                <div className="text-sm text-gray-600">Present Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-400 to-red-600 text-white">
                <X className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {totalAbsent}
                </div>
                <div className="text-sm text-gray-600">Absent Today</div>
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
                  {totalLate}
                </div>
                <div className="text-sm text-gray-600">Late Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {attendanceRate}%
                </div>
                <div className="text-sm text-gray-600">Attendance Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Course Statistics */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Users className="h-5 w-5 text-blue-600" />
              Course Statistics
            </CardTitle>
            <CardDescription>Attendance breakdown by course</CardDescription>
          </CardHeader>
          <CardContent>
            {courseStats.length === 0 ? (
              <div className="text-center py-4">
                <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">
                  No course data available
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {courseStats.map((stat, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border border-gray-200"
                  >
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {stat.course}
                      </h4>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-semibold text-green-600">
                            {stat.present}
                          </div>
                          <div className="text-gray-500">Present</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-red-600">
                            {stat.absent}
                          </div>
                          <div className="text-gray-500">Absent</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-orange-600">
                            {stat.late}
                          </div>
                          <div className="text-gray-500">Late</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 text-center">
                        Total: {stat.total} students
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attendance Table */}
        <Card className="lg:col-span-3 bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                  Attendance Records
                </CardTitle>
                <CardDescription>Detailed attendance tracking</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Filter className="h-4 w-4" />
                      {selectedCourse}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Filter by Course</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setSelectedCourse("All Courses")}
                    >
                      All Courses
                    </DropdownMenuItem>
                    {courses.map((course) => (
                      <DropdownMenuItem
                        key={course.id}
                        onClick={() => setSelectedCourse(course.code)}
                      >
                        {course.code}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredAttendance.length === 0 ? (
              <div className="text-center py-8">
                <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No attendance records found.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">
                            {record.student
                              ? `${record.student.first_name} ${record.student.last_name}`
                              : "Unknown Student"}
                          </div>
                          <div className="text-sm text-gray-600">
                            {record.student?.profile?.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {record.course?.code || "Unknown"}
                      </TableCell>
                      <TableCell>
                        {new Date(record.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.status)}
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                            onClick={() =>
                              handleUpdateAttendance(record.id, "present")
                            }
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            onClick={() =>
                              handleUpdateAttendance(record.id, "absent")
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700"
                            onClick={() =>
                              handleUpdateAttendance(record.id, "late")
                            }
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
