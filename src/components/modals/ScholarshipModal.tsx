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

interface Scholarship {
  id?: string;
  name: string;
  description: string;
  amount: number;
  type: 'merit_based' | 'need_based' | 'athletic' | 'academic' | 'research' | 'other';
  eligibility_criteria: string;
  application_deadline: Date;
  academic_year: string;
  max_recipients?: number;
  status: 'active' | 'inactive' | 'expired';
  requirements?: string;
  created_at?: string;
  updated_at?: string;
}

interface ScholarshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Scholarship) => void;
  scholarship?: Scholarship | null;
  isLoading?: boolean;
}

export function ScholarshipModal({
  isOpen,
  onClose,
  onSave,
  scholarship,
  isLoading = false
}: ScholarshipModalProps) {
  const [formData, setFormData] = useState<Scholarship>({
    name: '',
    description: '',
    amount: 0,
    type: 'merit_based',
    eligibility_criteria: '',
    application_deadline: new Date(),
    academic_year: new Date().getFullYear().toString(),
    max_recipients: 1,
    status: 'active',
    requirements: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (scholarship) {
      setFormData({
        ...scholarship,
        application_deadline: scholarship.application_deadline ? new Date(scholarship.application_deadline) : new Date()
      });
    } else {
      setFormData({
        name: '',
        description: '',
        amount: 0,
        type: 'merit_based',
        eligibility_criteria: '',
        application_deadline: new Date(),
        academic_year: new Date().getFullYear().toString(),
        max_recipients: 1,
        status: 'active',
        requirements: ''
      });
    }
    setErrors({});
  }, [scholarship, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Scholarship name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.eligibility_criteria.trim()) {
      newErrors.eligibility_criteria = 'Eligibility criteria is required';
    }
    if (!formData.academic_year) {
      newErrors.academic_year = 'Academic year is required';
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

  const handleInputChange = (field: keyof Scholarship, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {scholarship ? 'Edit Scholarship' : 'Add New Scholarship'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Scholarship Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter scholarship name"
                className={cn(errors.name && 'border-red-500')}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
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
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="merit_based">Merit-Based</SelectItem>
                  <SelectItem value="need_based">Need-Based</SelectItem>
                  <SelectItem value="athletic">Athletic</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="academic_year">Academic Year</Label>
              <Input
                id="academic_year"
                type="text"
                value={formData.academic_year}
                onChange={(e) => handleInputChange('academic_year', e.target.value)}
                placeholder="e.g., 2024-2025"
                className={cn(errors.academic_year && 'border-red-500')}
              />
              {errors.academic_year && (
                <p className="text-sm text-red-500">{errors.academic_year}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_recipients">Max Recipients</Label>
              <Input
                id="max_recipients"
                type="number"
                min="1"
                value={formData.max_recipients || 1}
                onChange={(e) => handleInputChange('max_recipients', parseInt(e.target.value) || 1)}
                placeholder="1"
              />
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="application_deadline">Application Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.application_deadline && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.application_deadline ? (
                      format(formData.application_deadline, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.application_deadline}
                    onSelect={(date) => handleInputChange('application_deadline', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the scholarship..."
              rows={3}
              className={cn(errors.description && 'border-red-500')}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="eligibility_criteria">Eligibility Criteria</Label>
            <Textarea
              id="eligibility_criteria"
              value={formData.eligibility_criteria}
              onChange={(e) => handleInputChange('eligibility_criteria', e.target.value)}
              placeholder="List the eligibility criteria..."
              rows={3}
              className={cn(errors.eligibility_criteria && 'border-red-500')}
            />
            {errors.eligibility_criteria && (
              <p className="text-sm text-red-500">{errors.eligibility_criteria}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Additional Requirements</Label>
            <Textarea
              id="requirements"
              value={formData.requirements || ''}
              onChange={(e) => handleInputChange('requirements', e.target.value)}
              placeholder="Additional requirements or documents needed..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {scholarship ? 'Update' : 'Create'} Scholarship
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 