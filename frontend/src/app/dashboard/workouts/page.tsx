"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, TrendingUp, Target, Award, Dumbbell, Clock, Zap, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface WorkoutSession {
  id: string;
  name: string;
  startTime: string; // ISO date string
  duration: number; // minutes
  exercises: any[];
  totalSets: number;
  totalReps: number;
  totalWeight: number; // kg
  category: string;
}

interface PersonalRecord {
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
}

interface WorkoutStats {
  totalWorkouts: number;
  totalDuration: number;
  totalSets: number;
  totalReps: number;
  totalWeight: number;
  avgDuration: number;
  categories: Record<string, number>;
}

interface MonthlyProgress {
  workouts: { current: number; target: number };
  totalWeight: { current: number; target: number };
  avgDuration: { current: number; target: number };
}

export default function WorkoutsPage() {
  const { user } = useAuth();
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutSession[]>([]);
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WorkoutStats | null>(null);
  const [monthlyProgress, setMonthlyProgress] = useState<MonthlyProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWorkoutData();
    }
  }, [user]);

  const fetchWorkoutData = async () => {
    try {
      if (!user) {
        console.log('No user found, cannot fetch workouts'); // Debug log
        return;
      }
      
      console.log('Fetching workouts for user:', user.email); // Debug log
      const token = await user.getIdToken();
      if (!token) {
        console.log('No token found'); // Debug log
        return;
      }
      
      console.log('Got ID token, length:', token.length); // Debug log

      // Fetch recent workouts
      const workoutsResponse = await fetch('/api/workouts?limit=10', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('Workouts response status:', workoutsResponse.status); // Debug log
      
      const workoutsData = await workoutsResponse.json();
      console.log('Workouts response data:', workoutsData); // Debug log

      if (workoutsResponse.ok) {
        console.log('Fetched workouts:', workoutsData.workouts); // Debug log
        setRecentWorkouts(workoutsData.workouts || []);
      } else {
        console.error('Failed to fetch workouts:', workoutsData);
      }

      // Fetch personal records
      const recordsResponse = await fetch('/api/personal-records', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const recordsData = await recordsResponse.json();

      if (recordsResponse.ok) {
        setPersonalRecords(recordsData.records || []);
      }

      // Fetch weekly stats
      const statsResponse = await fetch('/api/workout-stats?period=week', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsData = await statsResponse.json();

      if (statsResponse.ok) {
        setWeeklyStats(statsData.stats);
        setMonthlyProgress(statsData.monthlyProgress);
      }

    } catch (error) {
      console.error('Error fetching workout data:', error);
      toast.error('Failed to load workout data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen premium-gradient">
        <div className="pt-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading your workout data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen premium-gradient">
      <div className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gradient-primary mb-2">Workout Tracking</h1>
              <p className="text-muted-foreground">Track your fitness journey and smash your goals</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="glass-effect" asChild>
                <Link href="/dashboard">
                  Back to Dashboard
                </Link>
              </Button>
              <Button variant="outline" className="glass-effect" onClick={fetchWorkoutData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button className="btn-premium" asChild>
                <Link href="/dashboard/workouts/log">
                  <Plus className="h-4 w-4 mr-2" />
                  Log Workout
                </Link>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 glass-effect">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="records">Records</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Weekly Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="card-gradient premium-shadow">
                  <CardContent className="p-6 text-center">
                    <Dumbbell className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gradient-secondary">{weeklyStats?.totalWorkouts || 0}</div>
                    <div className="text-sm text-muted-foreground">Workouts This Week</div>
                  </CardContent>
                </Card>
                <Card className="card-gradient premium-shadow">
                  <CardContent className="p-6 text-center">
                    <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gradient-secondary">
                      {weeklyStats ? `${Math.round(weeklyStats.totalDuration / 60)}h ${weeklyStats.totalDuration % 60}m` : '0h 0m'}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Time</div>
                  </CardContent>
                </Card>
                <Card className="card-gradient premium-shadow">
                  <CardContent className="p-6 text-center">
                    <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gradient-secondary">{Math.round(weeklyStats?.totalWeight || 0)}kg</div>
                    <div className="text-sm text-muted-foreground">Total Weight</div>
                  </CardContent>
                </Card>
                <Card className="card-gradient premium-shadow">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gradient-secondary">{weeklyStats?.avgDuration || 0}min</div>
                    <div className="text-sm text-muted-foreground">Avg Duration</div>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Goals */}
              <Card className="card-gradient premium-shadow">
                <CardHeader>
                  <CardTitle className="text-gradient-primary">Monthly Goals</CardTitle>
                  <CardDescription>Track your progress towards this month's targets</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Workouts</span>
                      <span>{monthlyProgress?.workouts.current || 0}/{monthlyProgress?.workouts.target || 16}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${monthlyProgress ? Math.min((monthlyProgress.workouts.current / monthlyProgress.workouts.target) * 100, 100) : 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Weight Lifted</span>
                      <span>{(monthlyProgress?.totalWeight.current || 0).toLocaleString()}kg / {(monthlyProgress?.totalWeight.target || 20000).toLocaleString()}kg</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${monthlyProgress ? Math.min((monthlyProgress.totalWeight.current / monthlyProgress.totalWeight.target) * 100, 100) : 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Average Duration</span>
                      <span>{monthlyProgress?.avgDuration.current || 0}min / {monthlyProgress?.avgDuration.target || 60}min</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-500 to-red-500 h-2 rounded-full transition-all"
                        style={{ width: `${monthlyProgress ? Math.min((monthlyProgress.avgDuration.current / monthlyProgress.avgDuration.target) * 100, 100) : 0}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Workouts */}
              <Card className="card-gradient premium-shadow">
                <CardHeader>
                  <CardTitle className="text-gradient-primary">Recent Workouts</CardTitle>
                  <CardDescription>Your latest training sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentWorkouts.length === 0 ? (
                      <div className="text-center py-8">
                        <Dumbbell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">No Workouts Yet</h3>
                        <p className="text-muted-foreground mb-4">Start logging your workouts to see them here!</p>
                        <Button className="btn-premium" asChild>
                          <Link href="/dashboard/workouts/log">Log Your First Workout</Link>
                        </Button>
                      </div>
                    ) : (
                      recentWorkouts.slice(0, 3).map((workout) => (
                        <div key={workout.id} className="flex items-center justify-between p-4 rounded-lg glass-effect">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                              <Dumbbell className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{workout.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {new Date(workout.startTime).toLocaleDateString()} • {workout.duration} min
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary" className="glass-effect mb-1">
                              {workout.category}
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              {workout.exercises?.length || 0} exercises • {workout.totalSets} sets
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <Button variant="outline" className="w-full mt-4 glass-effect" asChild>
                    <Link href="/dashboard/workouts/history">View All Workouts</Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-6">
              <Card className="card-gradient premium-shadow">
                <CardHeader>
                  <CardTitle className="text-gradient-primary">Workout History</CardTitle>
                  <CardDescription>All your training sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentWorkouts.map((workout) => (
                      <div key={workout.id} className="p-4 rounded-lg glass-effect">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{workout.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(workout.startTime).toLocaleDateString()} • {workout.duration} minutes
                            </p>
                          </div>
                          <Badge variant="secondary" className="glass-effect">
                            {workout.category}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div className="text-center">
                            <p className="font-medium">{workout.exercises?.length || 0}</p>
                            <p className="text-muted-foreground">Exercises</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium">{workout.totalSets}</p>
                            <p className="text-muted-foreground">Sets</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium">{workout.totalReps}</p>
                            <p className="text-muted-foreground">Reps</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium">{workout.totalWeight}kg</p>
                            <p className="text-muted-foreground">Weight</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress" className="space-y-6">
              <Card className="card-gradient premium-shadow">
                <CardHeader>
                  <CardTitle className="text-gradient-primary">Progress Charts</CardTitle>
                  <CardDescription>Visual representation of your fitness journey</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Charts Coming Soon!</h3>
                  <p className="text-muted-foreground mb-6">
                    Interactive progress charts will be available here to track your strength gains, volume progression, and workout frequency.
                  </p>
                  <Button className="btn-premium" asChild>
                    <Link href="/dashboard/workouts/log">Log More Workouts</Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Records Tab */}
            <TabsContent value="records" className="space-y-6">
              <Card className="card-gradient premium-shadow">
                <CardHeader>
                  <CardTitle className="text-gradient-primary">Personal Records</CardTitle>
                  <CardDescription>Your best lifts and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  {personalRecords.length === 0 ? (
                    <div className="text-center py-8">
                      <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No Personal Records Yet</h3>
                      <p className="text-muted-foreground mb-4">Complete workouts to start setting personal records!</p>
                      <Button className="btn-premium" asChild>
                        <Link href="/dashboard/workouts/log">Start Training</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {personalRecords.map((record, index) => (
                        <div key={index} className="p-4 rounded-lg glass-effect">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{record.exerciseName}</h3>
                            <Award className="h-5 w-5 text-yellow-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-2xl font-bold text-gradient-secondary">
                                {record.weight > 0 ? `${record.weight}kg` : `${record.reps} reps`}
                              </p>
                              {record.weight > 0 && (
                                <p className="text-sm text-muted-foreground">{record.reps} reps</p>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {new Date(record.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
