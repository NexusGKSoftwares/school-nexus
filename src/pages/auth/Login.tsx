"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, GraduationCap, User, Shield, Users } from "lucide-react";

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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signIn, profile } = useAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (profile) {
      const redirectMap = {
        student: "/student",
        lecturer: "/lecturer",
        admin: "/admin",
      };
      navigate(redirectMap[profile.role] || "/");
    }
  }, [profile, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { error } = await signIn(email, password);

    if (error) {
      setError(
        error.message || "Failed to sign in. Please check your credentials.",
      )
      setIsLoading(false);
    }

    
  };

  const userTypeConfig = {
    student: {
      icon: GraduationCap,
      title: "Student Portal",
      description: "Access your courses, grades, and academic information",
      color: "from-blue-500 to-indigo-600",
    },
    lecturer: {
      icon: User,
      title: "Lecturer Portal",
      description: "Manage courses, students, and academic content",
      color: "from-green-500 to-emerald-600",
    },
    admin: {
      icon: Shield,
      title: "Admin Portal",
      description: "System administration and management",
      color: "from-purple-500 to-violet-600",
    },
  };

  const currentConfig = userTypeConfig[userType as keyof typeof userTypeConfig];
  const IconComponent = currentConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex aspect-square size-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
              <GraduationCap className="size-6" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              AMEU Smart School
            </h1>
          </div>
          <p className="text-gray-600">
            Welcome back! Please sign in to your account.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Info Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Portal Information
              </CardTitle>
              <CardDescription>
                Choose your role to access the appropriate portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(userTypeConfig).map(([type, config]) => {
                const Icon = config.icon;
                return (
                  <div
                    key={type}
                    onClick={() => setUserType(type)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md bg-white/50 ${
                      userType === type
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-r ${config.color} text-white`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold capitalize">{type}</h3>
                        <p className="text-sm text-gray-600">
                          {config.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Login Form */}
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
              <Tabs
                value={userType}
                onValueChange={setUserType}
                className="mb-6"
              >
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

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                <div className="flex items-center justify-between">
                  <Link
                    to="/auth/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className={`w-full bg-gradient-to-r ${currentConfig.color} hover:opacity-90 text-white shadow-lg`}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/auth/register"
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

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
