"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { DollarSign, Search, Filter, Plus, Edit, Trash2, Eye } from "lucide-react"

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

const tuitionData = [
  {
    id: "TUI001",
    level: "Undergraduate",
    department: "Computer Science",
    semester: "Fall 2024",
    credits: 3,
    amount: 1200,
    dueDate: "2024-09-01",
    status: "Active",
  },
  {
    id: "TUI002",
    level: "Graduate",
    department: "Mathematics",
    semester: "Fall 2024",
    credits: 4,
    amount: 1500,
    dueDate: "2024-09-01",
    status: "Active",
  },
  {
    id: "TUI003",
    level: "Undergraduate",
    department: "Engineering",
    semester: "Fall 2024",
    credits: 3,
    amount: 1200,
    dueDate: "2024-09-01",
    status: "Inactive",
  },
  {
    id: "TUI004",
    level: "Graduate",
    department: "Physics",
    semester: "Fall 2024",
    credits: 4,
    amount: 1500,
    dueDate: "2024-09-01",
    status: "Active",
  },
]

const academicLevels = ["All Levels", "Undergraduate", "Graduate"]
const departmentList = ["All Departments", "Computer Science", "Mathematics", "Engineering", "Physics", "Biology"]

export default function AdminTuition() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("All Levels")
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")

  const filteredTuition = tuitionData.filter((tuition) => {
    const matchesSearch =
      tuition.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tuition.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tuition.semester.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = selectedLevel === "All Levels" || tuition.level === selectedLevel
    const matchesDepartment = selectedDepartment === "All Departments" || tuition.department === selectedDepartment
    return matchesSearch && matchesLevel && matchesDepartment
  })

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tuition & Fees</h1>
          <p className="text-gray-600">Manage tuition fees and payment schedules</p>
        </div>
        <div className="flex items-center gap-4">
          <Button className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Tuition Fee
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search tuition fees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {selectedLevel}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by Level</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {academicLevels.map((level) => (
              <DropdownMenuItem key={level} onClick={() => setSelectedLevel(level)}>
                {level}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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

      {/* Tuition Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <DollarSign className="h-5 w-5 text-purple-600" />
            Tuition Fee Schedule
          </CardTitle>
          <CardDescription>Manage and view all tuition fees</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Level</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTuition.map((tuition) => (
                <TableRow key={tuition.id}>
                  <TableCell>{tuition.level}</TableCell>
                  <TableCell>{tuition.department}</TableCell>
                  <TableCell>{tuition.semester}</TableCell>
                  <TableCell>{tuition.credits}</TableCell>
                  <TableCell className="font-medium">${tuition.amount}</TableCell>
                  <TableCell>{new Date(tuition.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-500">{tuition.status}</Badge>
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
                          <DropdownMenuItem className="text-red-600">Delete Tuition Fee</DropdownMenuItem>
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
