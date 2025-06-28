import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Bell, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Notification {
  id?: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: 'info' | 'success' | 'warning' | 'error' | 'reminder' | 'announcement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'unread' | 'read' | 'archived';
  category: 'academic' | 'financial' | 'administrative' | 'personal' | 'system';
  action_url?: string;
  scheduled_date?: Date;
  read_date?: Date;
  is_important: boolean;
  created_at?: string;
  updated_at?: string;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Notification) => void;
  notification?: Notification | null;
  users: Array<{ id: string; name: string; email: string; role: string }>;
  isLoading?: boolean;
}

export function NotificationModal({
  isOpen,
  onClose,
  onSave,
  notification,
  users,
  isLoading = false
}: NotificationModalProps) {
  const [formData, setFormData] = useState<Notification>({
    user_id: '',
    title: '',
    message: '',
    notification_type: 'info',
    priority: 'medium',
    status: 'unread',
    category: 'administrative',
    action_url: '',
    scheduled_date: undefined,
    read_date: undefined,
    is_important: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (notification) {
      setFormData({
        ...notification,
        scheduled_date: notification.scheduled_date ? new Date(notification.scheduled_date) : undefined,
        read_date: notification.read_date ? new Date(notification.read_date) : undefined
      });
    } else {
      setFormData({
        user_id: '',
        title: '',
        message: '',
        notification_type: 'info',
        priority: 'medium',
        status: 'unread',
        category: 'administrative',
        action_url: '',
        scheduled_date: undefined,
        read_date: undefined,
        is_important: false
      });
    }
    setErrors({});
  }, [notification, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.user_id) {
      newErrors.user_id = 'User is required';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
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

  const handleInputChange = (field: keyof Notification, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      case 'reminder': return 'text-blue-600';
      case 'announcement': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {notification ? 'Edit Notification' : 'Create New Notification'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user_id">User</Label>
              <Select
                value={formData.user_id}
                onValueChange={(value) => handleInputChange('user_id', value)}
              >
                <SelectTrigger className={cn(errors.user_id && 'border-red-500')}>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email}) - {user.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.user_id && (
                <p className="text-sm text-red-500">{errors.user_id}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notification_type">Type</Label>
              <Select
                value={formData.notification_type}
                onValueChange={(value) => handleInputChange('notification_type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info" className="text-gray-600">Information</SelectItem>
                  <SelectItem value="success" className="text-green-600">Success</SelectItem>
                  <SelectItem value="warning" className="text-yellow-600">Warning</SelectItem>
                  <SelectItem value="error" className="text-red-600">Error</SelectItem>
                  <SelectItem value="reminder" className="text-blue-600">Reminder</SelectItem>
                  <SelectItem value="announcement" className="text-purple-600">Announcement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="administrative">Administrative</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low" className="text-green-600">Low</SelectItem>
                  <SelectItem value="medium" className="text-yellow-600">Medium</SelectItem>
                  <SelectItem value="high" className="text-orange-600">High</SelectItem>
                  <SelectItem value="urgent" className="text-red-600">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled_date">Scheduled Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.scheduled_date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.scheduled_date ? (
                      format(formData.scheduled_date, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.scheduled_date}
                    onSelect={(date) => handleInputChange('scheduled_date', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter notification title"
              className={cn(errors.title && 'border-red-500')}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Enter notification message..."
              rows={4}
              className={cn(errors.message && 'border-red-500')}
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="action_url">Action URL (Optional)</Label>
            <Input
              id="action_url"
              type="url"
              value={formData.action_url || ''}
              onChange={(e) => handleInputChange('action_url', e.target.value)}
              placeholder="https://example.com/action"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_important"
              checked={formData.is_important}
              onChange={(e) => handleInputChange('is_important', e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="is_important">Mark as Important</Label>
          </div>

          {/* Notification Preview */}
          {formData.title || formData.message ? (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Notification Preview</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Bell className={cn('h-4 w-4', getTypeColor(formData.notification_type))} />
                  <span className={cn('font-medium', getTypeColor(formData.notification_type))}>
                    {formData.notification_type.charAt(0).toUpperCase() + formData.notification_type.slice(1)}
                  </span>
                  <span className={cn('font-medium', getPriorityColor(formData.priority))}>
                    ({formData.priority})
                  </span>
                </div>
                <div>
                  <span className="font-medium">Title:</span>
                  <span className="text-gray-600 ml-2">{formData.title || 'No title'}</span>
                </div>
                <div>
                  <span className="font-medium">Category:</span>
                  <span className="text-gray-600 ml-2 capitalize">{formData.category}</span>
                </div>
                {formData.message && (
                  <div>
                    <span className="font-medium">Message:</span>
                    <p className="text-gray-600 mt-1 text-xs line-clamp-2">
                      {formData.message}
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
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {notification ? 'Update' : 'Create'} Notification
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 