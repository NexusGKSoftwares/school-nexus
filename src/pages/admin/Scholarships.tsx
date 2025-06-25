"use client"

import { useState } from "react"
import { Award, Search, Filter, Plus, Edit, Trash2, Eye } from "lucide-react"

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

const scholarshipData = [
  {
    id: "SCH001",
    name: "Merit Scholarship",
    studentName: "Sarah Johnson",
    studentId: "STU001",
    email: "sarah.johnson@student.edu",
    amount: 1000,
    date: "2024-01-15",
    status: "Approved",
    gpa: 3.8,
    department: "Computer Science",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "SCH002",
    name: "Need-Based Scholarship",
    studentName: "Michael Brown",
    studentId: "STU002",
    email: "michael.brown@student.edu",
    amount: 1200,
    date: "2024-01-14",
    status: "Pending",
    gpa: 3.6,
    department: "Mathematics",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "SCH003",
    name: "Athletic Scholarship",
    studentName: "Emily Davis",
    studentId: "STU003",
    email: "emily.davis@student.edu",
    amount: 1500,
    date: "2024-01-13",
    status: "Approved",
    gpa: 3.9,
    department: "Physics",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "SCH004",
    name: "Leadership Scholarship",
    studentName: "James Wilson",
    studentId: "STU004",
    email: "james.wilson@student.edu",
    amount: 800,
    date: "2024-01-12",
    status: "Rejected",
    gpa: 3.4,
    department: "Engineering",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const scholarshipTypes = [
  "All Types",
  "Merit Scholarship",
  "Need-Based Scholarship",
  "Athletic Scholarship",
  "Leadership Scholarship",
]
const scholarshipStatus = ["All Statuses", "Approved", "Pending", "Rejected"]

export default function AdminScholarships() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("All Types")
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")

  const filteredScholarships = scholarshipData.filter((scholarship) => {
    const matchesSearch =
      scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "All Types" || scholarship.name === selectedType
    const matchesStatus = selectedStatus === "All Statuses" || scholarship.status === selectedStatus
    return matchesSearch && matchesType && matchesStatus
  })

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
          <h1 className="text-3xl font-bold text-gray-900">Scholarships & Waivers</h1>
          <p className="text-gray-600">Manage student scholarships and financial aid programs</p>
        </div>
        <div className="flex items-center gap-4">
          <Button className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Scholarship
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search scholarships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {selectedType}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {scholarshipTypes.map((type) => (
              <DropdownMenuItem key={type} onClick={() => setSelectedType(type)}>
                {type}
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
            {scholarshipStatus.map((status) => (
              <DropdownMenuItem key={status} onClick={() => setSelectedStatus(status)}>
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Scholarships Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Award className="h-5 w-5 text-purple-600" />
            Scholarship Records
          </CardTitle>
          <CardDescription>Manage and view all student scholarship information</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scholarship</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>GPA</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScholarships.map((scholarship) => (
                <TableRow key={scholarship.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{scholarship.name}</div>
                      <div className="text-sm text-gray-600">{scholarship.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={scholarship.avatar || "/placeholder.svg"} alt={scholarship.studentName} />
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                          {scholarship.studentName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{scholarship.studentName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">${scholarship.amount}</TableCell>
                  <TableCell>{new Date(scholarship.date).toLocaleDateString()}</TableCell>
                  <TableCell>{scholarship.gpa}</TableCell>
                  <TableCell>{scholarship.department}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-500">{scholarship.status}</Badge>
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
                          <DropdownMenuItem className="text-red-600">Delete Scholarship</DropdownMenuItem>
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
