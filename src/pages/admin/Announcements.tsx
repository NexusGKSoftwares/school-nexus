"use client"

import { useState, useEffect } from "react"
import { Megaphone, Search, Filter, Plus, Edit, Trash2, Eye, Loader2 } from "lucide-react"

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
import { announcementService } from "@/lib/dataService"
import { AnnouncementModal } from "@/components/modals/AnnouncementModal"
import DeleteConfirmModal  from "@/components/modals/DeleteConfirmModal"
import { useToast } from "@/hooks/use-toast"

interface Announcement {
  id: string
  title: string
  author: string
  date: string
  department: string
  priority: string
  status: string
  content: string
  avatar?: string
}

export default function AdminAnnouncements() {
  const [announcementsData, setAnnouncementsData] = useState<Announcement[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [departmentList, setDepartmentList] = useState<string[]>(["All Departments"])
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const { data, error } = await announcementService.getAnnouncements()
      
      if (error) {
        setError(error.message)
        return
      }

      if (data) {
        const transformedAnnouncements: Announcement[] = data.map((announcement) => ({
          id: announcement.id,
          title: announcement.title,
          author: announcement.author.full_name,
          date: announcement.created_at,
          department: "All Departments", // Placeholder since we don't have department in our schema
          priority: announcement.priority,
          status: announcement.is_published ? "Published" : "Draft",
          content: announcement.content,
          avatar: announcement.author.avatar_url || "/placeholder.svg?height=40&width=40",
        }))
        setAnnouncementsData(transformedAnnouncements)
        
        // Extract unique departments (for now just use "All Departments")
        setDepartmentList(["All Departments"])
      }
    } catch (err) {
      setError("Failed to fetch announcements")
      console.error("Error fetching announcements:", err)
    } finally {
      setLoading(false)
    }
  }

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
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-orange-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleCreateAnnouncement = () => {
    setSelectedAnnouncement(null)
    setIsAnnouncementModalOpen(true)
  }

  const handleEditAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement({
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      is_published: announcement.status === "Published",
      author_id: '', // You may want to map author name to id if available
      department: announcement.department,
      created_at: announcement.date ? new Date(announcement.date) : new Date(),
    })
    setIsAnnouncementModalOpen(true)
  }

  const handleDeleteAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setIsDeleteModalOpen(true)
  }

  const handleSaveAnnouncement = async (data: any) => {
    try {
      setIsSubmitting(true)
      if (selectedAnnouncement) {
        // Update
        const { error } = await announcementService.updateAnnouncement(selectedAnnouncement.id, data)
        if (error) {
          toast({ title: "Error", description: error.message, variant: "destructive" })
          return
        }
        toast({ title: "Success", description: "Announcement updated successfully" })
      } else {
        // Create
        const { error } = await announcementService.createAnnouncement(data)
        if (error) {
          toast({ title: "Error", description: error.message, variant: "destructive" })
          return
        }
        toast({ title: "Success", description: "Announcement created successfully" })
      }
      setIsAnnouncementModalOpen(false)
      fetchAnnouncements()
    } catch (err) {
      toast({ title: "Error", description: "Failed to save announcement", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedAnnouncement) return
    try {
      setIsSubmitting(true)
      const { error } = await announcementService.deleteAnnouncement(selectedAnnouncement.id)
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" })
        return
      }
      toast({ title: "Success", description: "Announcement deleted successfully" })
      setIsDeleteModalOpen(false)
      fetchAnnouncements()
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete announcement", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading announcements...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchAnnouncements}>Retry</Button>
        </div>
      </div>
    )
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
          <Button onClick={handleCreateAnnouncement} className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Announcement
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search announcements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-blue-200 focus:border-blue-400"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {departmentList.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Announcements Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Megaphone className="h-5 w-5 text-purple-600" />
            Recent Announcements
          </CardTitle>
          <CardDescription>
            {filteredAnnouncements.length} of {announcementsData.length} announcements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAnnouncements.length === 0 ? (
            <div className="text-center py-8">
              <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No announcements found matching your criteria.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
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
                      <Badge className={getPriorityColor(announcement.priority)}>
                        {announcement.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={announcement.status === "Published" ? "default" : "secondary"}
                        className={announcement.status === "Published" ? "bg-green-500" : "bg-gray-500"}
                      >
                        {announcement.status}
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
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditAnnouncement(announcement)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Megaphone className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteAnnouncement(announcement)}>
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
      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        onSave={handleSaveAnnouncement}
        announcement={selectedAnnouncement}
        isLoading={isSubmitting}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Announcement"
        description={`Are you sure you want to delete the announcement "${selectedAnnouncement?.title || ''}"? This action cannot be undone.`}
        isLoading={isSubmitting}
      />
    </div>
  )
}
