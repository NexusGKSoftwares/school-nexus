"use client"

import { User, Mail, Phone, MapPin, Calendar, Edit, Camera, Save, X } from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const lecturerData = {
  name: "Dr. Sarah Mitchell",
  title: "Associate Professor",
  department: "Computer Science Department",
  email: "sarah.mitchell@university.edu",
  phone: "+1 (555) 123-4567",
  office: "CS Building, Room 301",
  joinDate: "September 2018",
  employeeId: "EMP001",
  avatar: "/placeholder.svg?height=120&width=120",
  bio: "Dr. Sarah Mitchell is an Associate Professor in the Computer Science Department with over 10 years of experience in software engineering and data structures. She holds a Ph.D. in Computer Science from MIT and has published numerous papers in top-tier conferences.",
  specializations: ["Data Structures", "Algorithms", "Software Engineering", "Database Systems"],
  education: [
    {
      degree: "Ph.D. in Computer Science",
      institution: "Massachusetts Institute of Technology",
      year: "2015",
    },
    {
      degree: "M.S. in Computer Science",
      institution: "Stanford University",
      year: "2012",
    },
    {
      degree: "B.S. in Computer Science",
      institution: "University of California, Berkeley",
      year: "2010",
    },
  ],
  officeHours: [
    { day: "Monday", time: "2:00 PM - 4:00 PM" },
    { day: "Wednesday", time: "10:00 AM - 12:00 PM" },
    { day: "Friday", time: "1:00 PM - 3:00 PM" },
  ],
}

export default function LecturerProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(lecturerData)

  const handleSave = () => {
    // Save logic here
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(lecturerData)
    setIsEditing(false)
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>
        <div className="flex items-center gap-4">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-blue-500 hover:bg-blue-600">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={formData.avatar || "/placeholder.svg"} alt={formData.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">SM</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button size="sm" className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0" variant="outline">
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-gray-900">{formData.name}</h2>
                <p className="text-blue-600 font-medium">{formData.title}</p>
                <p className="text-gray-600">{formData.department}</p>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <User className="h-5 w-5 text-blue-600" />
              Personal Information
            </CardTitle>
            <CardDescription>Your basic information and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                ) : (
                  <p className="text-gray-900">{formData.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                {isEditing ? (
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                ) : (
                  <p className="text-gray-900">{formData.title}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900">{formData.email}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900">{formData.phone}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="office">Office Location</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  {isEditing ? (
                    <Input
                      id="office"
                      value={formData.office}
                      onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900">{formData.office}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinDate">Join Date</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <p className="text-gray-900">{formData.joinDate}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biography</Label>
              {isEditing ? (
                <textarea
                  id="bio"
                  className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              ) : (
                <p className="text-gray-700">{formData.bio}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Education */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800">Education</CardTitle>
            <CardDescription>Academic qualifications and degrees</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.education.map((edu, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                <p className="text-blue-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.year}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Office Hours */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800">Office Hours</CardTitle>
            <CardDescription>Available times for student consultations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.officeHours.map((hour, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                <span className="font-medium text-gray-900">{hour.day}</span>
                <span className="text-blue-600">{hour.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Specializations */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-800">Specializations</CardTitle>
          <CardDescription>Areas of expertise and research interests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {formData.specializations.map((spec, index) => (
              <Badge key={index} variant="outline" className="px-3 py-1">
                {spec}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
