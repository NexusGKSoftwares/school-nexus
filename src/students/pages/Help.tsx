import {
  HelpCircle,
  MessageSquare,
  FileText,
  Phone,
  Mail,
  Search,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const faqData = [
  {
    question: "How do I submit an assignment?",
    answer:
      "Go to your course page, find the assignment section, and click 'Submit Assignment'. You can upload files or enter text directly.",
  },
  {
    question: "How can I check my grades?",
    answer:
      "Your grades are available in the 'Learning Plan' section or by clicking on individual courses in your dashboard.",
  },
  {
    question: "What if I miss a class?",
    answer:
      "Contact your instructor immediately and check if recorded lectures are available in the course materials section.",
  },
  {
    question: "How do I change my password?",
    answer:
      "Go to Settings > Account Security and click 'Change Password'. You'll need to enter your current password.",
  },
  {
    question: "Can I drop a course?",
    answer:
      "Course drops must be done before the deadline. Contact the registrar's office or your academic advisor for assistance.",
  },
];

const supportCategories = [
  {
    title: "Technical Support",
    description: "Issues with platform, login, or technical difficulties",
    icon: HelpCircle,
    color: "blue",
  },
  {
    title: "Academic Support",
    description: "Questions about courses, assignments, or grades",
    icon: FileText,
    color: "green",
  },
  {
    title: "General Inquiry",
    description: "General questions about university policies",
    icon: MessageSquare,
    color: "purple",
  },
];

const contactMethods = [
  {
    method: "Live Chat",
    description: "Get instant help from our support team",
    availability: "24/7",
    icon: MessageSquare,
    action: "Start Chat",
  },
  {
    method: "Email Support",
    description: "Send us a detailed message",
    availability: "Response within 24 hours",
    icon: Mail,
    action: "Send Email",
  },
  {
    method: "Phone Support",
    description: "Speak directly with a support agent",
    availability: "Mon-Fri 9AM-5PM",
    icon: Phone,
    action: "Call Now",
  },
];

export default function Help() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600">
            Get assistance with your academic journey
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
          <MessageSquare className="h-4 w-4 mr-2" />
          Contact Support
        </Button>
      </div>

      {/* Search Help */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search for help articles, FAQs, or guides..."
              className="pl-12 h-12 text-lg border-blue-200 focus:border-blue-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Support Categories */}
      <div className="grid gap-4 md:grid-cols-3">
        {supportCategories.map((category, index) => (
          <Card
            key={index}
            className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br from-${category.color}-400 to-${category.color}-600 text-white`}
                >
                  <category.icon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-800">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {category.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* FAQ Section */}
        <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>Quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-200 hover:bg-blue-50 transition-colors"
              >
                <h3 className="font-medium text-gray-800 mb-2">
                  {faq.question}
                </h3>
                <p className="text-sm text-gray-600">{faq.answer}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 p-0 h-auto text-blue-600"
                >
                  Learn more <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contact Methods */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Phone className="h-5 w-5 text-green-600" />
              Contact Us
            </CardTitle>
            <CardDescription>
              Choose your preferred contact method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-200"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <method.icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="font-medium text-gray-800">
                      {method.method}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {method.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {method.availability}
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      {method.action}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <FileText className="h-5 w-5 text-purple-600" />
            Quick Links & Resources
          </CardTitle>
          <CardDescription>Helpful resources and documentation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              "Student Handbook",
              "Academic Calendar",
              "Course Catalog",
              "Library Resources",
              "IT Services",
              "Career Services",
              "Health Services",
              "Financial Aid",
            ].map((resource, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 justify-start text-left hover:bg-blue-50"
              >
                <div className="space-y-1">
                  <div className="font-medium">{resource}</div>
                  <div className="text-xs text-gray-500">View details</div>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
