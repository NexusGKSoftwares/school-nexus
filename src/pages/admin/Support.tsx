"use client"

import { useState } from "react"
import { HelpCircle, Search, Filter, Download, Edit, Eye, Mail } from "lucide-react"

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

const supportTicketsData = [
  {
    id: "SUP001",
    studentName: "Sarah Johnson",
    studentId: "STU001",
    email: "sarah.johnson@student.edu",
    subject: "Course Registration Issue",
    date: "2024-01-15",
    status: "Open",
    priority: "High",
    department: "Computer Science",
    description: "I am unable to register for CS 301. Please help!",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "SUP002",
    studentName: "Michael Brown",
    studentId: "STU002",
    email: "michael.brown@student.edu",
    subject: "Payment Inquiry",
    date: "2024-01-14",
    status: "Pending",
    priority: "Medium",
    department: "Finance",
    description: "I have a question about my tuition payment. Can you provide more information?",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "SUP003",
    title: "Technical Support",
    studentName: "Emily Davis",
    studentId: "STU003",
    email: "emily.davis@student.edu",
    subject: "Technical Support",
    date: "2024-01-13",
    status: "Closed",
    priority: "Low",
    department: "IT Services",
    description: "I am having trouble accessing the online library. Can you assist me?",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "SUP004",
    studentName: "James Wilson",
    studentId: "STU004",
    email: "james.wilson@student.edu",
    subject: "Academic Advising",
    date: "2024-01-12",
    status: "Open",
    priority: "High",
    department: "Student Services",
    description: "I need help with academic advising. Can you schedule an appointment for me?",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const ticketPriorities = ["All Priorities", "High", "Medium", "Low"]
const ticketStatus = ["All Statuses", "Open", "Pending", "Closed"]

export default function AdminSupport() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPriority, setSelectedPriority] = useState("All Priorities")
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")

  const filteredTickets = supportTicketsData.filter((ticket) => {
    const matchesSearch =
      ticket.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = selectedPriority === "All Priorities" || ticket.priority === selectedPriority
    const matchesStatus = selectedStatus === "All Statuses" || ticket.status === selectedStatus
    return matchesSearch && matchesPriority && matchesStatus
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500"
      case "Medium":
        return "bg-orange-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-600">Manage and respond to student support tickets</p>
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
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {selectedPriority}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ticketPriorities.map((priority) => (
              <DropdownMenuItem key={priority} onClick={() => setSelectedPriority(priority)}>
                {priority}
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
            {ticketStatus.map((status) => (
              <DropdownMenuItem key={status} onClick={() => setSelectedStatus(status)}>
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Support Tickets Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <HelpCircle className="h-5 w-5 text-purple-600" />
            Support Tickets
          </CardTitle>
          <CardDescription>Manage and respond to student support tickets</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={ticket.avatar || "/placeholder.svg"} alt={ticket.studentName} />
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                          {ticket.studentName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">{ticket.studentName}</div>
                        <div className="text-sm text-gray-600">{ticket.studentId}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{ticket.subject}</div>
                      <div className="text-sm text-gray-600">{ticket.description.substring(0, 50)}...</div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(ticket.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-500">{ticket.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Ticket</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete Ticket</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
