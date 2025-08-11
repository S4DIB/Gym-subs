"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Search, Timer, Save, Trash2, Copy, Dumbbell } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface Exercise {
  id: string;
  name: string;
  category: string;
  primaryMuscle: string;
  equipment: string;
  instructions: string;
}

interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;
  restTime?: number;
  completed: boolean;
}

interface WorkoutExercise {
  id: string;
  exercise: Exercise;
  sets: WorkoutSet[];
  notes?: string;
}

interface WorkoutSession {
  name: string;
  category: string;
  exercises: WorkoutExercise[];
  startTime: Date;
  endTime?: Date;
  notes?: string;
}

export default function LogWorkoutPage() {
  const { user } = useAuth();
  const [workout, setWorkout] = useState<WorkoutSession>({
    name: "",
    category: "Strength",
    exercises: [],
    startTime: new Date(),
    notes: ""
  });

  const [isExerciseDialogOpen, setIsExerciseDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);

  // Exercise database (in real app, this would come from API)
  const exerciseDatabase: Exercise[] = [
    {
      id: "1",
      name: "Bench Press",
      category: "Strength",
      primaryMuscle: "Chest",
      equipment: "Barbell",
      instructions: "Lie on bench, grip bar wider than shoulders, lower to chest, press up."
    },
    {
      id: "2", 
      name: "Squats",
      category: "Strength",
      primaryMuscle: "Legs",
      equipment: "Barbell",
      instructions: "Stand with feet shoulder-width apart, squat down keeping chest up, return to standing."
    },
    {
      id: "3",
      name: "Deadlift",
      category: "Strength", 
      primaryMuscle: "Back",
      equipment: "Barbell",
      instructions: "Stand with feet hip-width apart, bend at hips and knees, lift bar by extending hips and knees."
    },
    {
      id: "4",
      name: "Pull-ups",
      category: "Strength",
      primaryMuscle: "Back", 
      equipment: "Pull-up Bar",
      instructions: "Hang from bar, pull body up until chin clears bar, lower with control."
    },
    {
      id: "5",
      name: "Running",
      category: "Cardio",
      primaryMuscle: "Full Body",
      equipment: "Treadmill",
      instructions: "Maintain steady pace, focus on breathing and form."
    },
    {
      id: "6",
      name: "Plank",
      category: "Core",
      primaryMuscle: "Core",
      equipment: "Bodyweight",
      instructions: "Hold push-up position with straight line from head to heels."
    }
  ];

  const categories = ["Strength", "Cardio", "Core", "Flexibility"];
  const muscles = ["Chest", "Back", "Shoulders", "Arms", "Legs", "Core", "Full Body"];

  const filteredExercises = exerciseDatabase.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.primaryMuscle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const startWorkout = () => {
    if (!workout.name) {
      toast.error("Please enter a workout name");
      return;
    }
    setIsWorkoutStarted(true);
    setWorkout(prev => ({ ...prev, startTime: new Date() }));
    toast.success("Workout started! Let's crush it! 💪");
  };

  const addExercise = (exercise: Exercise) => {
    const newWorkoutExercise: WorkoutExercise = {
      id: Date.now().toString(),
      exercise,
      sets: [
        { id: Date.now().toString(), reps: 10, weight: 0, completed: false }
      ]
    };
    
    setWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, newWorkoutExercise]
    }));
    
    setIsExerciseDialogOpen(false);
    toast.success(`${exercise.name} added to workout`);
  };

  const addSet = (exerciseId: string) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === exerciseId 
          ? {
              ...ex,
              sets: [...ex.sets, {
                id: Date.now().toString(),
                reps: ex.sets[ex.sets.length - 1]?.reps || 10,
                weight: ex.sets[ex.sets.length - 1]?.weight || 0,
                completed: false
              }]
            }
          : ex
      )
    }));
  };

  const updateSet = (exerciseId: string, setId: string, field: keyof WorkoutSet, value: any) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map(set =>
                set.id === setId ? { ...set, [field]: value } : set
              )
            }
          : ex
      )
    }));
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex =>
        ex.id === exerciseId
          ? { ...ex, sets: ex.sets.filter(set => set.id !== setId) }
          : ex
      )
    }));
  };

  const removeExercise = (exerciseId: string) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
    }));
    toast.success("Exercise removed from workout");
  };

  const finishWorkout = async () => {
    if (!user) {
      toast.error("You must be logged in to save workouts");
      return;
    }

    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - workout.startTime.getTime()) / 60000);
    const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
    const totalReps = workout.exercises.reduce((sum, ex) => 
      sum + ex.sets.reduce((setSum, set) => setSum + set.reps, 0), 0);

    try {
      // Prepare workout data for API
      const workoutData = {
        name: workout.name,
        category: workout.category,
        exercises: workout.exercises.map(ex => ({
          exerciseId: ex.exercise.id,
          exerciseName: ex.exercise.name,
          category: ex.exercise.category,
          primaryMuscle: ex.exercise.primaryMuscle,
          sets: ex.sets.map(set => ({
            reps: set.reps,
            weight: set.weight,
            restTime: set.restTime,
            completed: set.completed
          })),
          notes: ex.notes
        })),
        startTime: workout.startTime.toISOString(),
        endTime: endTime.toISOString(),
        notes: workout.notes
      };

      // Get auth token
      const token = await user.getIdToken();

      // Save to database
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(workoutData)
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`Workout saved! ${duration} minutes, ${totalSets} sets, ${totalReps} reps 🎉`);
        
        // Redirect after short delay
        setTimeout(() => {
          window.location.href = "/dashboard/workouts";
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to save workout');
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save workout');
    }
  };

  const workoutDuration = isWorkoutStarted 
    ? Math.round((new Date().getTime() - workout.startTime.getTime()) / 60000)
    : 0;

  return (
    <div className="min-h-screen premium-gradient">
      <div className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gradient-primary mb-2">Log Workout</h1>
              <p className="text-muted-foreground">
                {isWorkoutStarted ? `Active workout • ${workoutDuration} minutes` : "Start tracking your training session"}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="glass-effect" asChild>
                <Link href="/dashboard/workouts">Cancel</Link>
              </Button>
              {isWorkoutStarted && workout.exercises.length > 0 && (
                <Button onClick={finishWorkout} className="btn-premium">
                  <Save className="h-4 w-4 mr-2" />
                  Finish Workout
                </Button>
              )}
            </div>
          </div>

          {!isWorkoutStarted ? (
            /* Workout Setup */
            <Card className="card-gradient premium-shadow">
              <CardHeader>
                <CardTitle className="text-gradient-primary">Setup Your Workout</CardTitle>
                <CardDescription>Enter workout details to get started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="workoutName">Workout Name *</Label>
                    <Input
                      id="workoutName"
                      placeholder="e.g., Push Day, Leg Day, HIIT Session"
                      value={workout.name}
                      onChange={(e) => setWorkout(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={workout.category} onValueChange={(value) => setWorkout(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any goals or notes for this workout..."
                    value={workout.notes}
                    onChange={(e) => setWorkout(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
                <Button onClick={startWorkout} className="w-full btn-premium" size="lg">
                  <Timer className="h-5 w-5 mr-2" />
                  Start Workout
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Active Workout */
            <div className="space-y-6">
              {/* Workout Header */}
              <Card className="card-gradient premium-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gradient-primary">{workout.name}</h2>
                      <p className="text-muted-foreground">{workout.category} • {workoutDuration} minutes</p>
                    </div>
                    <Dialog open={isExerciseDialogOpen} onOpenChange={setIsExerciseDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="btn-premium">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Exercise
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Choose Exercise</DialogTitle>
                          <DialogDescription>Select an exercise to add to your workout</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex gap-4">
                            <div className="flex-1 relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Search exercises..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                              />
                            </div>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                {categories.map(cat => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="max-h-64 overflow-y-auto space-y-2">
                            {filteredExercises.map(exercise => (
                              <div 
                                key={exercise.id}
                                className="p-3 rounded-lg glass-effect cursor-pointer hover:bg-white/5 transition-colors"
                                onClick={() => addExercise(exercise)}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-medium">{exercise.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {exercise.primaryMuscle} • {exercise.equipment}
                                    </p>
                                  </div>
                                  <Badge variant="outline">{exercise.category}</Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              {/* Exercises */}
              {workout.exercises.length === 0 ? (
                <Card className="card-gradient premium-shadow">
                  <CardContent className="text-center py-12">
                    <Dumbbell className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No Exercises Added</h3>
                    <p className="text-muted-foreground mb-6">
                      Add your first exercise to start logging your workout.
                    </p>
                    <Button onClick={() => setIsExerciseDialogOpen(true)} className="btn-premium">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Exercise
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                workout.exercises.map((workoutExercise, index) => (
                  <Card key={workoutExercise.id} className="card-gradient premium-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{workoutExercise.exercise.name}</CardTitle>
                          <CardDescription>
                            {workoutExercise.exercise.primaryMuscle} • {workoutExercise.exercise.equipment}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExercise(workoutExercise.id)}
                          className="text-red-400 hover:bg-red-400/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Sets Table Header */}
                      <div className="grid grid-cols-5 gap-2 text-sm font-medium text-muted-foreground px-2">
                        <div>Set</div>
                        <div>Reps</div>
                        <div>Weight (kg)</div>
                        <div>Rest (min)</div>
                        <div>Done</div>
                      </div>
                      
                      {/* Sets */}
                      {workoutExercise.sets.map((set, setIndex) => (
                        <div key={set.id} className="grid grid-cols-5 gap-2 items-center">
                          <div className="text-center font-medium">{setIndex + 1}</div>
                          <Input
                            type="number"
                            value={set.reps}
                            onChange={(e) => updateSet(workoutExercise.id, set.id, 'reps', parseInt(e.target.value) || 0)}
                            className="text-center"
                          />
                          <Input
                            type="number"
                            step="0.5"
                            value={set.weight}
                            onChange={(e) => updateSet(workoutExercise.id, set.id, 'weight', parseFloat(e.target.value) || 0)}
                            className="text-center"
                          />
                          <Input
                            type="number"
                            step="0.5"
                            value={set.restTime || ''}
                            onChange={(e) => updateSet(workoutExercise.id, set.id, 'restTime', parseFloat(e.target.value) || undefined)}
                            className="text-center"
                            placeholder="2"
                          />
                          <div className="flex justify-center">
                            <Button
                              variant={set.completed ? "default" : "outline"}
                              size="sm"
                              onClick={() => updateSet(workoutExercise.id, set.id, 'completed', !set.completed)}
                              className={set.completed ? "bg-green-600 hover:bg-green-700" : ""}
                            >
                              ✓
                            </Button>
                          </div>
                        </div>
                      ))}

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addSet(workoutExercise.id)}
                          className="glass-effect"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Set
                        </Button>
                        {workoutExercise.sets.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeSet(workoutExercise.id, workoutExercise.sets[workoutExercise.sets.length - 1].id)}
                            className="text-red-400 hover:bg-red-400/10"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove Set
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
