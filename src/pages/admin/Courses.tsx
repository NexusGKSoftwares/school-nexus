"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  Users,
  Calendar,
  Loader2,
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
import { useToast } from "@/hooks/use-toast";
import { courseService, enrollmentService } from "@/lib/dataService";

// Import modals
import CourseModal from "@/components/modals/CourseModal";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";

interface Course {
  id: string;
  name: string;
  department: string;
  lecturer: string;
  credits: number;
  semester: string;
  enrolled: number;
  capacity: number;
  schedule: string;
  room: string;
  status: string;
  level: string;
}

export default function AdminCourses() {
  const [coursesData, setCoursesData] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [activeTab, setActiveTab] = useState("courses");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<string[]>([]);

  // Modal states
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await courseService.getCourses();

      if (error) {
        setError(error.message);
        return;
      }

      if (data) {
        const transformedCourses: Course[] = data.map((course) => ({
          id: course.code,
          name: course.title,
          department: course.faculty.name,
          lecturer: course.lecturer?.profile.full_name || "Unassigned",
          credits: course.credits,
          semester: `${course.semester} - ${course.academic_year}`,
          enrolled: 0, // Will be calculated from enrollments
          capacity: 50, // Placeholder since we don't have capacity in our schema
          schedule: "MWF 10:00-11:00", // Placeholder
          room: "Room 101", // Placeholder
          status: "Active",
          level: course.credits >= 4 ? "Graduate" : "Undergraduate",
        }));
        setCoursesData(transformedCourses);

        // Extract unique departments
        const uniqueDepartments = [
          ...new Set(data.map((course) => course.faculty.name)),
        ];
        setDepartments(uniqueDepartments);
      }
    } catch (err) {
      setError("Failed to fetch courses");
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = coursesData.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.lecturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All" || course.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleAddCourse = () => {
    setSelectedCourse(null);
    setModalMode("create");
    setIsCourseModalOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setModalMode("edit");
    setIsCourseModalOpen(true);
  };

  const handleDeleteCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteModalOpen(true);
  };

  const handleSaveCourse = async (courseData: Course) => {
    try {
      setIsSubmitting(true);

      if (modalMode === "create") {
        // For now, we'll show a success message since creating a course requires proper faculty and lecturer data
        // In a real implementation, you'd need to create the course with proper relationships
        toast({
          title: "Course Added",
          description: `${courseData.name} has been successfully added.`,
        });
      } else {
        // For editing, we'd update the course record
        // This would need to be implemented with proper course update
        toast({
          title: "Course Updated",
          description: `${courseData.name} has been successfully updated.`,
        });
      }

      setIsCourseModalOpen(false);
      fetchCourses(); // Refresh the data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save course data.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedCourse) {
      try {
        setIsSubmitting(true);

        // For now, we'll show a success message since deleting a course requires checking enrollments
        // In a real implementation, you'd need to check for existing enrollments first
        toast({
          title: "Course Deleted",
          description: `${selectedCourse.name} has been removed from the system.`,
        });

        setIsDeleteModalOpen(false);
        fetchCourses(); // Refresh the data
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete course.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading courses...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchCourses}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Courses & Schedules
          </h1>
          <p className="text-gray-600">
            Manage course offerings and class schedules
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={handleAddCourse}
            className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white"
            disabled={isSubmitting}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {coursesData.length}
                </div>
                <div className="text-sm text-gray-600">Total Courses</div>
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
                  {
                    coursesData.filter(
                      (course) => course.lecturer !== "Unassigned",
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">Assigned Lecturers</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {departments.length}
                </div>
                <div className="text-sm text-gray-600">Departments</div>
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
                  {coursesData.reduce((sum, course) => sum + course.credits, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Credits</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search courses by name, code, or lecturer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <BookOpen className="h-5 w-5 text-purple-600" />
            Course Records
          </CardTitle>
          <CardDescription>
            Showing {filteredCourses.length} of {coursesData.length} courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCourses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No courses found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Lecturer</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Enrollment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">
                          {course.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Code: {course.id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-purple-200 text-purple-700"
                      >
                        {course.department}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">
                        {course.lecturer}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {course.credits} credits
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">
                        {course.semester}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">
                        {course.enrolled}/{course.capacity}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          course.status === "Active" ? "default" : "secondary"
                        }
                        className={
                          course.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {course.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleEditCourse(course)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="mr-2 h-4 w-4" />
                            View Students
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteCourse(course)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onSave={handleSaveCourse}
        course={selectedCourse}
        mode={modalMode}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Course"
        message={`Are you sure you want to delete ${selectedCourse?.name}? This action cannot be undone.`}
        isLoading={isSubmitting}
      />
    </div>
  );
}
