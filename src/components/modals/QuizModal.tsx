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
import { CalendarIcon, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Quiz {
  id?: string;
  title: string;
  course_id: string;
  description: string;
  quiz_date: Date;
  duration_minutes: number;
  total_questions: number;
  total_marks: number;
  passing_marks: number;
  quiz_type: "multiple_choice" | "true_false" | "essay" | "mixed";
  attempts_allowed: number;
  is_randomized: boolean;
  show_results: boolean;
  status: "draft" | "published" | "active" | "completed" | "archived";
  created_at?: string;
  updated_at?: string;
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Quiz) => void;
  quiz?: Quiz | null;
  courses: Array<{ id: string; name: string; code: string }>;
  isLoading?: boolean;
}

export function QuizModal({
  isOpen,
  onClose,
  onSave,
  quiz,
  courses,
  isLoading = false,
}: QuizModalProps) {
  const [formData, setFormData] = useState<Quiz>({
    title: "",
    course_id: "",
    description: "",
    quiz_date: new Date(),
    duration_minutes: 30,
    total_questions: 10,
    total_marks: 100,
    passing_marks: 50,
    quiz_type: "multiple_choice",
    attempts_allowed: 1,
    is_randomized: false,
    show_results: true,
    status: "draft",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (quiz) {
      setFormData({
        ...quiz,
        quiz_date: quiz.quiz_date ? new Date(quiz.quiz_date) : new Date(),
      });
    } else {
      setFormData({
        title: "",
        course_id: "",
        description: "",
        quiz_date: new Date(),
        duration_minutes: 30,
        total_questions: 10,
        total_marks: 100,
        passing_marks: 50,
        quiz_type: "multiple_choice",
        attempts_allowed: 1,
        is_randomized: false,
        show_results: true,
        status: "draft",
      });
    }
    setErrors({});
  }, [quiz, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Quiz title is required";
    }
    if (!formData.course_id) {
      newErrors.course_id = "Course is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (formData.duration_minutes <= 0) {
      newErrors.duration_minutes = "Duration must be greater than 0";
    }
    if (formData.total_questions <= 0) {
      newErrors.total_questions = "Total questions must be greater than 0";
    }
    if (formData.total_marks <= 0) {
      newErrors.total_marks = "Total marks must be greater than 0";
    }
    if (formData.passing_marks <= 0) {
      newErrors.passing_marks = "Passing marks must be greater than 0";
    }
    if (formData.passing_marks > formData.total_marks) {
      newErrors.passing_marks = "Passing marks cannot exceed total marks";
    }
    if (formData.attempts_allowed <= 0) {
      newErrors.attempts_allowed = "Attempts allowed must be greater than 0";
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

  const handleInputChange = (field: keyof Quiz, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{quiz ? "Edit Quiz" : "Add New Quiz"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Quiz Title</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter quiz title"
              className={cn(errors.title && "border-red-500")}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="quiz_type">Quiz Type</Label>
              <Select
                value={formData.quiz_type}
                onValueChange={(value) => handleInputChange("quiz_type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple_choice">
                    Multiple Choice
                  </SelectItem>
                  <SelectItem value="true_false">True/False</SelectItem>
                  <SelectItem value="essay">Essay</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quiz_date">Quiz Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.quiz_date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.quiz_date ? (
                      format(formData.quiz_date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.quiz_date}
                    onSelect={(date) => handleInputChange("quiz_date", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration_minutes">Duration (minutes)</Label>
              <Input
                id="duration_minutes"
                type="number"
                min="1"
                value={formData.duration_minutes}
                onChange={(e) =>
                  handleInputChange(
                    "duration_minutes",
                    parseInt(e.target.value) || 0,
                  )
                }
                className={cn(errors.duration_minutes && "border-red-500")}
              />
              {errors.duration_minutes && (
                <p className="text-sm text-red-500">
                  {errors.duration_minutes}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_questions">Total Questions</Label>
              <Input
                id="total_questions"
                type="number"
                min="1"
                value={formData.total_questions}
                onChange={(e) =>
                  handleInputChange(
                    "total_questions",
                    parseInt(e.target.value) || 0,
                  )
                }
                className={cn(errors.total_questions && "border-red-500")}
              />
              {errors.total_questions && (
                <p className="text-sm text-red-500">{errors.total_questions}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_marks">Total Marks</Label>
              <Input
                id="total_marks"
                type="number"
                min="1"
                value={formData.total_marks}
                onChange={(e) =>
                  handleInputChange(
                    "total_marks",
                    parseInt(e.target.value) || 0,
                  )
                }
                className={cn(errors.total_marks && "border-red-500")}
              />
              {errors.total_marks && (
                <p className="text-sm text-red-500">{errors.total_marks}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="passing_marks">Passing Marks</Label>
              <Input
                id="passing_marks"
                type="number"
                min="1"
                value={formData.passing_marks}
                onChange={(e) =>
                  handleInputChange(
                    "passing_marks",
                    parseInt(e.target.value) || 0,
                  )
                }
                className={cn(errors.passing_marks && "border-red-500")}
              />
              {errors.passing_marks && (
                <p className="text-sm text-red-500">{errors.passing_marks}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="attempts_allowed">Attempts Allowed</Label>
              <Input
                id="attempts_allowed"
                type="number"
                min="1"
                value={formData.attempts_allowed}
                onChange={(e) =>
                  handleInputChange(
                    "attempts_allowed",
                    parseInt(e.target.value) || 0,
                  )
                }
                className={cn(errors.attempts_allowed && "border-red-500")}
              />
              {errors.attempts_allowed && (
                <p className="text-sm text-red-500">
                  {errors.attempts_allowed}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_randomized"
                checked={formData.is_randomized}
                onChange={(e) =>
                  handleInputChange("is_randomized", e.target.checked)
                }
                className="rounded"
              />
              <Label htmlFor="is_randomized">Randomize Questions</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="show_results"
                checked={formData.show_results}
                onChange={(e) =>
                  handleInputChange("show_results", e.target.checked)
                }
                className="rounded"
              />
              <Label htmlFor="show_results">Show Results to Students</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter quiz description and instructions..."
              rows={4}
              className={cn(errors.description && "border-red-500")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {quiz ? "Update" : "Create"} Quiz
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
