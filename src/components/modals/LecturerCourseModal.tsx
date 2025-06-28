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

interface LecturerCourse {
  id?: string;
  lecturer_id: string;
  course_id: string;
  academic_year: string;
  semester: string;
  start_date: Date;
  end_date: Date;
  max_students: number;
  current_students: number;
  status: "active" | "inactive" | "completed" | "cancelled";
  teaching_hours: number;
  office_hours?: string;
  syllabus_url?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

interface LecturerCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: LecturerCourse) => void;
  lecturerCourse?: LecturerCourse | null;
  courses: Array<{ id: string; name: string; code: string; credits: number }>;
  currentLecturerId: string;
  isLoading?: boolean;
}

export function LecturerCourseModal({
  isOpen,
  onClose,
  onSave,
  lecturerCourse,
  courses,
  currentLecturerId,
  isLoading = false,
}: LecturerCourseModalProps) {
  const [formData, setFormData] = useState<LecturerCourse>({
    lecturer_id: currentLecturerId,
    course_id: "",
    academic_year: new Date().getFullYear().toString(),
    semester: "",
    start_date: new Date(),
    end_date: new Date(),
    max_students: 30,
    current_students: 0,
    status: "active",
    teaching_hours: 3,
    office_hours: "",
    syllabus_url: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (lecturerCourse) {
      setFormData({
        ...lecturerCourse,
        start_date: lecturerCourse.start_date
          ? new Date(lecturerCourse.start_date)
          : new Date(),
        end_date: lecturerCourse.end_date
          ? new Date(lecturerCourse.end_date)
          : new Date(),
      });
    } else {
      setFormData({
        lecturer_id: currentLecturerId,
        course_id: "",
        academic_year: new Date().getFullYear().toString(),
        semester: "",
        start_date: new Date(),
        end_date: new Date(),
        max_students: 30,
        current_students: 0,
        status: "active",
        teaching_hours: 3,
        office_hours: "",
        syllabus_url: "",
        notes: "",
      });
    }
    setErrors({});
  }, [lecturerCourse, isOpen, currentLecturerId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.course_id) {
      newErrors.course_id = "Course is required";
    }
    if (!formData.semester) {
      newErrors.semester = "Semester is required";
    }
    if (!formData.academic_year) {
      newErrors.academic_year = "Academic year is required";
    }
    if (formData.max_students <= 0) {
      newErrors.max_students = "Maximum students must be greater than 0";
    }
    if (formData.current_students > formData.max_students) {
      newErrors.current_students =
        "Current students cannot exceed maximum students";
    }
    if (formData.teaching_hours <= 0) {
      newErrors.teaching_hours = "Teaching hours must be greater than 0";
    }
    if (formData.end_date <= formData.start_date) {
      newErrors.end_date = "End date must be after start date";
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

  const handleInputChange = (field: keyof LecturerCourse, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {lecturerCourse ? "Edit Course Assignment" : "Assign New Course"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                      {course.code} - {course.name} ({course.credits} credits)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.course_id && (
                <p className="text-sm text-red-500">{errors.course_id}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select
                value={formData.semester}
                onValueChange={(value) => handleInputChange("semester", value)}
              >
                <SelectTrigger
                  className={cn(errors.semester && "border-red-500")}
                >
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fall">Fall</SelectItem>
                  <SelectItem value="Spring">Spring</SelectItem>
                  <SelectItem value="Summer">Summer</SelectItem>
                </SelectContent>
              </Select>
              {errors.semester && (
                <p className="text-sm text-red-500">{errors.semester}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="academic_year">Academic Year</Label>
              <Input
                id="academic_year"
                type="text"
                value={formData.academic_year}
                onChange={(e) =>
                  handleInputChange("academic_year", e.target.value)
                }
                placeholder="e.g., 2024-2025"
                className={cn(errors.academic_year && "border-red-500")}
              />
              {errors.academic_year && (
                <p className="text-sm text-red-500">{errors.academic_year}</p>
              )}
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_students">Maximum Students</Label>
              <Input
                id="max_students"
                type="number"
                min="1"
                value={formData.max_students}
                onChange={(e) =>
                  handleInputChange(
                    "max_students",
                    parseInt(e.target.value) || 0,
                  )
                }
                className={cn(errors.max_students && "border-red-500")}
              />
              {errors.max_students && (
                <p className="text-sm text-red-500">{errors.max_students}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_students">Current Students</Label>
              <Input
                id="current_students"
                type="number"
                min="0"
                max={formData.max_students}
                value={formData.current_students}
                onChange={(e) =>
                  handleInputChange(
                    "current_students",
                    parseInt(e.target.value) || 0,
                  )
                }
                className={cn(errors.current_students && "border-red-500")}
              />
              {errors.current_students && (
                <p className="text-sm text-red-500">
                  {errors.current_students}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="teaching_hours">Teaching Hours per Week</Label>
              <Input
                id="teaching_hours"
                type="number"
                min="1"
                step="0.5"
                value={formData.teaching_hours}
                onChange={(e) =>
                  handleInputChange(
                    "teaching_hours",
                    parseFloat(e.target.value) || 0,
                  )
                }
                className={cn(errors.teaching_hours && "border-red-500")}
              />
              {errors.teaching_hours && (
                <p className="text-sm text-red-500">{errors.teaching_hours}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="office_hours">Office Hours (Optional)</Label>
              <Input
                id="office_hours"
                type="text"
                value={formData.office_hours || ""}
                onChange={(e) =>
                  handleInputChange("office_hours", e.target.value)
                }
                placeholder="e.g., Mon/Wed 2-4 PM"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.start_date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.start_date ? (
                      format(formData.start_date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.start_date}
                    onSelect={(date) => handleInputChange("start_date", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.end_date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.end_date ? (
                      format(formData.end_date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.end_date}
                    onSelect={(date) => handleInputChange("end_date", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.end_date && (
                <p className="text-sm text-red-500">{errors.end_date}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="syllabus_url">Syllabus URL (Optional)</Label>
            <Input
              id="syllabus_url"
              type="url"
              value={formData.syllabus_url || ""}
              onChange={(e) =>
                handleInputChange("syllabus_url", e.target.value)
              }
              placeholder="https://example.com/syllabus"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes || ""}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Additional notes about the course assignment..."
              rows={3}
            />
          </div>

          {/* Course Assignment Summary */}
          {formData.course_id ? (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Course Assignment Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Course:</span>
                  <p className="text-gray-600">
                    {courses.find((c) => c.id === formData.course_id)?.code ||
                      "Not selected"}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Semester:</span>
                  <p className="text-gray-600">
                    {formData.semester || "Not set"}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Students:</span>
                  <p className="text-gray-600">
                    {formData.current_students}/{formData.max_students}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <p className="text-gray-600 capitalize">{formData.status}</p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {lecturerCourse ? "Update" : "Assign"} Course
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
