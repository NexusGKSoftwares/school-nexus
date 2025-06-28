import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Grade {
  id?: string;
  student_id: string;
  course_id: string;
  assignment_id?: string;
  exam_id?: string;
  quiz_id?: string;
  grade_type:
    | "assignment"
    | "exam"
    | "quiz"
    | "project"
    | "participation"
    | "final";
  score: number;
  max_score: number;
  percentage: number;
  letter_grade: string;
  feedback?: string;
  graded_date: Date;
  graded_by: string;
  status: "pending" | "graded" | "published" | "disputed";
  created_at?: string;
  updated_at?: string;
}

interface GradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Grade) => void;
  grade?: Grade | null;
  students: Array<{ id: string; name: string; email: string }>;
  courses: Array<{ id: string; name: string; code: string }>;
  assignments?: Array<{ id: string; title: string; max_score: number }>;
  exams?: Array<{ id: string; title: string; total_marks: number }>;
  quizzes?: Array<{ id: string; title: string; total_marks: number }>;
  currentUserId: string;
  isLoading?: boolean;
}

export function GradingModal({
  isOpen,
  onClose,
  onSave,
  grade,
  students,
  courses,
  assignments = [],
  exams = [],
  quizzes = [],
  currentUserId,
  isLoading = false,
}: GradingModalProps) {
  const [formData, setFormData] = useState<Grade>({
    student_id: "",
    course_id: "",
    assignment_id: "",
    exam_id: "",
    quiz_id: "",
    grade_type: "assignment",
    score: 0,
    max_score: 100,
    percentage: 0,
    letter_grade: "",
    feedback: "",
    graded_date: new Date(),
    graded_by: currentUserId,
    status: "graded",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (grade) {
      setFormData({
        ...grade,
        graded_date: grade.graded_date
          ? new Date(grade.graded_date)
          : new Date(),
      });
    } else {
      setFormData({
        student_id: "",
        course_id: "",
        assignment_id: "",
        exam_id: "",
        quiz_id: "",
        grade_type: "assignment",
        score: 0,
        max_score: 100,
        percentage: 0,
        letter_grade: "",
        feedback: "",
        graded_date: new Date(),
        graded_by: currentUserId,
        status: "graded",
      });
    }
    setErrors({});
  }, [grade, isOpen, currentUserId]);

  // Calculate percentage and letter grade when score or max_score changes
  useEffect(() => {
    if (formData.max_score > 0) {
      const percentage = (formData.score / formData.max_score) * 100;
      setFormData((prev) => ({
        ...prev,
        percentage: Math.round(percentage * 100) / 100,
        letter_grade: calculateLetterGrade(percentage),
      }));
    }
  }, [formData.score, formData.max_score]);

  const calculateLetterGrade = (percentage: number): string => {
    if (percentage >= 93) return "A";
    if (percentage >= 90) return "A-";
    if (percentage >= 87) return "B+";
    if (percentage >= 83) return "B";
    if (percentage >= 80) return "B-";
    if (percentage >= 77) return "C+";
    if (percentage >= 73) return "C";
    if (percentage >= 70) return "C-";
    if (percentage >= 67) return "D+";
    if (percentage >= 63) return "D";
    if (percentage >= 60) return "D-";
    return "F";
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.student_id) {
      newErrors.student_id = "Student is required";
    }
    if (!formData.course_id) {
      newErrors.course_id = "Course is required";
    }
    if (formData.score < 0) {
      newErrors.score = "Score cannot be negative";
    }
    if (formData.score > formData.max_score) {
      newErrors.score = "Score cannot exceed maximum score";
    }
    if (formData.max_score <= 0) {
      newErrors.max_score = "Maximum score must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field: keyof Grade, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const getGradeTypeOptions = () => {
    const options = [
      { value: "assignment", label: "Assignment" },
      { value: "exam", label: "Exam" },
      { value: "quiz", label: "Quiz" },
      { value: "project", label: "Project" },
      { value: "participation", label: "Participation" },
      { value: "final", label: "Final Grade" },
    ];
    return options;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{grade ? "Edit Grade" : "Add New Grade"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="student_id">Student</Label>
              <Select
                value={formData.student_id}
                onValueChange={(value) =>
                  handleInputChange("student_id", value)
                }
              >
                <SelectTrigger
                  className={cn(errors.student_id && "border-red-500")}
                >
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} ({student.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.student_id && (
                <p className="text-sm text-red-500">{errors.student_id}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="course_id">Course</Label>
              <Select
                value={formData.course_id}
                onValueChange={(value) => handleInputChange("course_id", value)}
              >
                <SelectTrigger
                  className={cn(errors.course_id && "border-red-500")}
                >
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.code} - {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.course_id && (
                <p className="text-sm text-red-500">{errors.course_id}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade_type">Grade Type</Label>
              <Select
                value={formData.grade_type}
                onValueChange={(value) =>
                  handleInputChange("grade_type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getGradeTypeOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="graded">Graded</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="disputed">Disputed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="score">Score</Label>
              <Input
                id="score"
                type="number"
                step="0.01"
                min="0"
                value={formData.score}
                onChange={(e) =>
                  handleInputChange("score", parseFloat(e.target.value) || 0)
                }
                className={cn(errors.score && "border-red-500")}
              />
              {errors.score && (
                <p className="text-sm text-red-500">{errors.score}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_score">Maximum Score</Label>
              <Input
                id="max_score"
                type="number"
                step="0.01"
                min="0"
                value={formData.max_score}
                onChange={(e) =>
                  handleInputChange(
                    "max_score",
                    parseFloat(e.target.value) || 0,
                  )
                }
                className={cn(errors.max_score && "border-red-500")}
              />
              {errors.max_score && (
                <p className="text-sm text-red-500">{errors.max_score}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="percentage">Percentage</Label>
              <Input
                id="percentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.percentage}
                readOnly
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="letter_grade">Letter Grade</Label>
              <Input
                id="letter_grade"
                type="text"
                value={formData.letter_grade}
                readOnly
                className="bg-gray-50 font-semibold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="graded_date">Graded Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.graded_date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.graded_date ? (
                      format(formData.graded_date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.graded_date}
                    onSelect={(date) => handleInputChange("graded_date", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Conditional fields based on grade type */}
          {formData.grade_type === "assignment" && assignments.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="assignment_id">Assignment</Label>
              <Select
                value={formData.assignment_id || ""}
                onValueChange={(value) =>
                  handleInputChange("assignment_id", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No specific assignment</SelectItem>
                  {assignments.map((assignment) => (
                    <SelectItem key={assignment.id} value={assignment.id}>
                      {assignment.title} (Max: {assignment.max_score})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.grade_type === "exam" && exams.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="exam_id">Exam</Label>
              <Select
                value={formData.exam_id || ""}
                onValueChange={(value) => handleInputChange("exam_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select exam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No specific exam</SelectItem>
                  {exams.map((exam) => (
                    <SelectItem key={exam.id} value={exam.id}>
                      {exam.title} (Max: {exam.total_marks})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.grade_type === "quiz" && quizzes.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="quiz_id">Quiz</Label>
              <Select
                value={formData.quiz_id || ""}
                onValueChange={(value) => handleInputChange("quiz_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select quiz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No specific quiz</SelectItem>
                  {quizzes.map((quiz) => (
                    <SelectItem key={quiz.id} value={quiz.id}>
                      {quiz.title} (Max: {quiz.total_marks})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback (Optional)</Label>
            <Textarea
              id="feedback"
              value={formData.feedback || ""}
              onChange={(e) => handleInputChange("feedback", e.target.value)}
              placeholder="Provide feedback to the student..."
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {grade ? "Update" : "Create"} Grade
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
