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

interface Registration {
  id?: string;
  student_id: string;
  course_id: string;
  registration_date: Date;
  status: "pending" | "approved" | "rejected" | "completed";
  semester: string;
  academic_year: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Registration) => void;
  registration?: Registration | null;
  students: Array<{ id: string; name: string; email: string }>;
  courses: Array<{ id: string; name: string; code: string }>;
  isLoading?: boolean;
}

export function RegistrationModal({
  isOpen,
  onClose,
  onSave,
  registration,
  students,
  courses,
  isLoading = false,
}: RegistrationModalProps) {
  const [formData, setFormData] = useState<Registration>({
    student_id: "",
    course_id: "",
    registration_date: new Date(),
    status: "pending",
    semester: "",
    academic_year: new Date().getFullYear().toString(),
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (registration) {
      setFormData({
        ...registration,
        registration_date: registration.registration_date
          ? new Date(registration.registration_date)
          : new Date(),
      });
    } else {
      setFormData({
        student_id: "",
        course_id: "",
        registration_date: new Date(),
        status: "pending",
        semester: "",
        academic_year: new Date().getFullYear().toString(),
        notes: "",
      });
    }
    setErrors({});
  }, [registration, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.student_id) {
      newErrors.student_id = "Student is required";
    }
    if (!formData.course_id) {
      newErrors.course_id = "Course is required";
    }
    if (!formData.semester) {
      newErrors.semester = "Semester is required";
    }
    if (!formData.academic_year) {
      newErrors.academic_year = "Academic year is required";
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

  const handleInputChange = (field: keyof Registration, value: any) => {
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
            {registration ? "Edit Registration" : "Add New Registration"}
          </DialogTitle>
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
              <Label htmlFor="registration_date">Registration Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.registration_date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.registration_date ? (
                      format(formData.registration_date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.registration_date}
                    onSelect={(date) =>
                      handleInputChange("registration_date", date)
                    }
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ""}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Additional notes about the registration..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {registration ? "Update" : "Create"} Registration
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
