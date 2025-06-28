"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { BookOpen, User, Clock, Calendar, MapPin, Users } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Course {
  id?: string;
  name: string;
  code: string;
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
  description?: string;
  prerequisites?: string;
}

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Course) => void;
  course?: Course | null;
  mode: "create" | "edit";
}

export default function CourseModal({
  isOpen,
  onClose,
  onSave,
  course,
  mode,
}: CourseModalProps) {
  const [formData, setFormData] = useState<Course>({
    name: "",
    code: "",
    department: "",
    lecturer: "",
    credits: 3,
    semester: "Fall 2024",
    enrolled: 0,
    capacity: 30,
    schedule: "",
    room: "",
    status: "Active",
    level: "Undergraduate",
    description: "",
    prerequisites: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (course && mode === "edit") {
      setFormData(course);
    } else {
      setFormData({
        name: "",
        code: "",
        department: "",
        lecturer: "",
        credits: 3,
        semester: "Fall 2024",
        enrolled: 0,
        capacity: 30,
        schedule: "",
        room: "",
        status: "Active",
        level: "Undergraduate",
        description: "",
        prerequisites: "",
      });
    }
    setErrors({});
  }, [course, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Course name is required";
    if (!formData.code.trim()) newErrors.code = "Course code is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.lecturer.trim()) newErrors.lecturer = "Lecturer is required";
    if (formData.credits < 1 || formData.credits > 6)
      newErrors.credits = "Credits must be between 1 and 6";
    if (formData.capacity < 1)
      newErrors.capacity = "Capacity must be at least 1";
    if (!formData.schedule.trim()) newErrors.schedule = "Schedule is required";
    if (!formData.room.trim()) newErrors.room = "Room is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleChange = (field: keyof Course, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            {mode === "create" ? "Add New Course" : "Edit Course"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Course Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Course Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter course name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Course Code */}
            <div className="space-y-2">
              <Label htmlFor="code">Course Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  handleChange("code", e.target.value.toUpperCase())
                }
                placeholder="e.g., CS101"
                className={errors.code ? "border-red-500" : ""}
              />
              {errors.code && (
                <p className="text-sm text-red-500">{errors.code}</p>
              )}
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label>Department *</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => handleChange("department", value)}
              >
                <SelectTrigger
                  className={errors.department ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Computer Science">
                    Computer Science
                  </SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Biology">Biology</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                </SelectContent>
              </Select>
              {errors.department && (
                <p className="text-sm text-red-500">{errors.department}</p>
              )}
            </div>

            {/* Lecturer */}
            <div className="space-y-2">
              <Label htmlFor="lecturer" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Lecturer *
              </Label>
              <Input
                id="lecturer"
                value={formData.lecturer}
                onChange={(e) => handleChange("lecturer", e.target.value)}
                placeholder="Enter lecturer name"
                className={errors.lecturer ? "border-red-500" : ""}
              />
              {errors.lecturer && (
                <p className="text-sm text-red-500">{errors.lecturer}</p>
              )}
            </div>

            {/* Credits */}
            <div className="space-y-2">
              <Label htmlFor="credits">Credits *</Label>
              <Input
                id="credits"
                type="number"
                min="1"
                max="6"
                value={formData.credits}
                onChange={(e) =>
                  handleChange("credits", Number.parseInt(e.target.value) || 3)
                }
                className={errors.credits ? "border-red-500" : ""}
              />
              {errors.credits && (
                <p className="text-sm text-red-500">{errors.credits}</p>
              )}
            </div>

            {/* Semester */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Semester
              </Label>
              <Select
                value={formData.semester}
                onValueChange={(value) => handleChange("semester", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                  <SelectItem value="Spring 2025">Spring 2025</SelectItem>
                  <SelectItem value="Summer 2025">Summer 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Capacity */}
            <div className="space-y-2">
              <Label htmlFor="capacity" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Capacity *
              </Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) =>
                  handleChange(
                    "capacity",
                    Number.parseInt(e.target.value) || 30,
                  )
                }
                className={errors.capacity ? "border-red-500" : ""}
              />
              {errors.capacity && (
                <p className="text-sm text-red-500">{errors.capacity}</p>
              )}
            </div>

            {/* Enrolled */}
            <div className="space-y-2">
              <Label htmlFor="enrolled">Currently Enrolled</Label>
              <Input
                id="enrolled"
                type="number"
                min="0"
                value={formData.enrolled}
                onChange={(e) =>
                  handleChange("enrolled", Number.parseInt(e.target.value) || 0)
                }
              />
            </div>

            {/* Schedule */}
            <div className="space-y-2">
              <Label htmlFor="schedule" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Schedule *
              </Label>
              <Input
                id="schedule"
                value={formData.schedule}
                onChange={(e) => handleChange("schedule", e.target.value)}
                placeholder="e.g., MWF 10:00-11:00"
                className={errors.schedule ? "border-red-500" : ""}
              />
              {errors.schedule && (
                <p className="text-sm text-red-500">{errors.schedule}</p>
              )}
            </div>

            {/* Room */}
            <div className="space-y-2">
              <Label htmlFor="room" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Room *
              </Label>
              <Input
                id="room"
                value={formData.room}
                onChange={(e) => handleChange("room", e.target.value)}
                placeholder="e.g., CS-201"
                className={errors.room ? "border-red-500" : ""}
              />
              {errors.room && (
                <p className="text-sm text-red-500">{errors.room}</p>
              )}
            </div>

            {/* Level */}
            <div className="space-y-2">
              <Label>Level</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => handleChange("level", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="Graduate">Graduate</SelectItem>
                  <SelectItem value="Doctoral">Doctoral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Course Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter course description..."
              rows={3}
            />
          </div>

          {/* Prerequisites */}
          <div className="space-y-2">
            <Label htmlFor="prerequisites">Prerequisites</Label>
            <Input
              id="prerequisites"
              value={formData.prerequisites || ""}
              onChange={(e) => handleChange("prerequisites", e.target.value)}
              placeholder="e.g., MATH101, CS100"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {mode === "create" ? "Add Course" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
