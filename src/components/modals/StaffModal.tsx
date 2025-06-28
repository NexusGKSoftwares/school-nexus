import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface StaffForm {
  id?: string
  name: string
  email: string
  role: string
  department: string
}

interface StaffModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (staff: StaffForm) => void
  staff?: StaffForm | null
  departments: string[]
  mode: "create" | "edit"
}

const initialForm: StaffForm = {
  name: "",
  email: "",
  role: "",
  department: "",
}

export default function StaffModal({ isOpen, onClose, onSave, staff, departments, mode }: StaffModalProps) {
  const [formData, setFormData] = useState<StaffForm>(initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (staff && mode === "edit") {
      setFormData(staff)
    } else {
      setFormData(initialForm)
    }
    setErrors({})
  }, [staff, mode, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.role) newErrors.role = "Role is required"
    if (!formData.department) newErrors.department = "Department is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    onSave(formData)
    onClose()
  }

  const handleChange = (field: keyof StaffForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add Staff" : "Edit Staff"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" value={formData.name} onChange={e => handleChange("name", e.target.value)} className={errors.name ? "border-red-500" : ""} />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" value={formData.email} onChange={e => handleChange("email", e.target.value)} className={errors.email ? "border-red-500" : ""} />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label>Role *</Label>
            <Select value={formData.role} onValueChange={value => handleChange("role", value)}>
              <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
          </div>
          <div className="space-y-2">
            <Label>Department *</Label>
            <Select value={formData.department} onValueChange={value => handleChange("department", value)}>
              <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dep => <SelectItem key={dep} value={dep}>{dep}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
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