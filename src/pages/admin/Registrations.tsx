"use client"

import { useState } from "react"
import { UserCheck, Search, Filter, CheckCircle, XCircle, Clock, Eye, Mail } from "lucide-react"

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

const registrationData = [
  {
    id: "REG001",
    studentName: "Sarah Johnson",
    studentId: "STU001",
    email: "sarah.johnson@student.edu",
    course: "Advanced Computer Science",
    courseCode: "CS401",
    semester: "Fall 2024",
    credits: 3,
    requestDate: "2024-01-10",
    status: "Pending",
    priority: "High",
    reason: "Required for graduation",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "REG002",
    studentName: "Michael Brown",
    studentId: "STU002",
    email: "michael.brown@student.edu",
    course: "Quantum Physics",
    courseCode: "PHY301",
    semester: "Fall 2024",
    credits: 4,
    requestDate: "2024-01-12",
    status: "Pending",
    priority: "Medium",
    reason: "Elective course",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "REG003",
    studentName: "Emily Davis",
    studentId: "STU003",
    email: "emily.davis@student.edu",
    course: "Advanced Mathematics",
    courseCode: "MATH301",
    semester: "Fall 2024",
    credits: 3,
    requestDate: "2024-01-08",
    status: "Approved",
    priority: "High",
    reason: "Major requirement",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "REG004",
    studentName: "James Wilson",
    studentId: "STU004",
    email: "james.wilson@student.edu",
    course: "English Literature",
    courseCode: "ENG201",
    semester: "Fall 2024",
    credits: 3,
    requestDate: "2024-01-15",
    status: "Rejected",
    priority: "Low",
    reason: "Prerequisites not met",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "REG005",
    studentName: "Lisa Anderson",
    studentId: "STU005",
    email: "lisa.anderson@student.edu",
    course: "Organic Chemistry",
    courseCode: "CHEM301",
    semester: "Fall 2024",
    credits: 4,
    requestDate: "2024-01-14",
    status: "Pending",
    priority: "High",
    reason: "Major requirement",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function AdminRegistrations() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")

  const statusOptions = ["All", "Pending", "Approved", "Rejected"]

  const filteredRegistrations = registrationData.filter((registration) => {
    const matchesSearch =
      registration.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "All" || registration.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-orange-500"
      case "Approved":
        return "bg-green-500"
      case "Rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "border-red-300 text-red-700 bg-red-50"
      case "Medium":
        return "border-orange-300 text-orange-700 bg-orange-50"
      case "Low":
        return "border-green-300 text-green-700 bg-green-50"
      default:
        return "border-gray-300 text-gray-700 bg-gray-50"
    }
  }

  const pendingCount = registrationData.filter((r) => r.status === "Pending").length
  const approvedCount = registrationData.filter((r) => r.status === "Approved").length
  const rejectedCount = registrationData.filter((r) => r.status === "Rejected").length

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Registration Approvals</h1>
          <p className="text-gray-600">Review and approve student course registration requests</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-orange-500 text-white px-3 py-1">{pendingCount} Pending Approvals</Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{pendingCount}</div>
                <div className="text-sm text-gray-600">Pending Requests</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-green-600 text-white">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{approvedCount}</div>
                <div className="text-sm text-gray-600">Approved</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-400 to-red-600 text-white">
                <XCircle className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{rejectedCount}</div>
                <div className="text-sm text-gray-600">Rejected</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{registrationData.length}</div>
                <div className="text-sm text-gray-600">Total Requests</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search registrations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
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
            {statusOptions.map((status) => (
              <DropdownMenuItem key={status} onClick={() => setSelectedStatus(status)}>
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Registration Requests Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <UserCheck className="h-5 w-5 text-purple-600" />
            Registration Requests
          </CardTitle>
          <CardDescription>Review and process course registration requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegistrations.map((registration) => (
                <TableRow key={registration.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={registration.avatar || "/placeholder.svg"} alt={registration.studentName} />
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                          {registration.studentName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">{registration.studentName}</div>
                        <div className="text-sm text-gray-600">{registration.studentId}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{registration.course}</div>
                      <div className="text-sm text-gray-600">{registration.courseCode}</div>
                    </div>
                  </TableCell>
                  <TableCell>{registration.credits}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getPriorityColor(registration.priority)}>
                      {registration.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{registration.requestDate}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(registration.status)}>{registration.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {registration.status === "Pending" && (
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
