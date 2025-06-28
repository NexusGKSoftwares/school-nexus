"use client"

import { useState, useEffect } from "react"
import { CreditCard, Search, Filter, Download, CheckCircle, XCircle, Clock, Eye, Mail, Loader2, Plus, Edit, Trash2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { paymentService, studentService, tuitionService } from "@/lib/dataService"
import { PaymentModal } from "@/components/modals/PaymentModal"
import DeleteConfirmModal  from "@/components/modals/DeleteConfirmModal"
import { useToast } from "@/hooks/use-toast"

interface Payment {
  id: string
  studentName: string
  studentId: string
  email: string
  amount: number
  date: string
  method: string
  status: string
  transactionId: string
  course: string
  avatar?: string
}

export default function AdminPayments() {
  const [paymentData, setPaymentData] = useState<Payment[]>([])
  const [students, setStudents] = useState<Array<{ id: string; name: string; email: string }>>([])
  const [tuitions, setTuitions] = useState<Array<{ id: string; amount: number; due_date: string }>>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMethod, setSelectedMethod] = useState("All Methods")
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<string[]>(["All Methods"])
  const [paymentStatus, setPaymentStatus] = useState<string[]>(["All Statuses"])
  
  // Modal states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { toast } = useToast()

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const { data, error } = await paymentService.getPayments()
      
      if (error) {
        setError(error.message)
        return
      }

      // Fetch students for modal
      const { data: studentsData } = await studentService.getStudents()
      
      // Fetch tuitions for modal
      const { data: tuitionsData } = await tuitionService.getTuitionFees()
      
      // Transform students data for modal
      if (studentsData) {
        const transformedStudents = studentsData.map(student => ({
          id: student.id,
          name: `${student.first_name} ${student.last_name}`,
          email: student.email
        }))
        setStudents(transformedStudents)
      }
      
      // Transform tuitions data for modal
      if (tuitionsData) {
        const transformedTuitions = tuitionsData.map(tuition => ({
          id: tuition.id,
          amount: tuition.amount,
          due_date: tuition.due_date
        }))
        setTuitions(transformedTuitions)
      }

      if (data) {
        const transformedPayments: Payment[] = data.map((payment) => ({
          id: payment.id,
          studentName: payment.student.profile.full_name,
          studentId: payment.student.student_number,
          email: payment.student.profile.email,
          amount: payment.amount,
          date: payment.created_at,
          method: payment.payment_method,
          status: payment.status,
          transactionId: payment.transaction_id || `TXN${payment.id.slice(-6)}`,
          course: "General Tuition", // Placeholder since we don't have course in our schema
          avatar: payment.student.profile.avatar_url || "/placeholder.svg?height=40&width=40",
        }))
        setPaymentData(transformedPayments)
        
        // Extract unique payment methods and statuses
        const uniqueMethods = [...new Set(data.map(payment => payment.payment_method))]
        const uniqueStatuses = [...new Set(data.map(payment => payment.status))]
        
        setPaymentMethods(["All Methods", ...uniqueMethods])
        setPaymentStatus(["All Statuses", ...uniqueStatuses])
      }
    } catch (err) {
      setError("Failed to fetch payments")
      console.error("Error fetching payments:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePayment = () => {
    setSelectedPayment(null)
    setIsPaymentModalOpen(true)
  }

  const handleEditPayment = (payment: Payment) => {
    // Find the original payment data
    const originalData = paymentData.find(p => p.id === payment.id)
    if (originalData) {
      setSelectedPayment({
        id: payment.id,
        student_id: students.find(s => s.name === payment.studentName)?.id || '',
        tuition_id: tuitions.find(t => t.amount === payment.amount)?.id || '',
        amount: payment.amount,
        payment_date: new Date(payment.date),
        payment_method: payment.method,
        transaction_id: payment.transactionId,
        status: payment.status,
        reference_number: '',
        notes: ''
      })
      setIsPaymentModalOpen(true)
    }
  }

  const handleDeletePayment = (payment: Payment) => {
    setSelectedPayment(payment)
    setIsDeleteModalOpen(true)
  }

  const handleSavePayment = async (data: any) => {
    try {
      setIsSubmitting(true)
      
      if (selectedPayment) {
        // Update existing payment
        const { error } = await paymentService.updatePayment(selectedPayment.id, data)
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
          })
          return
        }
        toast({
          title: "Success",
          description: "Payment updated successfully"
        })
      } else {
        // Create new payment
        const { error } = await paymentService.createPayment(data)
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
          })
          return
        }
        toast({
          title: "Success",
          description: "Payment created successfully"
        })
      }
      
      setIsPaymentModalOpen(false)
      fetchPayments()
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save payment",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedPayment) return
    
    try {
      setIsSubmitting(true)
      const { error } = await paymentService.deletePayment(selectedPayment.id)
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        })
        return
      }
      
      toast({
        title: "Success",
        description: "Payment deleted successfully"
      })
      
      setIsDeleteModalOpen(false)
      fetchPayments()
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete payment",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredPayments = paymentData.filter((payment) => {
    const matchesSearch =
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMethod = selectedMethod === "All Methods" || payment.method === selectedMethod
    const matchesStatus = selectedStatus === "All Statuses" || payment.status === selectedStatus
    return matchesSearch && matchesMethod && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500"
      case "pending":
        return "bg-orange-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading payments...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchPayments}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Tracking</h1>
          <p className="text-gray-600">Monitor and manage student payments and transactions</p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handleCreatePayment} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Payment
          </Button>
          <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-blue-200 focus:border-blue-400"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {paymentStatus.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <CreditCard className="h-5 w-5 text-purple-600" />
            Payment Records
          </CardTitle>
          <CardDescription>
            {filteredPayments.length} of {paymentData.length} payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPayments.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No payments found matching your criteria.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={payment.avatar} alt={payment.studentName} />
                          <AvatarFallback>{payment.studentName.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{payment.studentName}</div>
                          <div className="text-sm text-gray-500">{payment.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${payment.amount.toFixed(2)}</div>
                    </TableCell>
                    <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-blue-300 text-blue-700">
                        {payment.method}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payment.status)}
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-sm">{payment.transactionId}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditPayment(payment)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Payment
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Receipt
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <XCircle className="mr-2 h-4 w-4" />
                            Refund
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeletePayment(payment)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Payment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSave={handleSavePayment}
        payment={selectedPayment}
        students={students}
        tuitions={tuitions}
        isLoading={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Payment"
        description={`Are you sure you want to delete the payment for ${selectedPayment?.studentName || 'this student'}? This action cannot be undone.`}
        isLoading={isSubmitting} itemName={""}      />
    </div>
  )
}
