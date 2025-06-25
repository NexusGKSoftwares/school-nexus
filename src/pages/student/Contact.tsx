import { Phone, Mail, MapPin, Clock, Send, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

const contactInfo = [
  {
    title: "Main Office",
    details: [
      { icon: Phone, text: "+1 (555) 123-4567" },
      { icon: Mail, text: "info@eduplatform.edu" },
      { icon: MapPin, text: "123 University Ave, Education City, EC 12345" },
    ],
  },
  {
    title: "Student Services",
    details: [
      { icon: Phone, text: "+1 (555) 123-4568" },
      { icon: Mail, text: "students@eduplatform.edu" },
      { icon: Clock, text: "Mon-Fri: 8:00 AM - 6:00 PM" },
    ],
  },
  {
    title: "Technical Support",
    details: [
      { icon: Phone, text: "+1 (555) 123-4569" },
      { icon: Mail, text: "support@eduplatform.edu" },
      { icon: Clock, text: "24/7 Support Available" },
    ],
  },
]

const departments = [
  {
    name: "Admissions Office",
    email: "admissions@eduplatform.edu",
    phone: "+1 (555) 123-4570",
    hours: "Mon-Fri: 9:00 AM - 5:00 PM",
  },
  {
    name: "Financial Aid",
    email: "finaid@eduplatform.edu",
    phone: "+1 (555) 123-4571",
    hours: "Mon-Fri: 8:30 AM - 4:30 PM",
  },
  {
    name: "Academic Advising",
    email: "advising@eduplatform.edu",
    phone: "+1 (555) 123-4572",
    hours: "Mon-Fri: 9:00 AM - 5:00 PM",
  },
  {
    name: "Career Services",
    email: "careers@eduplatform.edu",
    phone: "+1 (555) 123-4573",
    hours: "Mon-Fri: 10:00 AM - 4:00 PM",
  },
]

export default function Contact() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
          <p className="text-gray-600">Get in touch with our team for assistance</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
          <MessageSquare className="h-4 w-4 mr-2" />
          Live Chat
        </Button>
      </div>

      {/* Contact Information */}
      <div className="grid gap-4 md:grid-cols-3">
        {contactInfo.map((info, index) => (
          <Card key={index} className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">{info.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {info.details.map((detail, detailIndex) => (
                <div key={detailIndex} className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <detail.icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-700">{detail.text}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contact Form */}
        <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Send className="h-5 w-5 text-blue-600" />
              Send us a Message
            </CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you soon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Enter your first name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Enter your last name" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="Enter your email address" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="What is this regarding?" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Please describe your inquiry in detail..."
              />
            </div>
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </CardContent>
        </Card>

        {/* Department Contacts */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Phone className="h-5 w-5 text-green-600" />
              Department Contacts
            </CardTitle>
            <CardDescription>Direct contact information for specific departments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {departments.map((dept, index) => (
              <div key={index} className="p-3 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">{dept.name}</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    <span>{dept.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    <span>{dept.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>{dept.hours}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Map and Location */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <MapPin className="h-5 w-5 text-red-600" />
            Campus Location
          </CardTitle>
          <CardDescription>Visit us at our main campus</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Address</h3>
                <p className="text-gray-600">
                  EduPlatform University
                  <br />
                  123 University Avenue
                  <br />
                  Education City, EC 12345
                  <br />
                  United States
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Campus Hours</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Monday - Friday: 7:00 AM - 10:00 PM</div>
                  <div>Saturday: 8:00 AM - 8:00 PM</div>
                  <div>Sunday: 10:00 AM - 6:00 PM</div>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Transportation</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>• Bus routes 15, 22, and 45</div>
                  <div>• Metro Blue Line (University Station)</div>
                  <div>• Free parking available for students</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-2" />
                <p>Interactive Campus Map</p>
                <p className="text-sm">Click to view detailed map</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
