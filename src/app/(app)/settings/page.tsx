import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline">Settings</h1>
        <p className="text-muted-foreground">Manage your clinic's settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="data">Data Fields</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Clinic Profile</CardTitle>
              <CardDescription>Update your clinic's public information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clinic-name">Clinic Name</Label>
                <Input id="clinic-name" defaultValue="ClinicFlow Demo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinic-contact">Contact Email</Label>
                <Input id="clinic-contact" type="email" defaultValue="contact@clinicflow.demo" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">Select a theme for the application. Dark mode is handled automatically by your system preference.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                 <Select defaultValue="en">
                  <SelectTrigger id="language" className="w-[280px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Appointment Reminders</p>
                        <p className="text-sm text-muted-foreground">Send email reminders to patients 24 hours before their appointment.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Daily Digest</p>
                        <p className="text-sm text-muted-foreground">Receive a daily email summary of appointments and tasks.</p>
                    </div>
                    <Switch />
                </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="data">
           <Card>
            <CardHeader>
              <CardTitle>Data Fields</CardTitle>
              <CardDescription>Customize data fields for appointments and patient records.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-20">
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h3 className="text-2xl font-bold tracking-tight">Coming Soon</h3>
                        <p className="text-sm text-muted-foreground">Custom fields will be available in a future update.</p>
                    </div>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
