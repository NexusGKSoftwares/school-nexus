"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Settings, Save, X, ShieldCheck, Bell, Sun, Moon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { SettingsModal } from "@/components/modals/SettingsModal"
import { useToast } from "@/hooks/use-toast"

export default function AdminSettings() {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [settings, setSettings] = useState({
    siteName: "EduPlatform",
    defaultTheme: "light",
    enableNotifications: true,
    enableTwoFactorAuth: false,
  })
  const { toast } = useToast()

  const handleEditSettings = () => {
    setIsSettingsModalOpen(true)
  }

  const handleSaveSettings = async (data: any) => {
    try {
      setIsSubmitting(true)
      // Save logic here (API call)
      setSettings(data)
      setIsSettingsModalOpen(false)
      toast({ title: "Success", description: "Settings updated successfully" })
    } catch (err) {
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
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
          <Button onClick={handleEditSettings} className="bg-blue-500 hover:bg-blue-600">
            <Settings className="h-4 w-4 mr-2" />
            Edit Settings
          </Button>
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
            <p className="text-gray-900">{settings.siteName}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultTheme">Default Theme</Label>
            <p className="text-gray-900">{settings.defaultTheme}</p>
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
            <div className="flex items-center gap-2">
              {settings.enableTwoFactorAuth ? (
                <Badge className="bg-green-500">Enabled</Badge>
              ) : (
                <Badge variant="outline">Disabled</Badge>
              )}
            </div>
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
            <div className="flex items-center gap-2">
              {settings.enableNotifications ? (
                <Badge className="bg-green-500">Enabled</Badge>
              ) : (
                <Badge variant="outline">Disabled</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={handleSaveSettings}
        settings={settings}
        isLoading={isSubmitting}
      />
    </div>
  )
}
