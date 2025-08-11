"use client";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, Clock, Trophy, Settings, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen premium-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen premium-gradient">
      {/* Header with user info */}
      <div className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gradient-primary mb-2">
                  Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'Member'}!
                </h1>
                <p className="text-muted-foreground">
                  Ready to crush your fitness goals today?
                </p>
              </div>
              <Button variant="outline" className="glass-effect" asChild>
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="card-gradient premium-shadow">
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gradient-secondary">12</div>
                <div className="text-sm text-muted-foreground">Workouts This Month</div>
              </CardContent>
            </Card>
            <Card className="card-gradient premium-shadow">
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gradient-secondary">48h</div>
                <div className="text-sm text-muted-foreground">Total Time Trained</div>
              </CardContent>
            </Card>
            <Card className="card-gradient premium-shadow">
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gradient-secondary">5</div>
                <div className="text-sm text-muted-foreground">Classes Booked</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="card-gradient premium-shadow">
              <CardHeader>
                <CardTitle className="text-gradient-primary">Quick Actions</CardTitle>
                <CardDescription>Manage your fitness journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start btn-premium" asChild>
                  <Link href="/dashboard/workouts/log">
                    <Trophy className="h-4 w-4 mr-2" />
                    Log Workout
                  </Link>
                </Button>
                <Button className="w-full justify-start glass-effect" asChild>
                  <Link href="/dashboard/workouts">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Workouts
                  </Link>
                </Button>
                <Button className="w-full justify-start glass-effect" asChild>
                  <Link href="/classes">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book a Class
                  </Link>
                </Button>
                <Button className="w-full justify-start glass-effect" asChild>
                  <Link href="/trainers">
                    <User className="h-4 w-4 mr-2" />
                    Find a Trainer
                  </Link>
                </Button>
                <Button className="w-full justify-start glass-effect" asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="card-gradient premium-shadow">
              <CardHeader>
                <CardTitle className="text-gradient-primary">Your Membership</CardTitle>
                <CardDescription>Current plan and benefits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="glass-effect">Premium Member</Badge>
                  <span className="text-sm text-muted-foreground">Active</span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Next billing:</span>
                    <span>Jan 15, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span>Premium ($59/month)</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 glass-effect" asChild>
                  <Link href="/dashboard/billing">Manage Billing</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
