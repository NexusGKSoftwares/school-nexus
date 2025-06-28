import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface MaterialForm {
  id?: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  file_size: number;
  course_id: string;
  status: string;
}

interface MaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (material: MaterialForm) => void;
  material?: MaterialForm | null;
  courses: { id: string; code: string; name: string }[];
  mode: "create" | "edit";
}

const initialForm: MaterialForm = {
  title: "",
  description: "",
  file_url: "",
  file_type: "",
  file_size: 0,
  course_id: "",
  status: "draft",
};

export default function MaterialModal({
  isOpen,
  onClose,
  onSave,
  material,
  courses,
  mode,
}: MaterialModalProps) {
  const [formData, setFormData] = useState<MaterialForm>(initialForm);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (material && mode === "edit") {
      setFormData(material);
    } else {
      setFormData(initialForm);
    }
    setFile(null);
    setErrors({});
  }, [material, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.course_id) newErrors.course_id = "Course is required";
    if (mode === "create" && !file) newErrors.file = "File is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) {
      setFormData((prev) => ({
        ...prev,
        file_type: f.name.split(".").pop() || "",
        file_size: f.size,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsUploading(true);
    // In a real app, upload file to storage and get file_url
    // For now, just simulate file_url
    let file_url = formData.file_url;
    if (file) {
      file_url = `/uploads/${file.name}`;
    }
    onSave({ ...formData, file_url });
    setIsUploading(false);
    onClose();
  };

  const handleChange = (field: keyof MaterialForm, value: string | number) => {
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
            {mode === "create" ? "Upload Material" : "Edit Material"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter material title"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>
            {/* Course */}
            <div className="space-y-2">
              <Label>Course *</Label>
              <Select
                value={formData.course_id}
                onValueChange={(value) => handleChange("course_id", value)}
              >
                <SelectTrigger
                  className={errors.course_id ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.code} - {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.course_id && (
                <p className="text-sm text-red-500">{errors.course_id}</p>
              )}
            </div>
            {/* File */}
            <div className="space-y-2 md:col-span-2">
              <Label>File {mode === "create" && "*"}</Label>
              <Input type="file" accept="*" onChange={handleFileChange} />
              {errors.file && (
                <p className="text-sm text-red-500">{errors.file}</p>
              )}
              {file && (
                <p className="text-xs text-gray-500">
                  Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter description"
              />
            </div>
            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading
                ? "Saving..."
                : mode === "create"
                  ? "Upload"
                  : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
