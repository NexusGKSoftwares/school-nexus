"use client"

import { useState } from "react"
import { Users, Search, Filter, Download, Plus, Edit, Trash2, Eye, Mail, Shield, UserCheck } from "lucide-react"

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

const staffData = [
  {
    id: "STF001",
    name: "Jennifer Adams",
    email: "jennifer.adams@university.edu",
    phone: "+1 (555) 123-4567",
    department: "Administration",
    position: "Registrar",
    role: "Admin",
    experience: "8 years",
    status: "Active",
    joinDate: "2016-03-15",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "STF002",
    name: "Robert Martinez",
    email: "robert.martinez@university.edu",
    phone: "+1 (555) 234-5678",
    department: "IT Services",
    position: "System Administrator",
    role: "Technical",
    experience: "12 years",
    status: "Active",
    joinDate: "2012-07-20",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "STF003",
    name: "Maria Rodriguez",
    email: "maria.rodriguez@university.edu",
    phone: "+1 (555) 345-6789",
    department: "Student Services",
    position: "Academic Advisor",
    role: "Support",
    experience: "6 years",
    status: "Active",
    joinDate: "2018-09-10",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "STF004",
    name: "James Thompson",
    email: "james.thompson@university.edu",
    phone: "+1 (555) 456-7890",
    department: "Finance",
    position: "Financial Officer",
    role: "Finance",
    experience: "15 years",
    status: "Active",
    joinDate: "2009-01-05",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "STF005",
    name: "Sarah Williams",
    email: "sarah.williams@university.edu",
    phone: "+1 (555) 567-8901",
    department: "Library",
    position: "Head Librarian",
    role: "Academic",
    experience: "10 years",
    status: "On Leave",
    joinDate: "2014-08-12",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const departmentStats = [
  { department: "Administration", count: 15, percentage: 25 },
  { department: "IT Services", count: 12, percentage: 20 },
  { department: "Student Services", count: 18, percentage: 30 },
  { department: "Finance", count: 8, percentage: 13 },
  { department: "Library", count: 7, percentage: 12 },
]

export default function AdminStaff() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All")

  const filteredStaff = staffData.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "All" || staff.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600">Manage administrative and support staff members</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">60</div>
                <div className="text-sm text-gray-600">Total Staff</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-green-600 text-white">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">57</div>
                <div className="text-sm text-gray-600">Active Staff</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">12</div>
                <div className="text-sm text-gray-600">Admin Roles</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">9.2</div>
                <div className="text-sm text-gray-600">Avg Experience (Years)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Department Distribution */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Department Distribution</CardTitle>
            <CardDescription>Staff by department</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {departmentStats.map((dept, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{dept.department}</span>
                  <span className="text-gray-600">{dept.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-400 to-violet-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${dept.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Staff Table */}
        <Card className="lg:col-span-3 bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Users className="h-5 w-5 text-purple-600" />
                  Staff Records
                </CardTitle>
                <CardDescription>Manage and view all staff information</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search staff..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
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
                    <DropdownMenuItem onClick={() => setSelectedDepartment("All")}>All Departments</DropdownMenuItem>
                    {departmentStats.map((dept) => (
                      <DropdownMenuItem key={dept.department} onClick={() => setSelectedDepartment(dept.department)}>
                        {dept.department}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={staff.avatar || "/placeholder.svg"} alt={staff.name} />
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            {staff.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{staff.name}</div>
                          <div className="text-sm text-gray-600">{staff.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{staff.id}</TableCell>
                    <TableCell>{staff.department}</TableCell>
                    <TableCell>{staff.position}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          staff.role === "Admin"
                            ? "border-red-300 text-red-700 bg-red-50"
                            : staff.role === "Technical"
                              ? "border-blue-300 text-blue-700 bg-blue-50"
                              : "border-green-300 text-green-700 bg-green-50"
                        }
                      >
                        {staff.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={staff.status === "Active" ? "default" : "secondary"}
                        className={staff.status === "Active" ? "bg-green-500" : "bg-orange-500"}
                      >
                        {staff.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-red-600">Remove Staff</DropdownMenuItem>
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
    </div>
  )
}
