import { MessageSquare, Send, Search, Plus, Paperclip, Smile } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const conversations = [
  {
    id: 1,
    name: "Dr. Johnson",
    role: "Mathematics Professor",
    lastMessage: "Your assignment submission looks good. Keep up the excellent work!",
    time: "2 hours ago",
    unread: 2,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Prof. Smith",
    role: "Computer Science Professor",
    lastMessage: "The lab session has been moved to tomorrow at 2 PM.",
    time: "4 hours ago",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Study Group - CS 201",
    role: "Group Chat",
    lastMessage: "Anyone available for study session tonight?",
    time: "1 day ago",
    unread: 5,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Dr. Brown",
    role: "Physics Professor",
    lastMessage: "Please review the lab safety guidelines before next class.",
    time: "2 days ago",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const currentMessages = [
  {
    id: 1,
    sender: "Dr. Johnson",
    message: "Hello! I've reviewed your latest assignment submission.",
    time: "10:30 AM",
    isOwn: false,
  },
  {
    id: 2,
    sender: "You",
    message: "Thank you for the quick review, Professor!",
    time: "10:32 AM",
    isOwn: true,
  },
  {
    id: 3,
    sender: "Dr. Johnson",
    message:
      "Your approach to problem 3 was particularly impressive. The methodology you used shows deep understanding of the concepts.",
    time: "10:35 AM",
    isOwn: false,
  },
  {
    id: 4,
    sender: "You",
    message:
      "I really appreciate the feedback. I spent extra time on that problem to make sure I understood it completely.",
    time: "10:37 AM",
    isOwn: true,
  },
  {
    id: 5,
    sender: "Dr. Johnson",
    message: "Your assignment submission looks good. Keep up the excellent work!",
    time: "10:40 AM",
    isOwn: false,
  },
]

export default function Messages() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Communicate with professors and classmates</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
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
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors border border-transparent hover:border-blue-200"
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
            ))}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Dr. Johnson" />
                <AvatarFallback className="bg-blue-100 text-blue-600">DJ</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">Dr. Johnson</CardTitle>
                <CardDescription>Mathematics Professor • Online</CardDescription>
              </div>
            </div>
          </CardHeader>

          <Separator />

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentMessages.map((message) => (
              <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.isOwn ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-xs mt-1 ${message.isOwn ? "text-blue-100" : "text-gray-500"}`}>{message.time}</p>
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
              <Input placeholder="Type your message..." className="flex-1" />
              <Button variant="ghost" size="icon">
                <Smile className="h-4 w-4" />
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
