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

interface Exam {
  id?: string;
  title: string;
  course_id: string;
  exam_type: "midterm" | "final" | "quiz" | "assignment" | "project" | "other";
  exam_date: Date;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  total_marks: number;
  passing_marks: number;
  location?: string;
  instructions?: string;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  created_at?: string;
  updated_at?: string;
}

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Exam) => void;
  exam?: Exam | null;
  courses: Array<{ id: string; name: string; code: string }>;
  isLoading?: boolean;
}

export function ExamModal({
  isOpen,
  onClose,
  onSave,
  exam,
  courses,
  isLoading = false,
}: ExamModalProps) {
  const [formData, setFormData] = useState<Exam>({
    title: "",
    course_id: "",
    exam_type: "midterm",
    exam_date: new Date(),
    start_time: "09:00",
    end_time: "11:00",
    duration_minutes: 120,
    total_marks: 100,
    passing_marks: 50,
    location: "",
    instructions: "",
    status: "scheduled",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (exam) {
      setFormData({
        ...exam,
        exam_date: exam.exam_date ? new Date(exam.exam_date) : new Date(),
      });
    } else {
      setFormData({
        title: "",
        course_id: "",
        exam_type: "midterm",
        exam_date: new Date(),
        start_time: "09:00",
        end_time: "11:00",
        duration_minutes: 120,
        total_marks: 100,
        passing_marks: 50,
        location: "",
        instructions: "",
        status: "scheduled",
      });
    }
    setErrors({});
  }, [exam, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Exam title is required";
    }
    if (!formData.course_id) {
      newErrors.course_id = "Course is required";
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
    if (formData.duration_minutes <= 0) {
      newErrors.duration_minutes = "Duration must be greater than 0";
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

  const handleInputChange = (field: keyof Exam, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{exam ? "Edit Exam" : "Add New Exam"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Exam Title</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter exam title"
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
              <Label htmlFor="exam_type">Exam Type</Label>
              <Select
                value={formData.exam_type}
                onValueChange={(value) => handleInputChange("exam_type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="midterm">Midterm</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exam_date">Exam Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.exam_date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.exam_date ? (
                      format(formData.exam_date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.exam_date}
                    onSelect={(date) => handleInputChange("exam_date", date)}
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
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) =>
                  handleInputChange("start_time", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => handleInputChange("end_time", e.target.value)}
              />
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
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                type="text"
                value={formData.location || ""}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="e.g., Room 101, Building A"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions (Optional)</Label>
            <Textarea
              id="instructions"
              value={formData.instructions || ""}
              onChange={(e) =>
                handleInputChange("instructions", e.target.value)
              }
              placeholder="Enter exam instructions for students..."
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {exam ? "Update" : "Create"} Exam
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
