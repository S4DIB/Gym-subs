"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Save, Building, Clock, Mail, Phone, MapPin, Users, DollarSign } from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    // Gym Information
    gymName: "FitLife Gym",
    address: "123 Fitness Street, Health City, HC 12345",
    phone: "+1 (555) 123-4567",
    email: "info@fitlife.com",
    website: "www.fitlife.com",
    
    // Operating Hours
    mondayFriday: "06:00 - 22:00",
    saturday: "07:00 - 20:00",
    sunday: "08:00 - 18:00",
    
    // Business Settings
    membershipFreeze: true,
    guestPasses: true,
    autoRenewal: true,
    cancelationPeriod: 30, // days
    
    // Pricing Settings
    lateFee: 25,
    processingFee: 15,
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    paymentReminders: true,
    classReminders: true,
    
    // Class Settings
    bookingWindow: 7, // days
    cancelationWindow: 2, // hours
    waitlistEnabled: true,
    
    // Staff Settings
    trainerCommission: 15, // percentage
    
    // Description
    gymDescription: "FitLife is a premier fitness facility dedicated to helping you achieve your health and wellness goals. With state-of-the-art equipment, expert trainers, and a supportive community, we're here to support your fitness journey."
  });

  const handleSave = () => {
    // In a real app, this would save to your backend/database
    toast.success("Settings saved successfully!");
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary">Gym Settings</h1>
          <p className="text-muted-foreground">Configure your gym's operational settings</p>
        </div>
        <Button onClick={handleSave} className="btn-premium">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gym Information */}
        <Card className="card-gradient premium-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Gym Information
            </CardTitle>
            <CardDescription>Basic information about your gym</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gymName">Gym Name</Label>
              <Input
                id="gymName"
                value={settings.gymName}
                onChange={(e) => handleInputChange('gymName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={settings.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="min-h-20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={settings.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={settings.gymDescription}
                onChange={(e) => handleInputChange('gymDescription', e.target.value)}
                className="min-h-24"
              />
            </div>
          </CardContent>
        </Card>

        {/* Operating Hours */}
        <Card className="card-gradient premium-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Operating Hours
            </CardTitle>
            <CardDescription>Set your gym's operating schedule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mondayFriday">Monday - Friday</Label>
              <Input
                id="mondayFriday"
                value={settings.mondayFriday}
                onChange={(e) => handleInputChange('mondayFriday', e.target.value)}
                placeholder="06:00 - 22:00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="saturday">Saturday</Label>
              <Input
                id="saturday"
                value={settings.saturday}
                onChange={(e) => handleInputChange('saturday', e.target.value)}
                placeholder="07:00 - 20:00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sunday">Sunday</Label>
              <Input
                id="sunday"
                value={settings.sunday}
                onChange={(e) => handleInputChange('sunday', e.target.value)}
                placeholder="08:00 - 18:00"
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card className="card-gradient premium-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Membership Settings
            </CardTitle>
            <CardDescription>Configure membership policies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Membership Freeze</Label>
                <p className="text-sm text-muted-foreground">Allow members to freeze their memberships</p>
              </div>
              <Switch
                checked={settings.membershipFreeze}
                onCheckedChange={(checked) => handleInputChange('membershipFreeze', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Guest Passes</Label>
                <p className="text-sm text-muted-foreground">Allow members to bring guests</p>
              </div>
              <Switch
                checked={settings.guestPasses}
                onCheckedChange={(checked) => handleInputChange('guestPasses', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Renewal</Label>
                <p className="text-sm text-muted-foreground">Automatically renew memberships</p>
              </div>
              <Switch
                checked={settings.autoRenewal}
                onCheckedChange={(checked) => handleInputChange('autoRenewal', checked)}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="cancelationPeriod">Cancelation Period (days)</Label>
              <Input
                id="cancelationPeriod"
                type="number"
                value={settings.cancelationPeriod}
                onChange={(e) => handleInputChange('cancelationPeriod', parseInt(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing Settings */}
        <Card className="card-gradient premium-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing & Fees
            </CardTitle>
            <CardDescription>Configure additional fees and charges</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lateFee">Late Payment Fee ($)</Label>
              <Input
                id="lateFee"
                type="number"
                value={settings.lateFee}
                onChange={(e) => handleInputChange('lateFee', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="processingFee">Processing Fee ($)</Label>
              <Input
                id="processingFee"
                type="number"
                value={settings.processingFee}
                onChange={(e) => handleInputChange('processingFee', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainerCommission">Trainer Commission (%)</Label>
              <Input
                id="trainerCommission"
                type="number"
                value={settings.trainerCommission}
                onChange={(e) => handleInputChange('trainerCommission', parseFloat(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="card-gradient premium-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure automated notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send email notifications to members</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Send text message notifications</p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => handleInputChange('smsNotifications', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Payment Reminders</Label>
                <p className="text-sm text-muted-foreground">Remind members of upcoming payments</p>
              </div>
              <Switch
                checked={settings.paymentReminders}
                onCheckedChange={(checked) => handleInputChange('paymentReminders', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Class Reminders</Label>
                <p className="text-sm text-muted-foreground">Remind members of booked classes</p>
              </div>
              <Switch
                checked={settings.classReminders}
                onCheckedChange={(checked) => handleInputChange('classReminders', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Class Settings */}
        <Card className="card-gradient premium-shadow">
          <CardHeader>
            <CardTitle>Class Management</CardTitle>
            <CardDescription>Configure class booking settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bookingWindow">Booking Window (days)</Label>
              <Input
                id="bookingWindow"
                type="number"
                value={settings.bookingWindow}
                onChange={(e) => handleInputChange('bookingWindow', parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">How far in advance members can book classes</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cancelationWindow">Cancelation Window (hours)</Label>
              <Input
                id="cancelationWindow"
                type="number"
                value={settings.cancelationWindow}
                onChange={(e) => handleInputChange('cancelationWindow', parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">Minimum time before class to allow cancelations</p>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Waitlist Enabled</Label>
                <p className="text-sm text-muted-foreground">Allow members to join waitlists for full classes</p>
              </div>
              <Switch
                checked={settings.waitlistEnabled}
                onCheckedChange={(checked) => handleInputChange('waitlistEnabled', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
