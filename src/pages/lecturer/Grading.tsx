"use client";

import {
  BarChart3,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { gradeService, courseService } from "@/lib/dataService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Grade {
  id: string;
  student_id: string;
  course_id: string;
  assignment_id?: string;
  quiz_id?: string;
  score: number;
  max_score: number;
  feedback: string;
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
  assignment?: {
    title: string;
  };
  quiz?: {
    title: string;
  };
}

interface CourseGradeSummary {
  course: string;
  totalStudents: number;
  graded: number;
  pending: number;
  avgGrade: number;
}

export default function LecturerGrading() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [courseSummaries, setCourseSummaries] = useState<CourseGradeSummary[]>(
    [],
  );
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

      // Fetch grades for the logged-in lecturer
      const { data: gradesData, error: gradesError } =
        await gradeService.getGradesByLecturer(user.id);

      if (gradesError) {
        setError(gradesError.message);
        return;
      }

      // Fetch courses for the lecturer
      const { data: coursesData, error: coursesError } =
        await courseService.getCoursesByLecturer(user.id);

      if (coursesError) {
        setError(coursesError.message);
        return;
      }

      if (gradesData) {
        setGrades(gradesData);

        // Generate course summaries
        if (coursesData) {
          const summaries: CourseGradeSummary[] = coursesData.map((course) => {
            const courseGrades = gradesData.filter(
              (g) => g.course_id === course.id,
            );
            const graded = courseGrades.filter(
              (g) => g.status === "graded",
            ).length;
            const pending = courseGrades.filter(
              (g) => g.status === "pending",
            ).length;
            const avgGrade =
              graded > 0
                ? Math.round(
                    courseGrades
                      .filter((g) => g.status === "graded")
                      .reduce(
                        (sum, g) => sum + (g.score / g.max_score) * 100,
                        0,
                      ) / graded,
                  )
                : 0;

            return {
              course: course.code,
              totalStudents: course.enrolled_students || 0,
              graded,
              pending,
              avgGrade,
            };
          });
          setCourseSummaries(summaries);
        }
      }
    } catch (err) {
      setError("Failed to fetch grading data");
      console.error("Error fetching grading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGrade = async (
    gradeId: string,
    score: number,
    feedback: string,
  ) => {
    try {
      const { error } = await gradeService.updateGrade(gradeId, {
        score,
        feedback,
        status: "graded",
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
        description: "Grade updated successfully",
      });

      // Refresh the data
      fetchData();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update grade",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "graded":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-orange-600" />;
      case "in_review":
        return <AlertTriangle className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "graded":
        return "bg-green-500";
      case "pending":
        return "bg-orange-500";
      case "in_review":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading grading data...</span>
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

  const totalSubmissions = grades.length;
  const pendingGrading = grades.filter((g) => g.status === "pending").length;
  const gradedSubmissions = grades.filter((g) => g.status === "graded").length;
  const inReview = grades.filter((g) => g.status === "in_review").length;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Grading & Results
          </h1>
          <p className="text-gray-600">
            Review submissions and manage student grades
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
          <BarChart3 className="h-4 w-4 mr-2" />
          Grade Analytics
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {totalSubmissions}
                </div>
                <div className="text-sm text-gray-600">Total Submissions</div>
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
                  {pendingGrading}
                </div>
                <div className="text-sm text-gray-600">Pending Grading</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-green-600 text-white">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {gradedSubmissions}
                </div>
                <div className="text-sm text-gray-600">Graded</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {inReview}
                </div>
                <div className="text-sm text-gray-600">In Review</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Course Progress */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Course Progress
            </CardTitle>
            <CardDescription>Grading progress by course</CardDescription>
          </CardHeader>
          <CardContent>
            {courseSummaries.length === 0 ? (
              <div className="text-center py-4">
                <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">
                  No course data available
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {courseSummaries.map((summary, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {summary.course}
                      </span>
                      <span className="text-sm text-gray-500">
                        {summary.graded}/{summary.totalStudents}
                      </span>
                    </div>
                    <Progress
                      value={(summary.graded / summary.totalStudents) * 100}
                      className="h-2"
                    />
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Avg: {summary.avgGrade}%</span>
                      <span>{summary.pending} pending</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Grading Table */}
        <Card className="lg:col-span-3 bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <FileText className="h-5 w-5 text-blue-600" />
              Submissions to Grade
            </CardTitle>
            <CardDescription>
              Review and grade student submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {grades.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No submissions to grade.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Assignment/Quiz</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.map((grade) => (
                    <TableRow key={grade.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">
                            {grade.student
                              ? `${grade.student.first_name} ${grade.student.last_name}`
                              : "Unknown Student"}
                          </div>
                          <div className="text-sm text-gray-600">
                            {grade.student?.profile?.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">
                            {grade.assignment?.title ||
                              grade.quiz?.title ||
                              "Unknown"}
                          </div>
                          <div className="text-sm text-gray-600">
                            {grade.assignment ? "Assignment" : "Quiz"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {grade.course?.code || "Unknown"}
                      </TableCell>
                      <TableCell>
                        {new Date(grade.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {grade.status === "graded" ? (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {grade.score}/{grade.max_score}
                            </span>
                            <span className="text-sm text-gray-500">
                              (
                              {Math.round(
                                (grade.score / grade.max_score) * 100,
                              )}
                              %)
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500">Not graded</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(grade.status)}
                          <Badge className={getStatusColor(grade.status)}>
                            {grade.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
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
