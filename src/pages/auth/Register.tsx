"use client";

import React, { useState } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
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
  const [faculties, setFaculties] = useState<any[]>([]);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  // Fetch faculties for department selection
  React.useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const { data, error } = await supabase
          .from("faculties")
          .select("id, name, code")
          .order("name");
        
        if (error) {
          console.error("Error fetching faculties:", error);
          return;
        }
        
        setFaculties(data || []);
      } catch (error) {
        console.error("Error fetching faculties:", error);
      }
    };

    fetchFaculties();
  }, []);

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

    const fullName = `${formData.firstName} ${formData.lastName}`;
    const role = userType as "admin" | "lecturer" | "student";

    // Prepare additional data for role-specific tables
    let additionalData = null;
    
    if (userType === "student") {
      additionalData = {
        studentData: {
          studentId: formData.studentId || `STU${Date.now()}`,
          facultyId: formData.department || faculties[0]?.id,
        }
      };
    } else if (userType === "lecturer") {
      additionalData = {
        lecturerData: {
          employeeId: formData.studentId || `EMP${Date.now()}`,
          facultyId: formData.department || faculties[0]?.id,
        }
      };
    }

    // Sign up using the improved AuthContext function
    const { error: signUpError } = await signUp(
      formData.email,
      formData.password,
      fullName,
      role,
      additionalData
    );

    if (signUpError) {
      setError(signUpError.message || "Registration failed. Please try again.");
      setIsLoading(false);
      return;
    }

    // Success - redirect to login
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
                    type="text"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    required
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
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

              <div className="space-y-2">
                <Label htmlFor="studentId">
                  {userType === "student" ? "Student ID" : "Employee ID"}
                </Label>
                <Input
                  id="studentId"
                  type="text"
                  placeholder={
                    userType === "student"
                      ? "Enter your student ID"
                      : "Enter your employee ID"
                  }
                  value={formData.studentId}
                  onChange={(e) => handleInputChange("studentId", e.target.value)}
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department/Faculty</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleInputChange("department", value)}
                >
                  <SelectTrigger className="border-blue-200 focus:border-blue-400">
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculties.map((faculty) => (
                      <SelectItem key={faculty.id} value={faculty.id}>
                        {faculty.name} ({faculty.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                    className="border-blue-200 focus:border-blue-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
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
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) =>
                    handleInputChange("agreeToTerms", checked as boolean)
                  }
                />
                <Label
                  htmlFor="agreeToTerms"
                  className="text-sm text-gray-600"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Terms and Conditions
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/auth/login"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
