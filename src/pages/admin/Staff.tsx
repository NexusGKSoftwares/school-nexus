"use client"

import { useState, useEffect } from "react"
import { Users, Search, Filter, Download, Plus, Edit, Trash2, Eye, Mail, Shield, UserCheck, Loader2 } from "lucide-react"

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
import { staffService } from "@/lib/dataService"
import  StaffModal  from "@/components/modals/StaffModal"
import DeleteConfirmModal  from "@/components/modals/DeleteConfirmModal"
import { useToast } from "@/hooks/use-toast"

interface Staff {
  id: string
  name: string
  email: string
  phone: string
  department: string
  position: string
  role: string
  experience: string
  status: string
  joinDate: string
  avatar: string
}

interface DepartmentStats {
  department: string
  count: number
  percentage: number
}

export default function AdminStaff() {
  const [staffData, setStaffData] = useState<Staff[]>([])
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch staff data
      const { data: staff, error: staffError } = await staffService.getStaff()
      
      if (staffError) {
        setError(staffError.message)
        return
      }

      if (staff) {
        const transformedStaff: Staff[] = staff.map((member) => ({
          id: member.id,
          name: `${member.first_name} ${member.last_name}`,
          email: member.email,
          phone: member.phone || "N/A",
          department: member.department || "General",
          position: member.position || "Staff Member",
          role: member.role || "Support",
          experience: member.experience_years ? `${member.experience_years} years` : "N/A",
          status: member.status,
          joinDate: member.hire_date || "N/A",
          avatar: member.avatar_url || "/placeholder.svg?height=40&width=40",
        }))
        setStaffData(transformedStaff)

        // Calculate department statistics
        const deptCounts = transformedStaff.reduce((acc, member) => {
          acc[member.department] = (acc[member.department] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        const totalStaff = transformedStaff.length
        const deptStats: DepartmentStats[] = Object.entries(deptCounts).map(([dept, count]) => ({
          department: dept,
          count,
          percentage: Math.round((count / totalStaff) * 100),
        }))

        setDepartmentStats(deptStats)
      }
    } catch (err) {
      setError("Failed to fetch staff data")
      console.error("Error fetching staff data:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredStaff = staffData.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "All" || staff.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const activeStaff = staffData.filter(staff => staff.status === "Active").length
  const adminRoles = staffData.filter(staff => staff.role === "Admin").length
  const avgExperience = staffData.length > 0 
    ? (staffData.reduce((sum, staff) => {
        const years = parseInt(staff.experience) || 0
        return sum + years
      }, 0) / staffData.length).toFixed(1)
    : "0"

  const handleCreateStaff = () => {
    setSelectedStaff(null)
    setIsStaffModalOpen(true)
  }

  const handleEditStaff = (staff: Staff) => {
    setSelectedStaff({
      id: staff.id,
      first_name: staff.name.split(' ')[0],
      last_name: staff.name.split(' ')[1] || '',
      email: staff.email,
      phone: staff.phone,
      department: staff.department,
      position: staff.position,
      role: staff.role,
      experience_years: parseInt(staff.experience) || 0,
      status: staff.status,
      hire_date: staff.joinDate,
      avatar_url: staff.avatar,
    })
    setIsStaffModalOpen(true)
  }

  const handleDeleteStaff = (staff: Staff) => {
    setSelectedStaff(staff)
    setIsDeleteModalOpen(true)
  }

  const handleSaveStaff = async (data: any) => {
    try {
      setIsSubmitting(true)
      if (selectedStaff) {
        // Update
        const { error } = await staffService.updateStaff(selectedStaff.id, data)
        if (error) {
          toast({ title: "Error", description: error.message, variant: "destructive" })
          return
        }
        toast({ title: "Success", description: "Staff updated successfully" })
      } else {
        // Create
        const { error } = await staffService.createStaff(data)
        if (error) {
          toast({ title: "Error", description: error.message, variant: "destructive" })
          return
        }
        toast({ title: "Success", description: "Staff created successfully" })
      }
      setIsStaffModalOpen(false)
      fetchData()
    } catch (err) {
      toast({ title: "Error", description: "Failed to save staff", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedStaff) return
    try {
      setIsSubmitting(true)
      const { error } = await staffService.deleteStaff(selectedStaff.id)
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" })
        return
      }
      toast({ title: "Success", description: "Staff deleted successfully" })
      setIsDeleteModalOpen(false)
      fetchData()
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete staff", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading staff data...</span>
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
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600">Manage administrative and support staff members</p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handleCreateStaff} className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
          <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
            <Download className="h-4 w-4 mr-2" />
            Export
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
                <div className="text-2xl font-bold text-gray-800">{staffData.length}</div>
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
                <div className="text-2xl font-bold text-gray-800">{activeStaff}</div>
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
                <div className="text-2xl font-bold text-gray-800">{adminRoles}</div>
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
                <div className="text-2xl font-bold text-gray-800">{avgExperience}</div>
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
            {departmentStats.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">No department data available</p>
              </div>
            ) : (
              departmentStats.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{dept.department}</span>
                    <span className="text-gray-600">{dept.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                      style={{ width: `${dept.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">{dept.percentage}%</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Staff List */}
        <div className="lg:col-span-3">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-gray-800">Staff Directory</CardTitle>
                  <CardDescription>All staff members and their details</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search staff..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64 border-blue-200 focus:border-blue-400"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
                        <Filter className="h-4 w-4 mr-2" />
                        Department
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Filter by Department</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setSelectedDepartment("All")}>
                        All Departments
                      </DropdownMenuItem>
                      {Array.from(new Set(staffData.map(staff => staff.department))).map((dept) => (
                        <DropdownMenuItem key={dept} onClick={() => setSelectedDepartment(dept)}>
                          {dept}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredStaff.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No staff members found matching your criteria.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={staff.avatar} alt={staff.name} />
                              <AvatarFallback>{staff.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900">{staff.name}</div>
                              <div className="text-sm text-gray-600">{staff.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{staff.department}</TableCell>
                        <TableCell>{staff.position}</TableCell>
                        <TableCell>
                          <Badge variant={staff.role === "Admin" ? "default" : "secondary"}>
                            {staff.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{staff.experience}</TableCell>
                        <TableCell>
                          <Badge className={staff.status === "Active" ? "bg-green-500" : "bg-yellow-500"}>
                            {staff.status}
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
                              <DropdownMenuItem onClick={() => handleEditStaff(staff)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteStaff(staff)}>
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
        </div>
      </div>
      {/* Modals */}
      <StaffModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        onSave={handleSaveStaff}
        staff={selectedStaff}
        isLoading={isSubmitting} departments={[]} mode={"create"}      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Staff"
        description={`Are you sure you want to delete ${selectedStaff?.name || 'this staff member'}? This action cannot be undone.`}
        isLoading={isSubmitting} itemName={""}      />
    </div>
  )
}
