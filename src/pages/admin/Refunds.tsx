"use client"

import { useState } from "react"
import { RefreshCw, Search, Filter, CheckCircle, XCircle, Clock, Eye, Mail } from "lucide-react"

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

const refundData = [
  {
    id: "REF001",
    studentName: "Sarah Johnson",
    studentId: "STU001",
    email: "sarah.johnson@student.edu",
    amount: 600,
    date: "2024-01-15",
    reason: "Course Withdrawal",
    status: "Pending",
    requestDate: "2024-01-10",
    course: "CS 301",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "REF002",
    studentName: "Michael Brown",
    studentId: "STU002",
    email: "michael.brown@student.edu",
    amount: 750,
    date: "2024-01-14",
    reason: "Double Payment",
    status: "Approved",
    requestDate: "2024-01-09",
    course: "MATH 201",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "REF003",
    studentName: "Emily Davis",
    studentId: "STU003",
    email: "emily.davis@student.edu",
    amount: 600,
    date: "2024-01-13",
    reason: "Incorrect Billing",
    status: "Rejected",
    requestDate: "2024-01-08",
    course: "ENG 101",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "REF004",
    studentName: "James Wilson",
    studentId: "STU004",
    email: "james.wilson@student.edu",
    amount: 900,
    date: "2024-01-12",
    reason: "Financial Aid",
    status: "Pending",
    requestDate: "2024-01-07",
    course: "PHY 301",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const refundReasons = ["All Reasons", "Course Withdrawal", "Double Payment", "Incorrect Billing", "Financial Aid"]
const refundStatus = ["All Statuses", "Approved", "Pending", "Rejected"]

export default function AdminRefunds() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReason, setSelectedReason] = useState("All Reasons")
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")

  const filteredRefunds = refundData.filter((refund) => {
    const matchesSearch =
      refund.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.reason.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesReason = selectedReason === "All Reasons" || refund.reason === selectedReason
    const matchesStatus = selectedStatus === "All Statuses" || refund.status === selectedStatus
    return matchesSearch && matchesReason && matchesStatus
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
          <h1 className="text-3xl font-bold text-gray-900">Refund Approvals</h1>
          <p className="text-gray-600">Review and process student refund requests</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-orange-500 text-white px-3 py-1">5 Pending Approvals</Badge>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search refunds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {selectedReason}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by Reason</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {refundReasons.map((reason) => (
              <DropdownMenuItem key={reason} onClick={() => setSelectedReason(reason)}>
                {reason}
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
            {refundStatus.map((status) => (
              <DropdownMenuItem key={status} onClick={() => setSelectedStatus(status)}>
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Refund Requests Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <RefreshCw className="h-5 w-5 text-purple-600" />
            Refund Requests
          </CardTitle>
          <CardDescription>Review and process student refund requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRefunds.map((refund) => (
                <TableRow key={refund.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={refund.avatar || "/placeholder.svg"} alt={refund.studentName} />
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                          {refund.studentName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">{refund.studentName}</div>
                        <div className="text-sm text-gray-600">{refund.studentId}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">${refund.amount}</TableCell>
                  <TableCell>{new Date(refund.date).toLocaleDateString()}</TableCell>
                  <TableCell>{refund.reason}</TableCell>
                  <TableCell>{new Date(refund.requestDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(refund.status)}
                      <Badge className={`${getStatusColor(refund.status)} text-white`}>{refund.status}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {refund.status === "Pending" && (
                        <>
                          <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white h-8 px-3">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50 h-8 px-3"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
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
