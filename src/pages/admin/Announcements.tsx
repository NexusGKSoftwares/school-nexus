"use client"

import { useState } from "react"
import { Megaphone, Search, Filter, Plus, Edit, Trash2, Eye } from "lucide-react"

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

const announcementsData = [
  {
    id: "ANN001",
    title: "Fall Semester Begins",
    author: "Dr. Michael Chen",
    date: "2024-09-02",
    department: "All Departments",
    priority: "High",
    status: "Published",
    content: "Welcome to the Fall 2024 semester! Classes begin on September 2nd. Please check your course schedules.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "ANN002",
    title: "Registration Deadline Extended",
    author: "Jennifer Adams",
    date: "2024-09-15",
    department: "All Departments",
    priority: "Medium",
    status: "Published",
    content:
      "The registration deadline has been extended to September 15th. Make sure to register for your courses before the deadline.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "ANN003",
    title: "Midterm Exam Schedule",
    author: "Dr. Sarah Mitchell",
    date: "2024-10-15",
    department: "Computer Science",
    priority: "High",
    status: "Published",
    content:
      "The midterm exam schedule for Computer Science courses is now available. Please check the schedule and prepare accordingly.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "ANN004",
    title: "New Scholarship Opportunity",
    author: "Robert Martinez",
    date: "2024-11-01",
    department: "All Departments",
    priority: "Medium",
    status: "Published",
    content:
      "A new scholarship opportunity is available for eligible students. Please visit the scholarship office for more information.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "ANN005",
    title: "Thanksgiving Break",
    author: "Dr. Lisa Anderson",
    date: "2024-11-25",
    department: "All Departments",
    priority: "High",
    status: "Published",
    content:
      "The university will be closed for Thanksgiving break from November 25th to November 29th. Have a happy Thanksgiving!",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const departmentList = ["All Departments", "Computer Science", "Mathematics", "Physics", "Engineering", "Biology"]

export default function AdminAnnouncements() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")

  const filteredAnnouncements = announcementsData.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "All Departments" || announcement.department === selectedDepartment
    return matchesSearch && matchesDepartment
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
          <h1 className="text-3xl font-bold text-gray-900">Announcements & Messaging</h1>
          <p className="text-gray-600">Manage and distribute important announcements to students and staff</p>
        </div>
        <div className="flex items-center gap-4">
          <Button className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Announcement
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {selectedDepartment}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by Department</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {departmentList.map((dept) => (
              <DropdownMenuItem key={dept} onClick={() => setSelectedDepartment(dept)}>
                {dept}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Announcements Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Megaphone className="h-5 w-5 text-purple-600" />
            Recent Announcements
          </CardTitle>
          <CardDescription>Manage and view all system announcements</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAnnouncements.map((announcement) => (
                <TableRow key={announcement.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{announcement.title}</div>
                      <div className="text-sm text-gray-600">{announcement.content.substring(0, 50)}...</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={announcement.avatar || "/placeholder.svg"} alt={announcement.author} />
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                          {announcement.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{announcement.author}</span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(announcement.date).toLocaleDateString()}</TableCell>
                  <TableCell>{announcement.department}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(announcement.priority)}>{announcement.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-500">{announcement.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-red-600">Delete Announcement</DropdownMenuItem>
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
