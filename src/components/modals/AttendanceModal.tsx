import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Attendance {
  id?: string;
  student_id: string;
  course_id: string;
  session_date: Date;
  session_time: string;
  status: 'present' | 'absent' | 'late' | 'excused' | 'tardy';
  check_in_time?: string;
  check_out_time?: string;
  notes?: string;
  recorded_by: string;
  created_at?: string;
  updated_at?: string;
}

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Attendance) => void;
  attendance?: Attendance | null;
  students: Array<{ id: string; name: string; email: string }>;
  courses: Array<{ id: string; name: string; code: string }>;
  currentUserId: string;
  isLoading?: boolean;
}

export function AttendanceModal({
  isOpen,
  onClose,
  onSave,
  attendance,
  students,
  courses,
  currentUserId,
  isLoading = false
}: AttendanceModalProps) {
  const [formData, setFormData] = useState<Attendance>({
    student_id: '',
    course_id: '',
    session_date: new Date(),
    session_time: '09:00',
    status: 'present',
    check_in_time: '',
    check_out_time: '',
    notes: '',
    recorded_by: currentUserId
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (attendance) {
      setFormData({
        ...attendance,
        session_date: attendance.session_date ? new Date(attendance.session_date) : new Date()
      });
    } else {
      setFormData({
        student_id: '',
        course_id: '',
        session_date: new Date(),
        session_time: '09:00',
        status: 'present',
        check_in_time: '',
        check_out_time: '',
        notes: '',
        recorded_by: currentUserId
      });
    }
    setErrors({});
  }, [attendance, isOpen, currentUserId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.student_id) {
      newErrors.student_id = 'Student is required';
    }
    if (!formData.course_id) {
      newErrors.course_id = 'Course is required';
    }
    if (!formData.session_time) {
      newErrors.session_time = 'Session time is required';
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

  const handleInputChange = (field: keyof Attendance, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-green-600';
      case 'absent': return 'text-red-600';
      case 'late': return 'text-yellow-600';
      case 'excused': return 'text-blue-600';
      case 'tardy': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {attendance ? 'Edit Attendance' : 'Add New Attendance Record'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="student_id">Student</Label>
              <Select
                value={formData.student_id}
                onValueChange={(value) => handleInputChange('student_id', value)}
              >
                <SelectTrigger className={cn(errors.student_id && 'border-red-500')}>
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
                onValueChange={(value) => handleInputChange('course_id', value)}
              >
                <SelectTrigger className={cn(errors.course_id && 'border-red-500')}>
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
              <Label htmlFor="session_date">Session Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.session_date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.session_date ? (
                      format(formData.session_date, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.session_date}
                    onSelect={(date) => handleInputChange('session_date', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="session_time">Session Time</Label>
              <Input
                id="session_time"
                type="time"
                value={formData.session_time}
                onChange={(e) => handleInputChange('session_time', e.target.value)}
                className={cn(errors.session_time && 'border-red-500')}
              />
              {errors.session_time && (
                <p className="text-sm text-red-500">{errors.session_time}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Attendance Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present" className="text-green-600">Present</SelectItem>
                  <SelectItem value="absent" className="text-red-600">Absent</SelectItem>
                  <SelectItem value="late" className="text-yellow-600">Late</SelectItem>
                  <SelectItem value="excused" className="text-blue-600">Excused</SelectItem>
                  <SelectItem value="tardy" className="text-orange-600">Tardy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="check_in_time">Check-in Time (Optional)</Label>
              <Input
                id="check_in_time"
                type="time"
                value={formData.check_in_time || ''}
                onChange={(e) => handleInputChange('check_in_time', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="check_out_time">Check-out Time (Optional)</Label>
              <Input
                id="check_out_time"
                type="time"
                value={formData.check_out_time || ''}
                onChange={(e) => handleInputChange('check_out_time', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes about attendance..."
              rows={3}
            />
          </div>

          {/* Status Summary */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Attendance Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Student:</span>
                <p className="text-gray-600">
                  {students.find(s => s.id === formData.student_id)?.name || 'Not selected'}
                </p>
              </div>
              <div>
                <span className="font-medium">Course:</span>
                <p className="text-gray-600">
                  {courses.find(c => c.id === formData.course_id)?.code || 'Not selected'}
                </p>
              </div>
              <div>
                <span className="font-medium">Date:</span>
                <p className="text-gray-600">
                  {formData.session_date ? format(formData.session_date, 'MMM dd, yyyy') : 'Not set'}
                </p>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <p className={cn('font-medium', getStatusColor(formData.status))}>
                  {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {attendance ? 'Update' : 'Create'} Attendance
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 