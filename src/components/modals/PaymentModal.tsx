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

interface Payment {
  id?: string;
  student_id: string;
  tuition_id?: string;
  amount: number;
  payment_date: Date;
  payment_method: string;
  transaction_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  reference_number?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Payment) => void;
  payment?: Payment | null;
  students: Array<{ id: string; name: string; email: string }>;
  tuitions?: Array<{ id: string; amount: number; due_date: string }>;
  isLoading?: boolean;
}

export function PaymentModal({
  isOpen,
  onClose,
  onSave,
  payment,
  students,
  tuitions = [],
  isLoading = false
}: PaymentModalProps) {
  const [formData, setFormData] = useState<Payment>({
    student_id: '',
    tuition_id: '',
    amount: 0,
    payment_date: new Date(),
    payment_method: '',
    transaction_id: '',
    status: 'pending',
    reference_number: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (payment) {
      setFormData({
        ...payment,
        payment_date: payment.payment_date ? new Date(payment.payment_date) : new Date()
      });
    } else {
      setFormData({
        student_id: '',
        tuition_id: '',
        amount: 0,
        payment_date: new Date(),
        payment_method: '',
        transaction_id: '',
        status: 'pending',
        reference_number: '',
        notes: ''
      });
    }
    setErrors({});
  }, [payment, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.student_id) {
      newErrors.student_id = 'Student is required';
    }
    if (!formData.payment_method) {
      newErrors.payment_method = 'Payment method is required';
    }
    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
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

  const handleInputChange = (field: keyof Payment, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const generateReferenceNumber = () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `PAY-${timestamp.slice(-6)}-${random}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {payment ? 'Edit Payment' : 'Add New Payment'}
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
              <Label htmlFor="tuition_id">Tuition (Optional)</Label>
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
              <Label htmlFor="amount">Amount ($)</Label>
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
              <Label htmlFor="payment_method">Payment Method</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value) => handleInputChange('payment_method', value)}
              >
                <SelectTrigger className={cn(errors.payment_method && 'border-red-500')}>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="debit_card">Debit Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="online_payment">Online Payment</SelectItem>
                  <SelectItem value="mobile_payment">Mobile Payment</SelectItem>
                </SelectContent>
              </Select>
              {errors.payment_method && (
                <p className="text-sm text-red-500">{errors.payment_method}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_date">Payment Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.payment_date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.payment_date ? (
                      format(formData.payment_date, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.payment_date}
                    onSelect={(date) => handleInputChange('payment_date', date)}
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
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transaction_id">Transaction ID</Label>
              <Input
                id="transaction_id"
                type="text"
                value={formData.transaction_id || ''}
                onChange={(e) => handleInputChange('transaction_id', e.target.value)}
                placeholder="Transaction ID from payment processor"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference_number">Reference Number</Label>
              <div className="flex space-x-2">
                <Input
                  id="reference_number"
                  type="text"
                  value={formData.reference_number || ''}
                  onChange={(e) => handleInputChange('reference_number', e.target.value)}
                  placeholder="Payment reference number"
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
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes about the payment..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {payment ? 'Update' : 'Create'} Payment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 