"use client";

import { useState, useEffect } from "react";
import {
  ClipboardCheck,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
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
import { examService, courseService } from "@/lib/dataService";
import { ExamModal } from "@/components/modals/ExamModal";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";
import { useToast } from "@/hooks/use-toast";

interface Exam {
  id: string;
  title: string;
  course: string;
  date: string;
  time: string;
  duration: string;
  questions: number;
  totalStudents: number;
  status: string;
}

export default function AdminExams() {
  const [examsData, setExamsData] = useState<Exam[]>([]);
  const [courseList, setCourseList] = useState<string[]>(["All Courses"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch exams
      const { data: exams, error: examsError } = await examService.getExams();

      if (examsError) {
        setError(examsError.message);
        return;
      }

      // Fetch courses for additional data
      const { data: courses } = await courseService.getCourses();

      if (exams) {
        const transformedExams: Exam[] = exams.map((exam) => {
          const course = courses?.find((c) => c.id === exam.course_id);

          return {
            id: exam.id,
            title: exam.title,
            course: course?.name || "Unknown Course",
            date: exam.exam_date
              ? new Date(exam.exam_date).toISOString().split("T")[0]
              : "TBD",
            time: exam.start_time || "TBD",
            duration: exam.duration ? `${exam.duration} hours` : "TBD",
            questions: exam.total_questions || 0,
            totalStudents: exam.total_students || 0,
            status: exam.status,
          };
        });
        setExamsData(transformedExams);

        // Generate course list for filtering
        const uniqueCourses = Array.from(
          new Set(transformedExams.map((exam) => exam.course)),
        );
        setCourseList(["All Courses", ...uniqueCourses]);
      }
    } catch (err) {
      setError("Failed to fetch exam data");
      console.error("Error fetching exam data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredExams = examsData.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse =
      selectedCourse === "All Courses" || exam.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const handleCreateExam = () => {
    setSelectedExam(null);
    setIsExamModalOpen(true);
  };

  const handleEditExam = (exam: Exam) => {
    setSelectedExam({
      id: exam.id,
      title: exam.title,
      course_id: "", // You may want to map course name to id if available
      exam_date: exam.date ? new Date(exam.date) : new Date(),
      start_time: exam.time,
      duration: parseInt(exam.duration),
      total_questions: exam.questions,
      status: exam.status,
      notes: "",
    });
    setIsExamModalOpen(true);
  };

  const handleDeleteExam = (exam: Exam) => {
    setSelectedExam(exam);
    setIsDeleteModalOpen(true);
  };

  const handleSaveExam = async (data: any) => {
    try {
      setIsSubmitting(true);
      if (selectedExam) {
        // Update
        const { error } = await examService.updateExam(selectedExam.id, data);
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        toast({ title: "Success", description: "Exam updated successfully" });
      } else {
        // Create
        const { error } = await examService.createExam(data);
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        toast({ title: "Success", description: "Exam created successfully" });
      }
      setIsExamModalOpen(false);
      fetchData();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save exam",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedExam) return;
    try {
      setIsSubmitting(true);
      const { error } = await examService.deleteExam(selectedExam.id);
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      toast({ title: "Success", description: "Exam deleted successfully" });
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete exam",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading exam data...</span>
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

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Exams & Results Management
          </h1>
          <p className="text-gray-600">
            Manage exam schedules, grading, and student results
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={handleCreateExam}
            className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Exam
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search exams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-blue-200 focus:border-blue-400"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-blue-200 hover:bg-blue-50"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {selectedCourse}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Course</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {courseList.map((course) => (
                  <DropdownMenuItem
                    key={course}
                    onClick={() => setSelectedCourse(course)}
                  >
                    {course}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Exams Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <ClipboardCheck className="h-5 w-5 text-blue-600" />
            Exam Schedule
          </CardTitle>
          <CardDescription>Manage and view all scheduled exams</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredExams.length === 0 ? (
            <div className="text-center py-8">
              <ClipboardCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                No exams found matching your criteria.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exam Title</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">
                          {exam.title}
                        </div>
                        <div className="text-sm text-gray-600">{exam.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>{exam.course}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">
                          {exam.date}
                        </div>
                        <div className="text-sm text-gray-600">{exam.time}</div>
                      </div>
                    </TableCell>
                    <TableCell>{exam.duration}</TableCell>
                    <TableCell>{exam.questions}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{exam.totalStudents}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">{exam.status}</Badge>
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
                          <DropdownMenuItem
                            onClick={() => handleEditExam(exam)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Exam
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="mr-2 h-4 w-4" />
                            View Results
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteExam(exam)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Exam
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
      <ExamModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        onSave={handleSaveExam}
        exam={selectedExam}
        courses={courseList
          .filter((c) => c !== "All Courses")
          .map((c) => ({ id: c, name: c, code: c }))}
        isLoading={isSubmitting}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Exam"
        description={`Are you sure you want to delete the exam "${selectedExam?.title || ""}"? This action cannot be undone.`}
        isLoading={isSubmitting}
        itemName={""}
      />
    </div>
  );
}
