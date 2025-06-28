"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { DollarSign, Search, Filter, Plus, Edit, Trash2, Eye, Loader2 } from "lucide-react"

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
import { tuitionService, facultyService, studentService } from "@/lib/dataService"
import { TuitionModal } from "@/components/modals/TuitionModal"
import DeleteConfirmModal  from "@/components/modals/DeleteConfirmModal"
import { useToast } from "@/hooks/use-toast"

interface Tuition {
  id: string
  level: string
  department: string
  semester: string
  credits: number
  amount: number
  dueDate: string
  status: string
}

export default function AdminTuition() {
  const [tuitionData, setTuitionData] = useState<Tuition[]>([])
  const [students, setStudents] = useState<Array<{ id: string; name: string; email: string }>>([])
  const [academicLevels, setAcademicLevels] = useState<string[]>(["All Levels"])
  const [departmentList, setDepartmentList] = useState<string[]>(["All Departments"])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("All Levels")
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Modal states
  const [isTuitionModalOpen, setIsTuitionModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTuition, setSelectedTuition] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch tuition data
      const { data: tuition, error: tuitionError } = await tuitionService.getTuitionFees()
      
      if (tuitionError) {
        setError(tuitionError.message)
        return
      }

      // Fetch faculties for additional data
      const { data: faculties } = await facultyService.getFaculties()
      
      // Fetch students for modal
      const { data: studentsData } = await studentService.getStudents()
      
      // Transform students data for modal
      if (studentsData) {
        const transformedStudents = studentsData.map(student => ({
          id: student.id,
          name: `${student.first_name} ${student.last_name}`,
          email: student.email
        }))
        setStudents(transformedStudents)
      }

      if (tuition) {
        const transformedTuition: Tuition[] = tuition.map((fee) => {
          const faculty = faculties?.find(f => f.id === fee.faculty_id)
          
          return {
            id: fee.id,
            level: fee.academic_level || "Undergraduate",
            department: faculty?.name || "General",
            semester: fee.semester || "Current",
            credits: fee.credits || 0,
            amount: fee.amount || 0,
            dueDate: fee.due_date ? new Date(fee.due_date).toISOString().split('T')[0] : "TBD",
            status: fee.status,
          }
        })
        setTuitionData(transformedTuition)

        // Generate filter options
        const uniqueLevels = Array.from(new Set(transformedTuition.map(t => t.level)))
        const uniqueDepartments = Array.from(new Set(transformedTuition.map(t => t.department)))
        
        setAcademicLevels(["All Levels", ...uniqueLevels])
        setDepartmentList(["All Departments", ...uniqueDepartments])
      }
    } catch (err) {
      setError("Failed to fetch tuition data")
      console.error("Error fetching tuition data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTuition = () => {
    setSelectedTuition(null)
    setIsTuitionModalOpen(true)
  }

  const handleEditTuition = (tuition: Tuition) => {
    // Find the original tuition data
    const originalData = tuitionData.find(t => t.id === tuition.id)
    if (originalData) {
      setSelectedTuition({
        id: tuition.id,
        student_id: students.find(s => s.name === tuition.department)?.id || '',
        academic_year: new Date().getFullYear().toString(),
        semester: tuition.semester,
        amount: tuition.amount,
        due_date: new Date(tuition.dueDate),
        status: tuition.status.toLowerCase(),
        payment_method: '',
        notes: ''
      })
      setIsTuitionModalOpen(true)
    }
  }

  const handleDeleteTuition = (tuition: Tuition) => {
    setSelectedTuition(tuition)
    setIsDeleteModalOpen(true)
  }

  const handleSaveTuition = async (data: any) => {
    try {
      setIsSubmitting(true)
      
      if (selectedTuition) {
        // Update existing tuition
        const { error } = await tuitionService.updateTuitionFee(selectedTuition.id, data)
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
          })
          return
        }
        toast({
          title: "Success",
          description: "Tuition fee updated successfully"
        })
      } else {
        // Create new tuition
        const { error } = await tuitionService.createTuitionFee(data)
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
          })
          return
        }
        toast({
          title: "Success",
          description: "Tuition fee created successfully"
        })
      }
      
      setIsTuitionModalOpen(false)
      fetchData()
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save tuition fee",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedTuition) return
    
    try {
      setIsSubmitting(true)
      const { error } = await tuitionService.deleteTuitionFee(selectedTuition.id)
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        })
        return
      }
      
      toast({
        title: "Success",
        description: "Tuition fee deleted successfully"
      })
      
      setIsDeleteModalOpen(false)
      fetchData()
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete tuition fee",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredTuition = tuitionData.filter((tuition) => {
    const matchesSearch =
      tuition.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tuition.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tuition.semester.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = selectedLevel === "All Levels" || tuition.level === selectedLevel
    const matchesDepartment = selectedDepartment === "All Departments" || tuition.department === selectedDepartment
    return matchesSearch && matchesLevel && matchesDepartment
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading tuition data...</span>
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
          <h1 className="text-3xl font-bold text-gray-900">Tuition & Fees</h1>
          <p className="text-gray-600">Manage tuition fees and payment schedules</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleCreateTuition}
            className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Tuition Fee
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
                placeholder="Search tuition fees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-blue-200 focus:border-blue-400"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
                  <Filter className="h-4 w-4 mr-2" />
                  {selectedLevel}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
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
                <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
                  <Filter className="h-4 w-4 mr-2" />
                  {selectedDepartment}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
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
        </CardContent>
      </Card>

      {/* Tuition Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <DollarSign className="h-5 w-5 text-blue-600" />
            Tuition Fee Schedule
          </CardTitle>
          <CardDescription>Manage and view all tuition fees</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTuition.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No tuition fees found matching your criteria.</p>
            </div>
          ) : (
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTuition.map((tuition) => (
                  <TableRow key={tuition.id}>
                    <TableCell>{tuition.level}</TableCell>
                    <TableCell>{tuition.department}</TableCell>
                    <TableCell>{tuition.semester}</TableCell>
                    <TableCell>{tuition.credits}</TableCell>
                    <TableCell className="font-medium">${tuition.amount.toLocaleString()}</TableCell>
                    <TableCell>{tuition.dueDate}</TableCell>
                    <TableCell>
                      <Badge className={tuition.status === "Active" ? "bg-green-500" : "bg-gray-500"}>
                        {tuition.status}
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
                          <DropdownMenuItem onClick={() => handleEditTuition(tuition)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Fee
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteTuition(tuition)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Tuition Fee
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

      {/* Modals */}
      <TuitionModal
        isOpen={isTuitionModalOpen}
        onClose={() => setIsTuitionModalOpen(false)}
        onSave={handleSaveTuition}
        tuition={selectedTuition}
        students={students}
        isLoading={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Tuition Fee"
        description={`Are you sure you want to delete the tuition fee for ${selectedTuition?.department || 'this department'}? This action cannot be undone.`}
        isLoading={isSubmitting}
      />
    </div>
  )
}
