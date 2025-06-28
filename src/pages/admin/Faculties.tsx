"use client"

import { useState, useEffect } from "react"
import { Building2, Search, Plus, Edit, Trash2, Users, BookOpen, GraduationCap, Eye, Loader2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { facultyService, lecturerService, studentService, courseService } from "@/lib/dataService"

interface Faculty {
  id: string
  name: string
  dean: string
  departments: number
  lecturers: number
  students: number
  courses: number
  established: string
  status: string
  description: string
}

interface Department {
  id: string
  name: string
  faculty: string
  head: string
  lecturers: number
  students: number
  courses: number
  status: string
}

export default function AdminFaculties() {
  const [facultiesData, setFacultiesData] = useState<Faculty[]>([])
  const [departmentsData, setDepartmentsData] = useState<Department[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("faculties")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch faculties
      const { data: faculties, error: facultiesError } = await facultyService.getFaculties()
      
      if (facultiesError) {
        setError(facultiesError.message)
        return
      }

      // Fetch lecturers for counting
      const { data: lecturers } = await lecturerService.getLecturers()
      
      // Fetch students for counting
      const { data: students } = await studentService.getStudents()
      
      // Fetch courses for counting
      const { data: courses } = await courseService.getCourses()

      if (faculties) {
        const transformedFaculties: Faculty[] = faculties.map((faculty) => {
          const facultyLecturers = lecturers?.filter(l => l.faculty.id === faculty.id).length || 0
          const facultyStudents = students?.filter(s => s.faculty.id === faculty.id).length || 0
          const facultyCourses = courses?.filter(c => c.faculty.id === faculty.id).length || 0
          
          return {
            id: faculty.id,
            name: faculty.name,
            dean: faculty.dean || "TBD",
            departments: 1, // Placeholder since we don't have departments table
            lecturers: facultyLecturers,
            students: facultyStudents,
            courses: facultyCourses,
            established: faculty.established_year || "N/A",
            status: faculty.status,
            description: faculty.description || `${faculty.name} programs`,
          }
        })
        setFacultiesData(transformedFaculties)

        // Generate departments data based on faculties
        const mockDepartments: Department[] = faculties.map((faculty, index) => ({
          id: `DEPT${String(index + 1).padStart(3, '0')}`,
          name: `${faculty.name} Department`,
          faculty: faculty.name,
          head: faculty.dean || "TBD",
          lecturers: lecturers?.filter(l => l.faculty.id === faculty.id).length || 0,
          students: students?.filter(s => s.faculty.id === faculty.id).length || 0,
          courses: courses?.filter(c => c.faculty.id === faculty.id).length || 0,
          status: "Active",
        }))
        setDepartmentsData(mockDepartments)
      }
    } catch (err) {
      setError("Failed to fetch faculties data")
      console.error("Error fetching faculties data:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredFaculties = facultiesData.filter(
    (faculty) =>
      faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.dean.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredDepartments = departmentsData.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.head.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.faculty.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading faculties data...</span>
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
          <h1 className="text-3xl font-bold text-gray-900">Faculties & Departments</h1>
          <p className="text-gray-600">Manage academic faculties and their departments</p>
        </div>
        <div className="flex items-center gap-4">
          <Button className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add {activeTab === "faculties" ? "Faculty" : "Department"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{facultiesData.length}</div>
                <div className="text-sm text-gray-600">Total Faculties</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-green-600 text-white">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{departmentsData.length}</div>
                <div className="text-sm text-gray-600">Total Departments</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {facultiesData.reduce((sum, faculty) => sum + faculty.lecturers, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Lecturers</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {facultiesData.reduce((sum, faculty) => sum + faculty.courses, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Courses</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === "faculties" ? "default" : "ghost"}
          onClick={() => setActiveTab("faculties")}
          className={activeTab === "faculties" ? "bg-white shadow-sm" : ""}
        >
          Faculties
        </Button>
        <Button
          variant={activeTab === "departments" ? "default" : "ghost"}
          onClick={() => setActiveTab("departments")}
          className={activeTab === "departments" ? "bg-white shadow-sm" : ""}
        >
          Departments
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-blue-200 focus:border-blue-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Faculties Tab */}
      {activeTab === "faculties" && (
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Building2 className="h-5 w-5 text-blue-600" />
              Faculty Management
            </CardTitle>
            <CardDescription>Manage academic faculties and their programs</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredFaculties.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No faculties found matching your criteria.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Faculty</TableHead>
                    <TableHead>Dean</TableHead>
                    <TableHead>Departments</TableHead>
                    <TableHead>Lecturers</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Courses</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFaculties.map((faculty) => (
                    <TableRow key={faculty.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{faculty.name}</div>
                          <div className="text-sm text-gray-600">{faculty.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{faculty.dean}</TableCell>
                      <TableCell>{faculty.departments}</TableCell>
                      <TableCell>{faculty.lecturers}</TableCell>
                      <TableCell>{faculty.students}</TableCell>
                      <TableCell>{faculty.courses}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">{faculty.status}</Badge>
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
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="mr-2 h-4 w-4" />
                              View Staff
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BookOpen className="mr-2 h-4 w-4" />
                              View Courses
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
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
      )}

      {/* Departments Tab */}
      {activeTab === "departments" && (
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Users className="h-5 w-5 text-green-600" />
              Department Management
            </CardTitle>
            <CardDescription>Manage academic departments within faculties</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredDepartments.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No departments found matching your criteria.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Faculty</TableHead>
                    <TableHead>Head</TableHead>
                    <TableHead>Lecturers</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Courses</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDepartments.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell>
                        <div className="font-medium text-gray-900">{dept.name}</div>
                      </TableCell>
                      <TableCell>{dept.faculty}</TableCell>
                      <TableCell>{dept.head}</TableCell>
                      <TableCell>{dept.lecturers}</TableCell>
                      <TableCell>{dept.students}</TableCell>
                      <TableCell>{dept.courses}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">{dept.status}</Badge>
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
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="mr-2 h-4 w-4" />
                              View Staff
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BookOpen className="mr-2 h-4 w-4" />
                              View Courses
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
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
      )}
    </div>
  )
}
