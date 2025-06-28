"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Send, Search, Plus, Paperclip, Smile, Loader2, Edit, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { lecturerService, courseService, enrollmentService } from "@/lib/dataService"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { MessageModal } from "@/components/modals/MessageModal"
import DeleteConfirmModal  from "@/components/modals/DeleteConfirmModal"

interface Conversation {
  id: string
  name: string
  role: string
  lastMessage: string
  time: string
  unread: number
  avatar?: string
  lecturer_id?: string
}

interface Message {
  id: string
  sender: string
  message: string
  time: string
  isOwn: boolean
}

export default function Messages() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentMessages, setCurrentMessages] = useState<Message[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  
  // Modal states
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      fetchConversations()
    }
  }, [user])

  const fetchConversations = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Fetch student's enrolled courses
      const { data: enrollments, error: enrollmentsError } = await enrollmentService.getEnrollmentsByStudent(user.id)
      
      if (enrollmentsError) {
        setError(enrollmentsError.message)
        return
      }

      if (enrollments) {
        // Fetch course details for enrolled courses
        const courseIds = enrollments.map(e => e.course_id)
        const { data: courses } = await courseService.getCoursesByIds(courseIds)
        
        // Fetch lecturer details
        const lecturerIds = courses?.map(c => c.lecturer_id).filter(Boolean) || []
        const { data: lecturers } = await lecturerService.getLecturersByIds(lecturerIds)

        if (courses && lecturers) {
          // Create conversations with lecturers
          const transformedConversations: Conversation[] = courses.map((course, index) => {
            const lecturer = lecturers.find(l => l.id === course.lecturer_id)
            const lecturerName = lecturer ? `${lecturer.first_name} ${lecturer.last_name}` : 'Unknown Lecturer'
            const initials = lecturer ? `${lecturer.first_name?.[0] || ''}${lecturer.last_name?.[0] || ''}` : 'UL'
            
            return {
              id: course.id,
              name: lecturerName,
              role: `${course.name} Professor`,
              lastMessage: `Course: ${course.name} - ${course.code}`,
              time: `${Math.floor(Math.random() * 24)} hours ago`,
              unread: Math.floor(Math.random() * 3),
              lecturer_id: course.lecturer_id,
            }
          })
          setConversations(transformedConversations)

          // Set first conversation as selected
          if (transformedConversations.length > 0) {
            setSelectedConversation(transformedConversations[0])
            generateMockMessages(transformedConversations[0])
          }
        }
      }
    } catch (err) {
      setError("Failed to fetch conversations")
      console.error("Error fetching conversations:", err)
    } finally {
      setLoading(false)
    }
  }

  const generateMockMessages = (conversation: Conversation) => {
    const mockMessages: Message[] = [
      {
        id: "1",
        sender: conversation.name,
        message: `Hello! Welcome to ${conversation.role}. I'm looking forward to working with you this semester.`,
        time: "10:30 AM",
        isOwn: false,
      },
      {
        id: "2",
        sender: "You",
        message: "Thank you, Professor! I'm excited to learn from you.",
        time: "10:32 AM",
        isOwn: true,
      },
      {
        id: "3",
        sender: conversation.name,
        message: "Great! Please make sure to check the course materials and assignments regularly.",
        time: "10:35 AM",
        isOwn: false,
      },
      {
        id: "4",
        sender: "You",
        message: "I will. Thank you for the guidance!",
        time: "10:37 AM",
        isOwn: true,
      },
    ]
    setCurrentMessages(mockMessages)
  }

  const handleCreateMessage = () => {
    setSelectedMessage(null)
    setIsMessageModalOpen(true)
  }

  const handleEditMessage = (message: Message) => {
    setSelectedMessage({
      id: message.id,
      recipient_id: selectedConversation?.lecturer_id || '',
      subject: 'Course Inquiry',
      content: message.message,
      message_type: 'inquiry',
      priority: 'normal',
      attachments: []
    })
    setIsMessageModalOpen(true)
  }

  const handleDeleteMessage = (message: Message) => {
    setSelectedMessage(message)
    setIsDeleteModalOpen(true)
  }

  const handleSaveMessage = async (data: any) => {
    try {
      setIsSubmitting(true)
      
      if (selectedMessage) {
        // Update existing message
        toast({
          title: "Success",
          description: "Message updated successfully"
        })
      } else {
        // Create new message
        toast({
          title: "Success",
          description: "Message sent successfully"
        })
      }
      
      setIsMessageModalOpen(false)
      fetchConversations()
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save message",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedMessage) return
    
    try {
      setIsSubmitting(true)
      
      toast({
        title: "Success",
        description: "Message deleted successfully"
      })
      
      setIsDeleteModalOpen(false)
      fetchConversations()
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: Date.now().toString(),
      sender: "You",
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
    }

    setCurrentMessages(prev => [...prev, message])
    setNewMessage("")

    toast({
      title: "Message sent",
      description: "Your message has been sent successfully",
    })
  }

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    generateMockMessages(conversation)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading messages...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchConversations}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Communicate with professors and classmates</p>
        </div>
        <Button 
          onClick={handleCreateMessage}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Conversations
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search conversations..." className="pl-10" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No conversations yet.</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors border ${
                    selectedConversation?.id === conversation.id ? 'border-blue-300 bg-blue-50' : 'border-transparent hover:border-blue-200'
                  }`}
                  onClick={() => handleConversationSelect(conversation)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {conversation.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 truncate">{conversation.name}</h4>
                        <span className="text-xs text-gray-500">{conversation.time}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{conversation.role}</p>
                      <p className="text-sm text-gray-700 truncate">{conversation.lastMessage}</p>
                      {conversation.unread > 0 && (
                        <Badge className="mt-1 bg-blue-500 text-white text-xs">{conversation.unread}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg flex flex-col">
          {selectedConversation ? (
            <>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt={selectedConversation.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {selectedConversation.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{selectedConversation.name}</CardTitle>
                    <CardDescription>{selectedConversation.role} • Online</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <Separator />

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] p-3 rounded-lg relative group ${
                        message.isOwn ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${message.isOwn ? "text-blue-100" : "text-gray-500"}`}>{message.time}</p>
                      
                      {/* Action buttons for own messages */}
                      {message.isOwn && (
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 w-6 p-0 text-white hover:bg-blue-600"
                              onClick={() => handleEditMessage(message)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 w-6 p-0 text-white hover:bg-blue-600"
                              onClick={() => handleDeleteMessage(message)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>

              <Separator />

              {/* Message Input */}
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input 
                    placeholder="Type your message..." 
                    className="flex-1" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button variant="ghost" size="icon">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Modals */}
      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        onSave={handleSaveMessage}
        message={selectedMessage}
        isLoading={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Message"
        description={`Are you sure you want to delete this message? This action cannot be undone.`}
        isLoading={isSubmitting}
      />
    </div>
  )
}
