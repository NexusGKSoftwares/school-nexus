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
import { CalendarIcon, Loader2, Send } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Message {
  id?: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  content: string;
  message_type: "personal" | "announcement" | "notification" | "support";
  priority: "low" | "medium" | "high" | "urgent";
  status: "draft" | "sent" | "delivered" | "read" | "archived";
  sent_date?: Date;
  read_date?: Date;
  is_important: boolean;
  created_at?: string;
  updated_at?: string;
}

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Message) => void;
  message?: Message | null;
  users: Array<{ id: string; name: string; email: string; role: string }>;
  currentUserId: string;
  isLoading?: boolean;
}

export function MessageModal({
  isOpen,
  onClose,
  onSave,
  message,
  users,
  currentUserId,
  isLoading = false,
}: MessageModalProps) {
  const [formData, setFormData] = useState<Message>({
    sender_id: currentUserId,
    recipient_id: "",
    subject: "",
    content: "",
    message_type: "personal",
    priority: "medium",
    status: "draft",
    sent_date: undefined,
    read_date: undefined,
    is_important: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (message) {
      setFormData({
        ...message,
        sent_date: message.sent_date ? new Date(message.sent_date) : undefined,
        read_date: message.read_date ? new Date(message.read_date) : undefined,
      });
    } else {
      setFormData({
        sender_id: currentUserId,
        recipient_id: "",
        subject: "",
        content: "",
        message_type: "personal",
        priority: "medium",
        status: "draft",
        sent_date: undefined,
        read_date: undefined,
        is_important: false,
      });
    }
    setErrors({});
  }, [message, isOpen, currentUserId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.recipient_id) {
      newErrors.recipient_id = "Recipient is required";
    }
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    if (!formData.content.trim()) {
      newErrors.content = "Message content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // If sending the message, set sent_date to current time
      if (formData.status === "sent" && !formData.sent_date) {
        formData.sent_date = new Date();
      }
      onSave(formData);
    }
  };

  const handleInputChange = (field: keyof Message, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSend = () => {
    if (validateForm()) {
      setFormData((prev) => ({
        ...prev,
        status: "sent",
        sent_date: new Date(),
      }));
      onSave({ ...formData, status: "sent", sent_date: new Date() });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600";
      case "high":
        return "text-orange-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {message ? "Edit Message" : "Compose New Message"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recipient_id">To</Label>
              <Select
                value={formData.recipient_id}
                onValueChange={(value) =>
                  handleInputChange("recipient_id", value)
                }
              >
                <SelectTrigger
                  className={cn(errors.recipient_id && "border-red-500")}
                >
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  {users
                    .filter((user) => user.id !== currentUserId)
                    .map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email}) - {user.role}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.recipient_id && (
                <p className="text-sm text-red-500">{errors.recipient_id}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message_type">Message Type</Label>
              <Select
                value={formData.message_type}
                onValueChange={(value) =>
                  handleInputChange("message_type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal Message</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="notification">Notification</SelectItem>
                  <SelectItem value="support">Support Request</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low" className="text-green-600">
                    Low
                  </SelectItem>
                  <SelectItem value="medium" className="text-yellow-600">
                    Medium
                  </SelectItem>
                  <SelectItem value="high" className="text-orange-600">
                    High
                  </SelectItem>
                  <SelectItem value="urgent" className="text-red-600">
                    Urgent
                  </SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              type="text"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              placeholder="Enter message subject"
              className={cn(errors.subject && "border-red-500")}
            />
            {errors.subject && (
              <p className="text-sm text-red-500">{errors.subject}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Message Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="Type your message here..."
              rows={8}
              className={cn(errors.content && "border-red-500")}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_important"
              checked={formData.is_important}
              onChange={(e) =>
                handleInputChange("is_important", e.target.checked)
              }
              className="rounded"
            />
            <Label htmlFor="is_important">Mark as Important</Label>
          </div>

          {/* Message Preview */}
          {formData.subject || formData.content ? (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Message Preview</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">To:</span>
                  <span className="text-gray-600 ml-2">
                    {users.find((u) => u.id === formData.recipient_id)?.name ||
                      "Not selected"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Subject:</span>
                  <span className="text-gray-600 ml-2">
                    {formData.subject || "No subject"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Priority:</span>
                  <span
                    className={cn(
                      "ml-2 font-medium",
                      getPriorityColor(formData.priority),
                    )}
                  >
                    {formData.priority.charAt(0).toUpperCase() +
                      formData.priority.slice(1)}
                  </span>
                </div>
                {formData.content && (
                  <div>
                    <span className="font-medium">Content:</span>
                    <p className="text-gray-600 mt-1 text-xs line-clamp-3">
                      {formData.content}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" variant="outline" onClick={handleSubmit}>
              Save Draft
            </Button>
            <Button
              type="button"
              onClick={handleSend}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
