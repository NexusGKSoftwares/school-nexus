"use client"

import { useState, useEffect } from "react"
import { HelpCircle, Search, Filter, Download, Edit, Eye, Mail, Loader2 } from "lucide-react"

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
import { supportService, studentService, facultyService } from "@/lib/dataService"

interface SupportTicket {
  id: string
  studentName: string
  studentId: string
  email: string
  subject: string
  date: string
  status: string
  priority: string
  department: string
  description: string
  avatar: string
}

export default function AdminSupport() {
  const [supportTicketsData, setSupportTicketsData] = useState<SupportTicket[]>([])
  const [ticketPriorities, setTicketPriorities] = useState<string[]>(["All Priorities"])
  const [ticketStatus, setTicketStatus] = useState<string[]>(["All Statuses"])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPriority, setSelectedPriority] = useState("All Priorities")
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch support tickets
      const { data: tickets, error: ticketsError } = await supportService.getSupportTickets()
      
      if (ticketsError) {
        setError(ticketsError.message)
        return
      }

      // Fetch students for additional data
      const { data: students } = await studentService.getStudents()
      
      // Fetch faculties for additional data
      const { data: faculties } = await facultyService.getFaculties()

      if (tickets) {
        const transformedTickets: SupportTicket[] = tickets.map((ticket) => {
          const student = students?.find(s => s.id === ticket.student_id)
          const faculty = faculties?.find(f => f.id === student?.faculty_id)
          
          return {
            id: ticket.id,
            studentName: student ? `${student.first_name} ${student.last_name}` : "Unknown Student",
            studentId: student?.student_id || "N/A",
            email: student?.email || "N/A",
            subject: ticket.subject || "General Inquiry",
            date: ticket.created_at ? new Date(ticket.created_at).toISOString().split('T')[0] : "N/A",
            status: ticket.status,
            priority: ticket.priority || "Medium",
            department: faculty?.name || "General",
            description: ticket.description || "No description provided",
            avatar: student?.avatar_url || "/placeholder.svg?height=40&width=40",
          }
        })
        setSupportTicketsData(transformedTickets)

        // Generate filter options
        const uniquePriorities = Array.from(new Set(transformedTickets.map(t => t.priority)))
        const uniqueStatuses = Array.from(new Set(transformedTickets.map(t => t.status)))
        
        setTicketPriorities(["All Priorities", ...uniquePriorities])
        setTicketStatus(["All Statuses", ...uniqueStatuses])
      }
    } catch (err) {
      setError("Failed to fetch support ticket data")
      console.error("Error fetching support ticket data:", err)
    } finally {
      setLoading(false)
    }
  }

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading support ticket data...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchData}>Retry</Button>
        </div>
      </div>
    )
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
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-blue-200 focus:border-blue-400"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
                  <Filter className="h-4 w-4 mr-2" />
                  {selectedPriority}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
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
                <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
                  <Filter className="h-4 w-4 mr-2" />
                  {selectedStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
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
        </CardContent>
      </Card>

      {/* Support Tickets Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            Support Tickets
          </CardTitle>
          <CardDescription>Manage and respond to student support tickets</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTickets.length === 0 ? (
            <div className="text-center py-8">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No support tickets found matching your criteria.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={ticket.avatar} alt={ticket.studentName} />
                          <AvatarFallback>{ticket.studentName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{ticket.studentName}</div>
                          <div className="text-sm text-gray-600">{ticket.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{ticket.subject}</div>
                        <div className="text-sm text-gray-600">{ticket.department}</div>
                      </div>
                    </TableCell>
                    <TableCell>{ticket.date}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={ticket.status === "Open" ? "bg-green-500" : ticket.status === "Pending" ? "bg-orange-500" : "bg-gray-500"}>
                        {ticket.status}
                      </Badge>
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
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Ticket
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Response
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-green-600">
                            <HelpCircle className="mr-2 h-4 w-4" />
                            Mark as Resolved
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
    </div>
  )
}
