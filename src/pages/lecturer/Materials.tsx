"use client"

import { Upload, File, Video, ImageIcon, FileText, Download, Eye, Trash2, Plus, Search, Filter } from "lucide-react"
import { useState } from "react"
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

const materialsData = [
  {
    id: 1,
    name: "Introduction to Data Structures.pdf",
    type: "PDF",
    course: "CS 301",
    size: "2.5 MB",
    uploadDate: "2024-01-15",
    downloads: 45,
    status: "Published",
  },
  {
    id: 2,
    name: "Binary Trees Lecture Video.mp4",
    type: "Video",
    course: "CS 301",
    size: "125 MB",
    uploadDate: "2024-01-14",
    downloads: 38,
    status: "Published",
  },
  {
    id: 3,
    name: "Database Design Slides.pptx",
    type: "Presentation",
    course: "CS 401",
    size: "8.2 MB",
    uploadDate: "2024-01-13",
    downloads: 32,
    status: "Published",
  },
  {
    id: 4,
    name: "SQL Practice Exercises.docx",
    type: "Document",
    course: "CS 401",
    size: "1.8 MB",
    uploadDate: "2024-01-12",
    downloads: 28,
    status: "Draft",
  },
  {
    id: 5,
    name: "Software Engineering Principles.pdf",
    type: "PDF",
    course: "CS 402",
    size: "3.1 MB",
    uploadDate: "2024-01-11",
    downloads: 41,
    status: "Published",
  },
]

const courseList = ["All Courses", "CS 301", "CS 401", "CS 402", "CS 350"]

export default function LecturerMaterials() {
  const [selectedCourse, setSelectedCourse] = useState("All Courses")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMaterials = materialsData.filter((material) => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse = selectedCourse === "All Courses" || material.course === selectedCourse
    return matchesSearch && matchesCourse
  })

  const getFileIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FileText className="h-5 w-5 text-red-600" />
      case "Video":
        return <Video className="h-5 w-5 text-blue-600" />
      case "Presentation":
        return <ImageIcon className="h-5 w-5 text-orange-600" />
      case "Document":
        return <File className="h-5 w-5 text-blue-600" />
      default:
        return <File className="h-5 w-5 text-gray-600" />
    }
  }

  const totalMaterials = materialsData.length
  const totalDownloads = materialsData.reduce((sum, material) => sum + material.downloads, 0)
  const publishedMaterials = materialsData.filter((m) => m.status === "Published").length

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Materials</h1>
          <p className="text-gray-600">Upload and manage learning resources for your courses</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
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
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white">
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
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{totalMaterials - publishedMaterials}</div>
                <div className="text-sm text-gray-600">Drafts</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Area */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Upload className="h-5 w-5 text-blue-600" />
            Quick Upload
          </CardTitle>
          <CardDescription>Drag and drop files or click to browse</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
            <Upload className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">Drop files here to upload</p>
            <p className="text-sm text-gray-500 mb-4">Supports PDF, DOC, PPT, MP4, and image files</p>
            <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
              Browse Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Materials Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <File className="h-5 w-5 text-blue-600" />
                Materials Library
              </CardTitle>
              <CardDescription>Manage all your course materials</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    {selectedCourse}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Course</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {courseList.map((course) => (
                    <DropdownMenuItem key={course} onClick={() => setSelectedCourse(course)}>
                      {course}
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
                <TableHead>File</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaterials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getFileIcon(material.type)}
                      <div>
                        <div className="font-medium text-gray-900">{material.name}</div>
                        <div className="text-sm text-gray-600">{material.type}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{material.course}</TableCell>
                  <TableCell>{material.size}</TableCell>
                  <TableCell>{new Date(material.uploadDate).toLocaleDateString()}</TableCell>
                  <TableCell>{material.downloads}</TableCell>
                  <TableCell>
                    <Badge
                      variant={material.status === "Published" ? "default" : "secondary"}
                      className={material.status === "Published" ? "bg-green-500" : "bg-orange-500"}
                    >
                      {material.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
