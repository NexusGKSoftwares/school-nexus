import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface FacultyForm {
  id?: string
  name: string
  description: string
}

interface FacultyModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (faculty: FacultyForm) => void
  faculty?: FacultyForm | null
  mode: "create" | "edit"
  isLoading?: boolean
}

const initialForm: FacultyForm = {
  name: "",
  description: "",
}

export default function FacultyModal({ isOpen, onClose, onSave, faculty, mode }: FacultyModalProps) {
  const [formData, setFormData] = useState<FacultyForm>(initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (faculty && mode === "edit") {
      setFormData(faculty)
    } else {
      setFormData(initialForm)
    }
    setErrors({})
  }, [faculty, mode, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    onSave(formData)
    onClose()
  }

  const handleChange = (field: keyof FacultyForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add Faculty" : "Edit Faculty"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" value={formData.name} onChange={e => handleChange("name", e.target.value)} className={errors.name ? "border-red-500" : ""} />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={formData.description} onChange={e => handleChange("description", e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{mode === "create" ? "Add" : "Save Changes"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 