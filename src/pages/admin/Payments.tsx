"use client"

import { useState } from "react"
import { CreditCard, Search, Filter, Download, CheckCircle, XCircle, Clock, Eye, Mail } from "lucide-react"

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

const paymentData = [
  {
    id: "PAY001",
    studentName: "Sarah Johnson",
    studentId: "STU001",
    email: "sarah.johnson@student.edu",
    amount: 1200,
    date: "2024-01-15",
    method: "Credit Card",
    status: "Approved",
    transactionId: "TXN001",
    course: "CS 301",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "PAY002",
    studentName: "Michael Brown",
    studentId: "STU002",
    email: "michael.brown@student.edu",
    amount: 1500,
    date: "2024-01-14",
    method: "PayPal",
    status: "Pending",
    transactionId: "TXN002",
    course: "MATH 201",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "PAY003",
    studentName: "Emily Davis",
    studentId: "STU003",
    email: "emily.davis@student.edu",
    amount: 1200,
    date: "2024-01-13",
    method: "Credit Card",
    status: "Approved",
    transactionId: "TXN003",
    course: "ENG 101",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "PAY004",
    studentName: "James Wilson",
    studentId: "STU004",
    email: "james.wilson@student.edu",
    amount: 1800,
    date: "2024-01-12",
    method: "Bank Transfer",
    status: "Rejected",
    transactionId: "TXN004",
    course: "PHY 301",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const paymentMethods = ["All Methods", "Credit Card", "PayPal", "Bank Transfer"]
const paymentStatus = ["All Statuses", "Approved", "Pending", "Rejected"]

export default function AdminPayments() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMethod, setSelectedMethod] = useState("All Methods")
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")

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
      case "Approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Pending":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "Rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-500"
      case "Pending":
        return "bg-orange-500"
      case "Rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
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
          <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {selectedMethod}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by Method</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {paymentMethods.map((method) => (
              <DropdownMenuItem key={method} onClick={() => setSelectedMethod(method)}>
                {method}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {selectedStatus}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {paymentStatus.map((status) => (
              <DropdownMenuItem key={status} onClick={() => setSelectedStatus(status)}>
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Payments Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <CreditCard className="h-5 w-5 text-purple-600" />
            Payment Records
          </CardTitle>
          <CardDescription>Manage and view all student payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={payment.avatar || "/placeholder.svg"} alt={payment.studentName} />
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                          {payment.studentName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">{payment.studentName}</div>
                        <div className="text-sm text-gray-600">{payment.studentId}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">${payment.amount}</TableCell>
                  <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      <Badge className={`${getStatusColor(payment.status)} text-white`}>{payment.status}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
