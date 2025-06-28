import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Refund {
  id?: string;
  student_id: string;
  payment_id?: string;
  tuition_id?: string;
  amount: number;
  reason: string;
  refund_date: Date;
  status: 'pending' | 'approved' | 'processed' | 'completed' | 'rejected';
  refund_method: string;
  reference_number?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Refund) => void;
  refund?: Refund | null;
  students: Array<{ id: string; name: string; email: string }>;
  payments?: Array<{ id: string; amount: number; payment_date: string }>;
  tuitions?: Array<{ id: string; amount: number; due_date: string }>;
  isLoading?: boolean;
}

export function RefundModal({
  isOpen,
  onClose,
  onSave,
  refund,
  students,
  payments = [],
  tuitions = [],
  isLoading = false
}: RefundModalProps) {
  const [formData, setFormData] = useState<Refund>({
    student_id: '',
    payment_id: '',
    tuition_id: '',
    amount: 0,
    reason: '',
    refund_date: new Date(),
    status: 'pending',
    refund_method: '',
    reference_number: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (refund) {
      setFormData({
        ...refund,
        refund_date: refund.refund_date ? new Date(refund.refund_date) : new Date()
      });
    } else {
      setFormData({
        student_id: '',
        payment_id: '',
        tuition_id: '',
        amount: 0,
        reason: '',
        refund_date: new Date(),
        status: 'pending',
        refund_method: '',
        reference_number: '',
        notes: ''
      });
    }
    setErrors({});
  }, [refund, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.student_id) {
      newErrors.student_id = 'Student is required';
    }
    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    }
    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.refund_method) {
      newErrors.refund_method = 'Refund method is required';
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

  const handleInputChange = (field: keyof Refund, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const generateReferenceNumber = () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `REF-${timestamp.slice(-6)}-${random}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {refund ? 'Edit Refund' : 'Add New Refund'}
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
              <Label htmlFor="amount">Refund Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className={cn(errors.amount && 'border-red-500')}
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_id">Related Payment (Optional)</Label>
              <Select
                value={formData.payment_id || ''}
                onValueChange={(value) => handleInputChange('payment_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No specific payment</SelectItem>
                  {payments.map((payment) => (
                    <SelectItem key={payment.id} value={payment.id}>
                      ${payment.amount} - {format(new Date(payment.payment_date), 'MMM dd, yyyy')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tuition_id">Related Tuition (Optional)</Label>
              <Select
                value={formData.tuition_id || ''}
                onValueChange={(value) => handleInputChange('tuition_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tuition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No specific tuition</SelectItem>
                  {tuitions.map((tuition) => (
                    <SelectItem key={tuition.id} value={tuition.id}>
                      ${tuition.amount} - Due: {format(new Date(tuition.due_date), 'MMM dd, yyyy')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="refund_date">Refund Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.refund_date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.refund_date ? (
                      format(formData.refund_date, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.refund_date}
                    onSelect={(date) => handleInputChange('refund_date', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="refund_method">Refund Method</Label>
              <Select
                value={formData.refund_method}
                onValueChange={(value) => handleInputChange('refund_method', value)}
              >
                <SelectTrigger className={cn(errors.refund_method && 'border-red-500')}>
                  <SelectValue placeholder="Select refund method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">Credit Card Refund</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="credit_account">Credit to Account</SelectItem>
                </SelectContent>
              </Select>
              {errors.refund_method && (
                <p className="text-sm text-red-500">{errors.refund_method}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference_number">Reference Number</Label>
              <div className="flex space-x-2">
                <Input
                  id="reference_number"
                  type="text"
                  value={formData.reference_number || ''}
                  onChange={(e) => handleInputChange('reference_number', e.target.value)}
                  placeholder="Refund reference number"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleInputChange('reference_number', generateReferenceNumber())}
                >
                  Generate
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Refund</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              placeholder="Explain the reason for this refund..."
              rows={3}
              className={cn(errors.reason && 'border-red-500')}
            />
            {errors.reason && (
              <p className="text-sm text-red-500">{errors.reason}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes about the refund..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {refund ? 'Update' : 'Create'} Refund
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 