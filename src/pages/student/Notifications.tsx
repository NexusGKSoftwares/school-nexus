"use client"

import { useState, useEffect } from "react"
import { Bell, CheckCircle, AlertTriangle, Info, X, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { announcementService } from "@/lib/dataService"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  id: string
  title: string
  content: string
  type: string
  created_at: string
  read: boolean
  priority: string
  author?: {
    first_name: string
    last_name: string
  }
}

export default function Notifications() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user])

  const fetchNotifications = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Fetch announcements as notifications
      const { data: announcementsData, error: announcementsError } = await announcementService.getAnnouncements()
      
      if (announcementsError) {
        setError(announcementsError.message)
        return
      }

      if (announcementsData) {
        // Transform announcements into notifications
        const transformedNotifications: Notification[] = announcementsData.map((announcement, index) => ({
          id: announcement.id,
          title: announcement.title,
          content: announcement.content,
          type: announcement.priority === 'high' ? 'warning' : announcement.priority === 'medium' ? 'info' : 'success',
          created_at: announcement.created_at,
          read: index > 2, // First 3 are unread for demo
          priority: announcement.priority,
          author: announcement.author,
        }))
        setNotifications(transformedNotifications)
      }
    } catch (err) {
      setError("Failed to fetch notifications")
      console.error("Error fetching notifications:", err)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
    toast({
      title: "Success",
      description: "All notifications marked as read",
    })
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId))
    toast({
      title: "Success",
      description: "Notification deleted",
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50"
      case "warning":
        return "border-orange-200 bg-orange-50"
      case "info":
      default:
        return "border-blue-200 bg-blue-50"
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading notifications...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchNotifications}>Retry</Button>
        </div>
      </div>
    )
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with your academic activities</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="destructive" className="text-sm">
            {unreadCount} Unread
          </Badge>
          <Button variant="outline" onClick={markAllAsRead}>Mark All as Read</Button>
        </div>
      </div>

      {/* Notification Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                <Bell className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{notifications.length}</div>
                <div className="text-sm text-gray-600">Total Notifications</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{unreadCount}</div>
                <div className="text-sm text-gray-600">Unread</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-green-600 text-white">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{notifications.length - unreadCount}</div>
                <div className="text-sm text-gray-600">Read</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Bell className="h-5 w-5 text-blue-600" />
            Recent Notifications
          </CardTitle>
          <CardDescription>Your latest updates and announcements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No notifications yet.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                  notification.read ? "bg-white border-gray-200" : getNotificationColor(notification.type)
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className={`font-semibold ${notification.read ? "text-gray-700" : "text-gray-900"}`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className={`text-sm ${notification.read ? "text-gray-600" : "text-gray-700"}`}>
                      {notification.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{formatTimeAgo(notification.created_at)}</span>
                      {!notification.read && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-7 text-xs"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
