"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Settings, Save, X, ShieldCheck, Bell, Sun, Moon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function AdminSettings() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    siteName: "EduPlatform",
    defaultTheme: "light",
    enableNotifications: true,
    enableTwoFactorAuth: false,
  })

  const handleSave = () => {
    // Save logic here
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      siteName: "EduPlatform",
      defaultTheme: "light",
      enableNotifications: true,
      enableTwoFactorAuth: false,
    })
    setIsEditing(false)
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure system-wide settings and preferences</p>
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
              <Settings className="h-4 w-4 mr-2" />
              Edit Settings
            </Button>
          )}
        </div>
      </div>

      {/* General Settings */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Settings className="h-5 w-5 text-blue-600" />
            General Settings
          </CardTitle>
          <CardDescription>Configure basic system settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            {isEditing ? (
              <Input
                id="siteName"
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              />
            ) : (
              <p className="text-gray-900">{formData.siteName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultTheme">Default Theme</Label>
            {isEditing ? (
              <div className="flex items-center gap-4">
                <Button
                  variant={formData.defaultTheme === "light" ? "default" : "outline"}
                  onClick={() => setFormData({ ...formData, defaultTheme: "light" })}
                >
                  <Sun className="h-4 w-4 mr-2" />
                  Light
                </Button>
                <Button
                  variant={formData.defaultTheme === "dark" ? "default" : "outline"}
                  onClick={() => setFormData({ ...formData, defaultTheme: "dark" })}
                >
                  <Moon className="h-4 w-4 mr-2" />
                  Dark
                </Button>
              </div>
            ) : (
              <p className="text-gray-900">{formData.defaultTheme}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            Security Settings
          </CardTitle>
          <CardDescription>Configure security settings for the system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="enableTwoFactorAuth">Enable Two-Factor Authentication</Label>
              <p className="text-sm text-gray-500">Require users to use two-factor authentication for added security</p>
            </div>
            {isEditing && (
              <Switch
                id="enableTwoFactorAuth"
                checked={formData.enableTwoFactorAuth}
                onCheckedChange={(checked) => setFormData({ ...formData, enableTwoFactorAuth: checked })}
              />
            )}
            {!isEditing && (
              <div className="flex items-center gap-2">
                {formData.enableTwoFactorAuth ? (
                  <Badge className="bg-green-500">Enabled</Badge>
                ) : (
                  <Badge variant="outline">Disabled</Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Bell className="h-5 w-5 text-blue-600" />
            Notification Settings
          </CardTitle>
          <CardDescription>Configure system notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="enableNotifications">Enable System Notifications</Label>
              <p className="text-sm text-gray-500">Receive important system notifications via email</p>
            </div>
            {isEditing && (
              <Switch
                id="enableNotifications"
                checked={formData.enableNotifications}
                onCheckedChange={(checked) => setFormData({ ...formData, enableNotifications: checked })}
              />
            )}
            {!isEditing && (
              <div className="flex items-center gap-2">
                {formData.enableNotifications ? (
                  <Badge className="bg-green-500">Enabled</Badge>
                ) : (
                  <Badge variant="outline">Disabled</Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
