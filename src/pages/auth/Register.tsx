"use client";

import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, GraduationCap, User, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    studentId: "",
    department: "",
    agreeToTerms: false,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate fields
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    if (!formData.agreeToTerms) {
      setError("Please agree to the terms and conditions");
      setIsLoading(false);
      return;
    }

    // Sign up with metadata
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`,
            role: userType,
          },
        },
      },
    );

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
      return;
    }

    // Wait for the trigger to create the profile
    let profileId = signUpData.user?.id;
    if (!profileId) {
      setError("Registration failed. Please try again.");
      setIsLoading(false);
      return;
    }

    // Insert into students or lecturers if needed
    if (userType === "student") {
      const { error: studentError } = await supabase.from("students").insert([
        {
          profile_id: profileId,
          student_number: formData.studentId,
          faculty_id: formData.department || null,
          enrollment_date: new Date().toISOString().slice(0, 10),
          status: "active",
        },
      ]);
      if (studentError) {
        setError(studentError.message);
        setIsLoading(false);
        return;
      }
    } else if (userType === "lecturer") {
      const { error: lecturerError } = await supabase.from("lecturers").insert([
        {
          profile_id: profileId,
          employee_number: formData.studentId || "-",
          faculty_id: formData.department || null,
          hire_date: new Date().toISOString().slice(0, 10),
          status: "active",
        },
      ]);
      if (lecturerError) {
        setError(lecturerError.message);
        setIsLoading(false);
        return;
      }
    }

    // Success
    navigate("/auth/login");
    setIsLoading(false);
  };

  const userTypeConfig = {
    student: {
      icon: GraduationCap,
      title: "Student Registration",
      description: "Join as a student to access courses and academic resources",
      color: "from-blue-500 to-indigo-600",
    },
    lecturer: {
      icon: User,
      title: "Lecturer Registration",
      description: "Register as a lecturer to manage courses and students",
      color: "from-green-500 to-emerald-600",
    },
    admin: {
      icon: Shield,
      title: "Admin Registration",
      description: "Administrative access requires approval",
      color: "from-purple-500 to-violet-600",
    },
  };

  const currentConfig = userTypeConfig[userType as keyof typeof userTypeConfig];
  const IconComponent = currentConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex aspect-square size-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
              <GraduationCap className="size-6" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              AMEU Smart School
            </h1>
          </div>
          <p className="text-gray-600">Create your account to get started.</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`p-2 rounded-lg bg-gradient-to-r ${currentConfig.color} text-white`}
              >
                <IconComponent className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>{currentConfig.title}</CardTitle>
                <CardDescription>{currentConfig.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={userType} onValueChange={setUserType} className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="lecturer">Lecturer</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
            </Tabs>

            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    required
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    required
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>

              {userType === "student" && (
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    placeholder="Enter your student ID"
                    value={formData.studentId}
                    onChange={(e) =>
                      handleInputChange("studentId", e.target.value)
                    }
                    required
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
              )}

              {(userType === "lecturer" || userType === "admin") && (
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("department", value)
                    }
                  >
                    <SelectTrigger className="border-blue-200 focus:border-blue-400">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="computer-science">
                        Computer Science
                      </SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="arts">Arts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    required
                    className="border-blue-200 focus:border-blue-400 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    required
                    className="border-blue-200 focus:border-blue-400 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) =>
                    handleInputChange("agreeToTerms", checked as boolean)
                  }
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <Link to="/terms" className="text-blue-600 hover:underline">
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className={`w-full bg-gradient-to-r ${currentConfig.color} hover:opacity-90 text-white shadow-lg`}
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/auth/login"
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
