"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, Calendar, DollarSign, TrendingUp, Activity, AlertCircle, Plus, Home, Database } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [initializing, setInitializing] = useState(false);

  // In a real app, this data would come from your database
  const stats = {
    totalMembers: 342,
    activeSubscriptions: 298,
    totalTrainers: 12,
    scheduledClasses: 48,
    monthlyRevenue: 18420,
    newMembersThisMonth: 23,
  };

  const recentActivity = [
    { type: "member", message: "New member John Smith joined Premium plan", time: "2 hours ago", status: "success" },
    { type: "payment", message: "Payment failed for member Sarah Johnson", time: "4 hours ago", status: "error" },
    { type: "class", message: "Yoga class with Emma Wilson is fully booked", time: "6 hours ago", status: "info" },
    { type: "trainer", message: "Trainer Mike Davis updated his schedule", time: "1 day ago", status: "info" },
  ];

  const upcomingTasks = [
    { task: "Review trainer applications", priority: "high", due: "Today" },
    { task: "Update class schedules for next week", priority: "medium", due: "Tomorrow" },
    { task: "Process membership renewals", priority: "high", due: "2 days" },
    { task: "Equipment maintenance check", priority: "low", due: "1 week" },
  ];

  const initializeDatabase = async () => {
    try {
      setInitializing(true);
      const token = await getAuthToken();
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch('/api/init-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Database initialized successfully! Added ${result.results.trainers} trainers, ${result.results.equipment} equipment, ${result.results.members} members`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to initialize database');
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      toast.error('Failed to initialize database');
    } finally {
      setInitializing(false);
    }
  };

  const getAuthToken = async () => {
    if (!user) return null;
    return await user.getIdToken();
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your gym operations and key metrics
          </p>
        </div>
        <Button variant="outline" className="glass-effect" asChild>
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="card-gradient premium-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-3xl font-bold text-gradient-secondary">{stats.totalMembers}</p>
                <p className="text-sm text-green-500">+{stats.newMembersThisMonth} this month</p>
              </div>
              <Users className="h-12 w-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient premium-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                <p className="text-3xl font-bold text-gradient-secondary">{stats.activeSubscriptions}</p>
                <p className="text-sm text-muted-foreground">{Math.round((stats.activeSubscriptions / stats.totalMembers) * 100)}% of members</p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient premium-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-3xl font-bold text-gradient-secondary">${stats.monthlyRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-500">+12% from last month</p>
              </div>
              <DollarSign className="h-12 w-12 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient premium-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Trainers</p>
                <p className="text-3xl font-bold text-gradient-secondary">{stats.totalTrainers}</p>
                <p className="text-sm text-muted-foreground">All active</p>
              </div>
              <UserCheck className="h-12 w-12 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient premium-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled Classes</p>
                <p className="text-3xl font-bold text-gradient-secondary">{stats.scheduledClasses}</p>
                <p className="text-sm text-muted-foreground">This week</p>
              </div>
              <Calendar className="h-12 w-12 text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient premium-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Capacity Usage</p>
                <p className="text-3xl font-bold text-gradient-secondary">78%</p>
                <p className="text-sm text-muted-foreground">Average this week</p>
              </div>
              <Activity className="h-12 w-12 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-gradient premium-shadow">
        <CardHeader>
          <CardTitle className="text-gradient-primary">Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="btn-premium h-20 flex-col" asChild>
              <Link href="/admin/trainers">
                <Plus className="h-6 w-6 mb-2" />
                Add Trainer
              </Link>
            </Button>
            <Button className="glass-effect h-20 flex-col" asChild>
              <Link href="/admin/classes">
                <Calendar className="h-6 w-6 mb-2" />
                Schedule Class
              </Link>
            </Button>
            <Button className="glass-effect h-20 flex-col" asChild>
              <Link href="/admin/members">
                <Users className="h-6 w-6 mb-2" />
                View Members
              </Link>
            </Button>
            <Button className="glass-effect h-20 flex-col" asChild>
              <Link href="/admin/equipment">
                <Activity className="h-6 w-6 mb-2" />
                Equipment
              </Link>
            </Button>
            <Button 
              className="glass-effect h-20 flex-col" 
              onClick={initializeDatabase}
              disabled={initializing}
            >
              <Database className="h-6 w-6 mb-2" />
              {initializing ? 'Initializing...' : 'Initialize DB'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="card-gradient premium-shadow">
          <CardHeader>
            <CardTitle className="text-gradient-primary">Recent Activity</CardTitle>
            <CardDescription>Latest events and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg glass-effect">
                  <div className={`h-2 w-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' : 
                    activity.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="card-gradient premium-shadow">
          <CardHeader>
            <CardTitle className="text-gradient-primary">Upcoming Tasks</CardTitle>
            <CardDescription>Items that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg glass-effect">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className={`h-4 w-4 ${
                      task.priority === 'high' ? 'text-red-500' :
                      task.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium">{task.task}</p>
                      <p className="text-xs text-muted-foreground">Due: {task.due}</p>
                    </div>
                  </div>
                  <Badge variant={
                    task.priority === 'high' ? 'destructive' :
                    task.priority === 'medium' ? 'default' : 'secondary'
                  }>
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
