import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DebugAuth() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentProfile, setCurrentProfile] = useState<any>(null);

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
    
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setCurrentProfile(profile);
    }
  };

  const testSignUp = async () => {
    setLoading(true);
    try {
      console.log("Testing signup...");
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: "Test User",
            role: "student",
          },
        },
      });
      
      console.log("Signup result:", { data, error });
      setResult({ data, error });
      
      if (data.user) {
        // Wait for profile creation
        setTimeout(async () => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();
          console.log("Profile after signup:", profile);
          setResult(prev => ({ ...prev, profile }));
        }, 2000);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setResult({ error: err });
    } finally {
      setLoading(false);
    }
  };

  const testSignIn = async () => {
    setLoading(true);
    try {
      console.log("Testing signin...");
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log("Signin result:", { data, error });
      setResult({ data, error });
      
      if (data.user) {
        // Check profile immediately after signin
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();
        
        console.log("Profile after signin:", { profile, profileError });
        setResult(prev => ({ ...prev, profile, profileError }));
        
        // Update current user and profile
        setCurrentUser(data.user);
        setCurrentProfile(profile);
      }
    } catch (err) {
      console.error("Signin error:", err);
      setResult({ error: err });
    } finally {
      setLoading(false);
    }
  };

  const testProfileFetch = async () => {
    setLoading(true);
    try {
      console.log("Testing profile fetch...");
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setResult({ error: "No user logged in" });
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      console.log("Profile fetch result:", { data, error });
      setResult({ data, error });
    } catch (err) {
      console.error("Profile fetch error:", err);
      setResult({ error: err });
    } finally {
      setLoading(false);
    }
  };

  const createTestUsers = async () => {
    setLoading(true);
    try {
      console.log("Creating test users...");
      
      const testUsers = [
        { email: "admin@school.com", password: "admin123", role: "admin" },
        { email: "student@school.com", password: "student123", role: "student" },
        { email: "lecturer@school.com", password: "lecturer123", role: "lecturer" },
      ];

      const results = [];
      
      for (const user of testUsers) {
        const { data, error } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            data: {
              full_name: `${user.role} User`,
              role: user.role,
            },
          },
        });
        
        results.push({ email: user.email, data, error });
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setResult({ results });
    } catch (err) {
      console.error("Create test users error:", err);
      setResult({ error: err });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setCurrentProfile(null);
    setResult({ message: "Signed out successfully" });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Debug Panel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button onClick={testSignUp} disabled={loading}>
                Test Sign Up
              </Button>
              <Button onClick={testSignIn} disabled={loading}>
                Test Sign In
              </Button>
              <Button onClick={testProfileFetch} disabled={loading}>
                Test Profile Fetch
              </Button>
              <Button onClick={createTestUsers} disabled={loading} variant="outline">
                Create Test Users
              </Button>
              <Button onClick={signOut} variant="destructive">
                Sign Out
              </Button>
            </div>

            <Alert>
              <AlertDescription>
                <strong>Test Credentials:</strong><br/>
                Admin: admin@school.com / admin123<br/>
                Student: student@school.com / student123<br/>
                Lecturer: lecturer@school.com / lecturer123
              </AlertDescription>
            </Alert>

            {currentUser && (
              <Alert>
                <AlertDescription>
                  <strong>Current User:</strong><br/>
                  ID: {currentUser.id}<br/>
                  Email: {currentUser.email}<br/>
                  Created: {new Date(currentUser.created_at).toLocaleString()}
                </AlertDescription>
              </Alert>
            )}

            {currentProfile && (
              <Alert>
                <AlertDescription>
                  <strong>Current Profile:</strong><br/>
                  ID: {currentProfile.id}<br/>
                  Full Name: {currentProfile.full_name}<br/>
                  Role: {currentProfile.role}<br/>
                  Created: {new Date(currentProfile.created_at).toLocaleString()}
                </AlertDescription>
              </Alert>
            )}

            {result && (
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <h3 className="font-semibold mb-2">Result:</h3>
                <pre className="text-sm overflow-auto max-h-96">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 