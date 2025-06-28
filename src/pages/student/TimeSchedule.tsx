"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, Video, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { enrollmentService, courseService, lecturerService } from "@/lib/dataService"
import { useAuth } from "@/contexts/AuthContext"

interface ScheduleItem {
  time: string
  subject: string
  code: string
  instructor: string
  room: string
  type: string
  day: string
}

interface UpcomingClass {
  subject: string
  time: string
  duration: string
  room: string
  type: string
  status: string
}

export default function TimeSchedule() {
  const { user } = useAuth()
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([])
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    if (!user) return

    try {
      setLoading(true)
      
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

        if (courses) {
          const transformedSchedule: ScheduleItem[] = courses.map((course, index) => {
            const lecturer = lecturers?.find(l => l.id === course.lecturer_id)
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            const times = ['09:00 AM - 10:30 AM', '11:00 AM - 12:30 PM', '02:00 PM - 03:30 PM', '10:00 AM - 11:30 AM', '01:00 PM - 02:30 PM']
            const types = ['Lecture', 'Lab', 'Lecture', 'Seminar', 'Tutorial']
            
            return {
              time: times[index % times.length],
              subject: course.name,
              code: course.code,
              instructor: lecturer ? `${lecturer.first_name} ${lecturer.last_name}` : 'TBD',
              room: course.room || 'TBD',
              type: types[index % types.length],
              day: days[index % days.length],
            }
          })
          setScheduleData(transformedSchedule)

          // Generate upcoming classes based on schedule
          const mockUpcomingClasses: UpcomingClass[] = transformedSchedule.slice(0, 3).map((item, index) => ({
            subject: item.subject,
            time: item.time.split(' - ')[0],
            duration: '1h 30m',
            room: item.room,
            type: item.type,
            status: 'upcoming',
          }))
          setUpcomingClasses(mockUpcomingClasses)
        }
      }
    } catch (err) {
      setError("Failed to fetch schedule data")
      console.error("Error fetching schedule data:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading schedule data...</span>
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
          <h1 className="text-3xl font-bold text-gray-900">Time Schedule</h1>
          <p className="text-gray-600">Manage your class timetable and upcoming sessions</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
          <Calendar className="h-4 w-4 mr-2" />
          Export Schedule
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Classes */}
        <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Calendar className="h-5 w-5 text-blue-600" />
              Weekly Schedule
            </CardTitle>
            <CardDescription>Your complete class timetable</CardDescription>
          </CardHeader>
          <CardContent>
            {scheduleData.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No classes scheduled yet.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduleData.map((class_, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{class_.time}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{class_.subject}</div>
                          <div className="text-sm text-gray-500">{class_.code}</div>
                        </div>
                      </TableCell>
                      <TableCell>{class_.instructor}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {class_.room === "Online" ? (
                            <Video className="h-4 w-4 text-green-600" />
                          ) : (
                            <MapPin className="h-4 w-4 text-blue-600" />
                          )}
                          <span>{class_.room}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={class_.type === "Lab" ? "default" : "secondary"}>{class_.type}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          Join
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Classes */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Clock className="h-5 w-5 text-blue-600" />
              Today's Classes
            </CardTitle>
            <CardDescription>Your classes for today</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingClasses.length === 0 ? (
              <div className="text-center py-4">
                <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No classes today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingClasses.map((class_, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-gray-800">{class_.subject}</div>
                        <Badge variant={class_.type === "Lab" ? "default" : "secondary"}>{class_.type}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>
                          {class_.time} ({class_.duration})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{class_.room}</span>
                      </div>
                      <Button size="sm" className="w-full mt-2">
                        Join Class
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Calendar View */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Calendar className="h-5 w-5 text-blue-600" />
            Calendar View
          </CardTitle>
          <CardDescription>Monthly view of your academic schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Calendar view coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
