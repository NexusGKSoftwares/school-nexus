"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Users,
  BookOpen,
  CreditCard,
  MessageSquare,
  Shield,
  Clock,
  Globe,
  Smartphone,
  CheckCircle,
  Star,
  Menu,
  X,
  Play,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("students");

  const features = [
    {
      icon: BookOpen,
      title: "Academic Automation",
      description:
        "Streamline course registration, grading, and academic workflows with intelligent automation.",
    },
    {
      icon: CreditCard,
      title: "Seamless Payments",
      description:
        "Integrated payment processing for tuition, fees, and other school-related transactions.",
    },
    {
      icon: MessageSquare,
      title: "Real-Time Communication",
      description:
        "Connect students, lecturers, and administrators through instant messaging and notifications.",
    },
  ];

  const roleFeatures = {
    students: {
      icon: GraduationCap,
      title: "Students",
      color: "from-blue-500 to-indigo-600",
      features: [
        "Course registration and enrollment",
        "Real-time grade tracking",
        "Assignment submissions",
        "Payment processing",
        "Academic calendar access",
        "Communication with lecturers",
      ],
    },
    lecturers: {
      icon: Users,
      title: "Lecturers",
      color: "from-green-500 to-emerald-600",
      features: [
        "Course material uploads",
        "Student grade management",
        "Attendance tracking",
        "Assignment creation",
        "Performance analytics",
        "Direct student communication",
      ],
    },
    admins: {
      icon: Shield,
      title: "Administrators",
      color: "from-purple-500 to-violet-600",
      features: [
        "Complete system oversight",
        "User management",
        "Financial reporting",
        "Academic calendar management",
        "System configuration",
        "Support ticket handling",
      ],
    },
    staff: {
      icon: BookOpen,
      title: "Staff & Support",
      color: "from-orange-500 to-red-600",
      features: [
        "Library management",
        "Exam coordination",
        "Finance processing",
        "Student support services",
        "Resource allocation",
        "Administrative tasks",
      ],
    },
  };

  const benefits = [
    {
      icon: Clock,
      title: "24/7 Access",
      description: "Access your academic information anytime, anywhere",
    },
    {
      icon: Shield,
      title: "Secure & Role-Based",
      description: "Advanced security with role-based access control",
    },
    {
      icon: Globe,
      title: "Built for African Universities",
      description: "Designed specifically for African educational institutions",
    },
    {
      icon: CreditCard,
      title: "Integrated Finance & Academics",
      description: "Seamless integration of financial and academic operations",
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description: "Fully responsive design works on all devices",
    },
    {
      icon: Users,
      title: "Multi-Role Support",
      description: "Supports students, lecturers, admins, and staff",
    },
  ];

  const faqItems = [
    {
      question: "Can I use it on mobile devices?",
      answer:
        "Yes! NexusGK Smart School is fully responsive and works seamlessly on smartphones, tablets, and desktop computers. You can access all features from any device with an internet connection.",
    },
    {
      question: "Can it be integrated with other tools?",
      answer:
        "Our system offers robust API integration capabilities, allowing you to connect with existing tools like learning management systems, accounting software, and communication platforms.",
    },
    {
      question: "How secure is the platform?",
      answer:
        "Security is our top priority. We use enterprise-grade encryption, role-based access control, regular security audits, and comply with international data protection standards to keep your information safe.",
    },
    {
      question: "What kind of support do you provide?",
      answer:
        "We offer comprehensive support including 24/7 technical assistance, training sessions, documentation, video tutorials, and dedicated account management for enterprise clients.",
    },
    {
      question: "How long does implementation take?",
      answer:
        "Implementation typically takes 2-4 weeks depending on your institution's size and requirements. We provide full migration support and training to ensure a smooth transition.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes! We offer a 30-day free trial with full access to all features. No credit card required, and you can cancel anytime during the trial period.",
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$299",
      period: "/month",
      description: "Perfect for small institutions",
      students: "Up to 500 students",
      popular: false,
      features: [
        "Student & Lecturer Portals",
        "Basic Course Management",
        "Grade Tracking",
        "Payment Processing",
        "Email Support",
        "Mobile Access",
      ],
    },
    {
      name: "Professional",
      price: "$599",
      period: "/month",
      description: "Most popular for growing schools",
      students: "Up to 2,000 students",
      popular: true,
      features: [
        "Everything in Starter",
        "Advanced Admin Features",
        "Custom Role Management",
        "API Access",
        "Priority Support",
        "Advanced Analytics",
        "Custom Branding",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large institutions",
      students: "Unlimited students",
      popular: false,
      features: [
        "Everything in Professional",
        "White-label Solution",
        "On-premise Deployment",
        "Dedicated Support",
        "Custom Integrations",
        "Advanced Security",
        "Training & Onboarding",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-blue-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                <GraduationCap className="size-5" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                NexusGK Smart School
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#faq"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                FAQ
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Contact
              </a>
              <div className="relative group">
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">Login</Button>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-blue-100 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
                  <Link to="/student/register">Student Sign Up</Link>
                  <Link to="/lecturer/register">Lecturer Sign Up</Link>
                  <Link to="/admin/register">Admin Sign Up</Link>
                  <Link to="/student/login">Student Login</Link>
                  <Link to="/lecturer/login">Lecturer Login</Link>
                  <Link to="/admin/login">Admin Login</Link>
                  <div className="border-t border-blue-100 my-1"></div>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-blue-100">
                <a
                  href="#features"
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600"
                >
                  Pricing
                </a>
                <a
                  href="#faq"
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600"
                >
                  FAQ
                </a>
                <a
                  href="#contact"
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600"
                >
                  Contact
                </a>
                <div className="mt-2 space-y-1">
                  <Link to="/student/register">Student Sign Up</Link>
                  <Link to="/lecturer/register">Lecturer Sign Up</Link>
                  <Link to="/admin/register">Admin Sign Up</Link>
                  <Link to="/student/login">Student Login</Link>
                  <Link to="/lecturer/login">Lecturer Login</Link>
                  <Link to="/admin/login">Admin Login</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  🎓 Trusted by 50+ Universities
                </Badge>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">
                    4.9/5 (2,500+ reviews)
                  </span>
                </div>
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
               NexusGK Smart School System for{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Modern Universities
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Streamline academic, financial, and administrative operations —
                all in one powerful platform designed specifically for African
                educational institutions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link to="/student/register">
                    <Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 text-white shadow-lg">
                      <Play className="h-5 w-5 mr-2" />Student Sign Up
                    </Button>
                  </Link>
                  <Link to="/lecturer/register">
                    <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white shadow-lg">
                      <Play className="h-5 w-5 mr-2" />Lecturer Sign Up
                    </Button>
                  </Link>
                  <Link to="/admin/register">
                    <Button size="lg" className="bg-gradient-to-r from-purple-500 to-violet-600 hover:opacity-90 text-white shadow-lg">
                      <Play className="h-5 w-5 mr-2" />Admin Sign Up
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link to="/student/login">
                    <Button size="lg" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                      Student Login <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/lecturer/login">
                    <Button size="lg" variant="outline" className="border-green-200 text-green-600 hover:bg-green-50">
                      Lecturer Login <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/admin/login">
                    <Button size="lg" variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                      Admin Login <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>30-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>No setup fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img
                  src="/image.png?height=600&width=800"
                  alt="Dashboard Preview"
                  className="rounded-2xl shadow-2xl border border-blue-200"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* System Overview */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything Your Institution Needs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform brings together all aspects of school
              management into one seamless experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-blue-100 hover:border-blue-300 transition-colors hover:shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features by Role */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Designed for Every Role
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored experiences for students, lecturers, administrators, and
              support staff.
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 mb-8">
              {Object.entries(roleFeatures).map(([key, role]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="flex items-center gap-2"
                >
                  <role.icon className="h-4 w-4" />
                  {role.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(roleFeatures).map(([key, role]) => (
              <TabsContent key={key} value={key}>
                <Card className="border-blue-100">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`p-4 rounded-xl bg-gradient-to-br ${role.color} text-white`}
                      >
                        <role.icon className="h-8 w-8" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{role.title}</CardTitle>
                        <CardDescription className="text-lg">
                          Key features and capabilities for{" "}
                          {role.title.toLowerCase()}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {role.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Screenshots Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              See the System in Action
            </h2>
            <p className="text-xl text-gray-600">
              Explore our intuitive dashboards and user interfaces
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Student Dashboard",
                description: "Clean, intuitive interface for students",
                image: "/student.png",
              },
              {
                title: "Lecturer Portal",
                description: "Powerful tools for educators",
                image: "/lecturer.png",
              },
              {
                title: "Admin Panel",
                description: "Comprehensive system management",
                image: "/admin.png",
              },
              {
                title: "Mobile Experience",
                description: "Fully responsive on all devices",
                image: "/mobile.png",
              },
              {
                title: "Payment Processing",
                description: "Secure financial transactions",
                image: "/payment.png",
              },
              {
                title: "Analytics & Reports",
                description: "Data-driven insights",
                image: "/analytics.png",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="border-blue-100 hover:border-blue-300 transition-colors group cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 rounded-t-lg flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-200 transition-colors">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="rounded opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose NexusGK Smart School?
            </h2>
            <p className="text-xl text-gray-600">
              Built specifically for African universities with modern technology
              and local understanding
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex-shrink-0">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your institution's needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${plan.popular ? "border-blue-500 shadow-lg scale-105" : "border-gray-200"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-2 text-sm font-medium text-blue-600">
                    {plan.students}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 text-white"
                        : "border-blue-200 text-blue-600 hover:bg-blue-50"
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.name === "Enterprise"
                      ? "Contact Sales"
                      : "Start Free Trial"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">All plans include:</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>30-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Get answers to common questions about our platform
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-blue-100"
              >
                <AccordionTrigger className="text-left hover:text-blue-600">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Digitize Your School?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of institutions already using NexusGK Smart School to
            streamline their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Play className="h-5 w-5 mr-2" />Book a Demo
            </Button>
            <Link to="/student/login">
              <Button size="lg" variant="outline" className="border-white bg-blue hover:bg-white hover:text-blue-600">
                Student Login <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link to="/lecturer/login">
              <Button size="lg" variant="outline" className="border-white bg-green-50 hover:bg-white hover:text-green-600">
                Lecturer Login <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link to="/admin/login">
              <Button size="lg" variant="outline" className="border-white bg-purple-50 hover:bg-white hover:text-purple-600">
                Admin Login <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                  <GraduationCap className="size-5" />
                </div>
                <span className="text-xl font-bold">NexusGK Smart School</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering African universities with modern technology solutions
                for academic excellence and operational efficiency.
              </p>
              <div className="flex space-x-4">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <Linkedin className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link to="/student/login" className="hover:text-white transition-colors">Student Login</Link></li>
                <li><Link to="/lecturer/login" className="hover:text-white transition-colors">Lecturer Login</Link></li>
                <li><Link to="/admin/login" className="hover:text-white transition-colors">Admin Login</Link></li>
                <li><Link to="/student/register" className="hover:text-white transition-colors">Student Sign Up</Link></li>
                <li><Link to="/lecturer/register" className="hover:text-white transition-colors">Lecturer Sign Up</Link></li>
                <li><Link to="/admin/register" className="hover:text-white transition-colors">Admin Sign Up</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5" />
                  <span>info@nexusgksmartschool.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5" />
                  <span>+254 791 431 287 </span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-0.5" />
                  <span>
                    Lagos, Nigeria
                    <br />
                    Accra, Ghana
                    <br />
                    Nairobi, Kenya
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy;  {new Date().getFullYear()} NexusGK Smart School. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
