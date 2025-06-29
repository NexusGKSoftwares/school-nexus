import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestAuth() {
  const { user, profile, loading, signIn, signOut } = useAuth();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");

  const handleSignIn = async () => {
    const result = await signIn(email, password);
    console.log("Sign in result:", result);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label>Email:</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Password:</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSignIn} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
          
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-bold">Current State:</h3>
            <p>Loading: {loading ? "Yes" : "No"}</p>
            <p>User: {user ? user.email : "None"}</p>
            <p>Profile: {profile ? JSON.stringify(profile, null, 2) : "None"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 