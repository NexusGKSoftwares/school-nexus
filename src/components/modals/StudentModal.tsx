"use client";

import type React from "react";
import type { Student } from "@/pages/admin/Students";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Calendar, GraduationCap } from "lucide-react";
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

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => Promise<void>;
  student?: Student | null;
  mode: "create" | "edit";
}

export default function StudentModal({
  isOpen,
  onClose,
  onSave,
  student,
  mode,
}: StudentModalProps) {
  const [formData, setFormData] = useState<Student>({
    id: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    year: "",
    gpa: 0,
    status: "Active",
    enrollmentDate: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (student && mode === "edit") {
      setFormData(student);
    } else {
      setFormData({
        id: "",
        name: "",
        email: "",
        phone: "",
        department: "",
        year: "",
        gpa: 0,
        status: "Active",
        enrollmentDate: new Date().toISOString().split("T")[0],
      });
    }
    setErrors({});
  }, [student, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.email.includes("@")) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.year) newErrors.year = "Year is required";
    if (formData.gpa < 0 || formData.gpa > 4)
      newErrors.gpa = "GPA must be between 0 and 4";

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

  const handleChange = (field: keyof Student, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            {mode === "create" ? "Add New Student" : "Edit Student"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter full name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Enter email address"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number *
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Enter phone number"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Department *
              </Label>
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

            {/* Year */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Academic Year *
              </Label>
              <Select
                value={formData.year}
                onValueChange={(value) => handleChange("year", value)}
              >
                <SelectTrigger className={errors.year ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st Year">1st Year</SelectItem>
                  <SelectItem value="2nd Year">2nd Year</SelectItem>
                  <SelectItem value="3rd Year">3rd Year</SelectItem>
                  <SelectItem value="4th Year">4th Year</SelectItem>
                  <SelectItem value="Graduate">Graduate</SelectItem>
                </SelectContent>
              </Select>
              {errors.year && (
                <p className="text-sm text-red-500">{errors.year}</p>
              )}
            </div>

            {/* GPA */}
            <div className="space-y-2">
              <Label htmlFor="gpa">GPA *</Label>
              <Input
                id="gpa"
                type="number"
                step="0.1"
                min="0"
                max="4"
                value={formData.gpa}
                onChange={(e) =>
                  handleChange("gpa", Number.parseFloat(e.target.value) || 0)
                }
                placeholder="Enter GPA (0.0 - 4.0)"
                className={errors.gpa ? "border-red-500" : ""}
              />
              {errors.gpa && (
                <p className="text-sm text-red-500">{errors.gpa}</p>
              )}
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
                  <SelectItem value="Probation">Probation</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                  <SelectItem value="Graduated">Graduated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Enrollment Date */}
            <div className="space-y-2">
              <Label htmlFor="enrollmentDate">Enrollment Date</Label>
              <Input
                id="enrollmentDate"
                type="date"
                value={formData.enrollmentDate}
                onChange={(e) => handleChange("enrollmentDate", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {mode === "create" ? "Add Student" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
