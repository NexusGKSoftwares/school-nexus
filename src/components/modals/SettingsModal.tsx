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
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SystemSetting {
  id?: string;
  setting_key: string;
  setting_value: string;
  setting_type: "string" | "number" | "boolean" | "json" | "email" | "url";
  category:
    | "general"
    | "academic"
    | "financial"
    | "notification"
    | "security"
    | "email"
    | "system";
  description: string;
  is_public: boolean;
  is_required: boolean;
  validation_rules?: string;
  created_at?: string;
  updated_at?: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SystemSetting) => void;
  settingModal?: SystemSetting | null;
  isLoading?: boolean;
}

export function SettingsModal({
  isOpen,
  onClose,
  onSave,
  settingModal,
  isLoading = false,
}: SettingsModalProps) {
  const [formData, setFormData] = useState<SystemSetting>({
    setting_key: "",
    setting_value: "",
    setting_type: "string",
    category: "general",
    description: "",
    is_public: false,
    is_required: false,
    validation_rules: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (settingModal) {
      setFormData(settingModal);
    } else {
      setFormData({
        setting_key: "",
        setting_value: "",
        setting_type: "string",
        category: "general",
        description: "",
        is_public: false,
        is_required: false,
        validation_rules: "",
      });
    }
    setErrors({});
  }, [settingModal, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.setting_key.trim()) {
      newErrors.setting_key = "Setting key is required";
    }
    if (!formData.setting_value.trim()) {
      newErrors.setting_value = "Setting value is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    // Validate setting value based on type
    if (
      formData.setting_type === "number" &&
      isNaN(Number(formData.setting_value))
    ) {
      newErrors.setting_value = "Value must be a valid number";
    }
    if (
      formData.setting_type === "email" &&
      !isValidEmail(formData.setting_value)
    ) {
      newErrors.setting_value = "Value must be a valid email address";
    }
    if (
      formData.setting_type === "url" &&
      !isValidUrl(formData.setting_value)
    ) {
      newErrors.setting_value = "Value must be a valid URL";
    }
    if (
      formData.setting_type === "json" &&
      !isValidJson(formData.setting_value)
    ) {
      newErrors.setting_value = "Value must be valid JSON";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidJson = (json: string) => {
    try {
      JSON.parse(json);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field: keyof SystemSetting, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const renderValueInput = () => {
    switch (formData.setting_type) {
      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id="setting_value"
              checked={formData.setting_value === "true"}
              onCheckedChange={(checked) =>
                handleInputChange("setting_value", checked.toString())
              }
            />
            <Label htmlFor="setting_value">
              {formData.setting_value === "true" ? "Enabled" : "Disabled"}
            </Label>
          </div>
        );
      case "number":
        return (
          <Input
            id="setting_value"
            type="number"
            value={formData.setting_value}
            onChange={(e) => handleInputChange("setting_value", e.target.value)}
            placeholder="Enter numeric value"
            className={cn(errors.setting_value && "border-red-500")}
          />
        );
      case "email":
        return (
          <Input
            id="setting_value"
            type="email"
            value={formData.setting_value}
            onChange={(e) => handleInputChange("setting_value", e.target.value)}
            placeholder="Enter email address"
            className={cn(errors.setting_value && "border-red-500")}
          />
        );
      case "url":
        return (
          <Input
            id="setting_value"
            type="url"
            value={formData.setting_value}
            onChange={(e) => handleInputChange("setting_value", e.target.value)}
            placeholder="Enter URL"
            className={cn(errors.setting_value && "border-red-500")}
          />
        );
      case "json":
        return (
          <Textarea
            id="setting_value"
            value={formData.setting_value}
            onChange={(e) => handleInputChange("setting_value", e.target.value)}
            placeholder="Enter JSON value"
            rows={4}
            className={cn(errors.setting_value && "border-red-500")}
          />
        );
      default:
        return (
          <Input
            id="setting_value"
            type="text"
            value={formData.setting_value}
            onChange={(e) => handleInputChange("setting_value", e.target.value)}
            placeholder="Enter setting value"
            className={cn(errors.setting_value && "border-red-500")}
          />
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {settingModal ? "Edit Setting" : "Add New Setting"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="setting_key">Setting Key</Label>
              <Input
                id="setting_key"
                type="text"
                value={formData.setting_key}
                onChange={(e) =>
                  handleInputChange("setting_key", e.target.value)
                }
                placeholder="e.g., site_name, max_file_size"
                className={cn(errors.setting_key && "border-red-500")}
              />
              {errors.setting_key && (
                <p className="text-sm text-red-500">{errors.setting_key}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="setting_type">Setting Type</Label>
              <Select
                value={formData.setting_type}
                onValueChange={(value) =>
                  handleInputChange("setting_type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="url">URL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="notification">Notification</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="is_required">Required Setting</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_required"
                  checked={formData.is_required}
                  onCheckedChange={(checked) =>
                    handleInputChange("is_required", checked)
                  }
                />
                <Label htmlFor="is_required">
                  {formData.is_required ? "Required" : "Optional"}
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="setting_value">Setting Value</Label>
            {renderValueInput()}
            {errors.setting_value && (
              <p className="text-sm text-red-500">{errors.setting_value}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe what this setting controls..."
              rows={3}
              className={cn(errors.description && "border-red-500")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="validation_rules">
              Validation Rules (Optional)
            </Label>
            <Input
              id="validation_rules"
              type="text"
              value={formData.validation_rules || ""}
              onChange={(e) =>
                handleInputChange("validation_rules", e.target.value)
              }
              placeholder="e.g., min:1,max:100,regex:/^[a-zA-Z]+$/"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_public"
              checked={formData.is_public}
              onCheckedChange={(checked) =>
                handleInputChange("is_public", checked)
              }
            />
            <Label htmlFor="is_public">
              Public Setting (visible to all users)
            </Label>
          </div>

          {/* Setting Preview */}
          {formData.setting_key || formData.setting_value ? (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Setting Preview</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Key:</span>
                  <span className="text-gray-600 ml-2">
                    {formData.setting_key || "Not set"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Type:</span>
                  <span className="text-gray-600 ml-2 capitalize">
                    {formData.setting_type}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Category:</span>
                  <span className="text-gray-600 ml-2 capitalize">
                    {formData.category}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Value:</span>
                  <span className="text-gray-600 ml-2 font-mono text-xs">
                    {formData.setting_type === "json"
                      ? JSON.stringify(
                          JSON.parse(formData.setting_value || "{}"),
                          null,
                          2,
                        )
                      : formData.setting_value || "Not set"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <span className="text-gray-600 ml-2">
                    {formData.is_required ? "Required" : "Optional"} •
                    {formData.is_public ? " Public" : " Private"}
                  </span>
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
              {settingModal ? "Update" : "Create"} Setting
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
