"use client"

import { Upload, File, Video, ImageIcon, FileText, Download, Eye, Trash2, Plus, Search, Filter, Loader2, Edit } from "lucide-react"
import { useState, useEffect } from "react"
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
import { materialService, courseService } from "@/lib/dataService"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"

// Import modals
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal"
import MaterialModal from "@/components/modals/MaterialModal"

interface Material {
  id: string
  title: string
  description: string
  file_url: string
  file_type: string
  file_size: number
  course_id: string
  lecturer_id: string
  status: string
  created_at: string
  downloads_count: number
  course?: {
    code: string
    name: string
  }
}

export default function LecturerMaterials() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [materials, setMaterials] = useState<Material[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [selectedCourse, setSelectedCourse] = useState("All Courses")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Fetch materials for the logged-in lecturer
      const { data: materialsData, error: materialsError } = await materialService.getMaterialsByLecturer(user.id)
      
      if (materialsError) {
        setError(materialsError.message)
        return
      }

      // Fetch courses for the lecturer
      const { data: coursesData, error: coursesError } = await courseService.getCoursesByLecturer(user.id)
      
      if (coursesError) {
        setError(coursesError.message)
        return
      }

      if (materialsData) {
        setMaterials(materialsData)
      }

      if (coursesData) {
        setCourses(coursesData)
      }
    } catch (err) {
      setError("Failed to fetch materials data")
      console.error("Error fetching materials data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleUploadMaterial = () => {
    setSelectedMaterial(null)
    setModalMode('create')
    setIsMaterialModalOpen(true)
  }

  const handleEditMaterial = (material: Material) => {
    setSelectedMaterial(material)
    setModalMode('edit')
    setIsMaterialModalOpen(true)
  }

  const handleSaveMaterial = async (data: any) => {
    if (!user) return;
    try {
      setIsSubmitting(true)
      let error
      if (modalMode === 'edit' && selectedMaterial) {
        ({ error } = await materialService.updateMaterial(selectedMaterial.id, data))
      } else {
        ({ error } = await materialService.createMaterial({ ...data, lecturer_id: user.id }))
      }
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        })
        return
      }
      toast({
        title: 'Success',
        description: `Material ${modalMode === 'edit' ? 'updated' : 'created'} successfully`,
      })
      setIsMaterialModalOpen(false)
      fetchData()
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to save material',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteMaterial = (material: Material) => {
    setSelectedMaterial(material)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedMaterial) {
      try {
        setIsSubmitting(true)
        
        const { error } = await materialService.deleteMaterial(selectedMaterial.id)
        
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          })
          return
        }

        toast({
          title: "Success",
          description: "Material deleted successfully",
        })
        
        setIsDeleteModalOpen(false)
        fetchData() // Refresh the data
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete material",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse = selectedCourse === "All Courses" || material.course?.code === selectedCourse
    return matchesSearch && matchesCourse
  })

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-600" />
      case "mp4":
      case "avi":
      case "mov":
        return <Video className="h-5 w-5 text-blue-600" />
      case "ppt":
      case "pptx":
        return <ImageIcon className="h-5 w-5 text-orange-600" />
      case "doc":
      case "docx":
        return <File className="h-5 w-5 text-blue-600" />
      default:
        return <File className="h-5 w-5 text-gray-600" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading materials...</span>
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

  const totalMaterials = materials.length
  const totalDownloads = materials.reduce((sum, material) => sum + (material.downloads_count || 0), 0)
  const publishedMaterials = materials.filter((m) => m.status === "published").length

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Materials</h1>
          <p className="text-gray-600">Upload and manage learning resources for your courses</p>
        </div>
        <Button 
          onClick={handleUploadMaterial}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
          disabled={isSubmitting}
        >
          <Plus className="h-4 w-4 mr-2" />
          Upload Material
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                <File className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{totalMaterials}</div>
                <div className="text-sm text-gray-600">Total Materials</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-green-600 text-white">
                <Download className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{totalDownloads}</div>
                <div className="text-sm text-gray-600">Total Downloads</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white">
                <Upload className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{publishedMaterials}</div>
                <div className="text-sm text-gray-600">Published</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{courses.length}</div>
                <div className="text-sm text-gray-600">Courses</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search materials by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <File className="h-5 w-5 text-blue-600" />
            Material Records
          </CardTitle>
          <CardDescription>
            Showing {filteredMaterials.length} of {materials.length} materials
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredMaterials.length === 0 ? (
            <div className="text-center py-8">
              <File className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No materials found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaterials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getFileIcon(material.file_type)}
                        <div>
                          <div className="font-medium text-gray-900">{material.title}</div>
                          <div className="text-sm text-gray-500">{material.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-blue-200 text-blue-700">
                        {material.course?.code || 'Unknown Course'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{material.file_type.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{formatFileSize(material.file_size)}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={material.status === "published" ? "default" : "secondary"}
                        className={
                          material.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {material.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">
                        {new Date(material.created_at).toLocaleDateString()}
                      </div>
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
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditMaterial(material)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteMaterial(material)}
                            className="text-red-600"
                          >
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

      {/* Modals */}
      <MaterialModal
        isOpen={isMaterialModalOpen}
        onClose={() => setIsMaterialModalOpen(false)}
        onSave={handleSaveMaterial}
        material={modalMode === 'edit' ? selectedMaterial : null}
        courses={courses.map((c: any) => ({ id: c.id, code: c.code, name: c.name }))}
        mode={modalMode}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Material"
        description={`Are you sure you want to delete ${selectedMaterial?.title}? This action cannot be undone.`}
        isLoading={isSubmitting} itemName={""}      />
    </div>
  )
}
