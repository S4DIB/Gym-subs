"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Clock, Users, Calendar, Search, MapPin } from "lucide-react";
import { toast } from "sonner";

interface GymClass {
  id: string;
  name: string;
  description: string;
  trainer: string;
  trainerId: string;
  duration: number; // minutes
  capacity: number;
  enrolled: number;
  schedule: {
    day: string;
    time: string;
  }[];
  intensity: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  location: string;
  price: number;
  status: "active" | "cancelled" | "full";
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<GymClass[]>([
    {
      id: "1",
      name: "Morning Yoga Flow",
      description: "Start your day with energizing yoga sequences and mindful breathing.",
      trainer: "Sarah Johnson",
      trainerId: "1",
      duration: 60,
      capacity: 20,
      enrolled: 18,
      schedule: [
        { day: "Monday", time: "07:00" },
        { day: "Wednesday", time: "07:00" },
        { day: "Friday", time: "07:00" }
      ],
      intensity: "Beginner",
      category: "Yoga",
      location: "Studio A",
      price: 25,
      status: "active"
    },
    {
      id: "2", 
      name: "HIIT Bootcamp",
      description: "High-intensity interval training for maximum calorie burn and strength building.",
      trainer: "Mike Davis",
      trainerId: "2",
      duration: 45,
      capacity: 15,
      enrolled: 15,
      schedule: [
        { day: "Tuesday", time: "18:00" },
        { day: "Thursday", time: "18:00" },
        { day: "Saturday", time: "09:00" }
      ],
      intensity: "Advanced",
      category: "HIIT",
      location: "Main Gym",
      price: 30,
      status: "full"
    },
    {
      id: "3",
      name: "Aqua Fitness",
      description: "Low-impact water workout perfect for all fitness levels and joint recovery.",
      trainer: "Emma Wilson",
      trainerId: "3",
      duration: 50,
      capacity: 12,
      enrolled: 8,
      schedule: [
        { day: "Monday", time: "19:00" },
        { day: "Wednesday", time: "19:00" }
      ],
      intensity: "Intermediate",
      category: "Aqua",
      location: "Pool",
      price: 20,
      status: "cancelled"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [newClass, setNewClass] = useState({
    name: "",
    description: "",
    trainer: "",
    duration: 60,
    capacity: 20,
    intensity: "Beginner" as const,
    category: "",
    location: "",
    price: 25,
    schedule: ""
  });

  // Mock trainers data - in real app, fetch from API
  const trainers = [
    { id: "1", name: "Sarah Johnson" },
    { id: "2", name: "Mike Davis" },
    { id: "3", name: "Emma Wilson" }
  ];

  const categories = ["Yoga", "HIIT", "Strength", "Cardio", "Pilates", "Aqua", "Dance", "Martial Arts"];
  const locations = ["Studio A", "Studio B", "Main Gym", "Pool", "Outdoor Area"];

  const filteredClasses = classes.filter(gymClass => {
    const matchesSearch = gymClass.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gymClass.trainer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gymClass.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || gymClass.category === filterCategory;
    const matchesStatus = filterStatus === "all" || gymClass.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddClass = () => {
    if (!newClass.name || !newClass.trainer || !newClass.category) {
      toast.error("Name, trainer, and category are required");
      return;
    }

    const selectedTrainer = trainers.find(t => t.id === newClass.trainer);
    if (!selectedTrainer) return;

    // Parse schedule (simple format: "Mon 09:00, Wed 09:00")
    const scheduleArray = newClass.schedule.split(",").map(s => {
      const [day, time] = s.trim().split(" ");
      return { day: day.trim(), time: time.trim() };
    }).filter(s => s.day && s.time);

    const gymClass: GymClass = {
      id: Date.now().toString(),
      name: newClass.name,
      description: newClass.description,
      trainer: selectedTrainer.name,
      trainerId: newClass.trainer,
      duration: newClass.duration,
      capacity: newClass.capacity,
      enrolled: 0,
      schedule: scheduleArray,
      intensity: newClass.intensity,
      category: newClass.category,
      location: newClass.location,
      price: newClass.price,
      status: "active"
    };

    setClasses([...classes, gymClass]);
    setNewClass({
      name: "", description: "", trainer: "", duration: 60, capacity: 20,
      intensity: "Beginner", category: "", location: "", price: 25, schedule: ""
    });
    setIsAddDialogOpen(false);
    toast.success("Class added successfully");
  };

  const handleDeleteClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
    toast.success("Class deleted");
  };

  const handleStatusChange = (id: string, status: GymClass["status"]) => {
    setClasses(classes.map(c => c.id === id ? { ...c, status } : c));
    toast.success("Class status updated");
  };

  const getStatusColor = (status: GymClass["status"]) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      case "full": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getIntensityColor = (intensity: GymClass["intensity"]) => {
    switch (intensity) {
      case "Beginner": return "text-green-600 bg-green-100";
      case "Intermediate": return "text-yellow-600 bg-yellow-100";
      case "Advanced": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary">Class Management</h1>
          <p className="text-muted-foreground">Schedule and manage fitness classes</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-premium">
              <Plus className="h-4 w-4 mr-2" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add New Class</DialogTitle>
              <DialogDescription>
                Create a new fitness class and assign it to a trainer.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="className">Class Name *</Label>
                <Input
                  id="className"
                  value={newClass.name}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                  placeholder="Morning Yoga Flow"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={newClass.category} onValueChange={(value) => setNewClass({ ...newClass, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="trainer">Trainer *</Label>
                <Select value={newClass.trainer} onValueChange={(value) => setNewClass({ ...newClass, trainer: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trainer" />
                  </SelectTrigger>
                  <SelectContent>
                    {trainers.map(trainer => (
                      <SelectItem key={trainer.id} value={trainer.id}>{trainer.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={newClass.location} onValueChange={(value) => setNewClass({ ...newClass, location: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(loc => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newClass.duration}
                  onChange={(e) => setNewClass({ ...newClass, duration: parseInt(e.target.value) || 60 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={newClass.capacity}
                  onChange={(e) => setNewClass({ ...newClass, capacity: parseInt(e.target.value) || 20 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="intensity">Intensity</Label>
                <Select value={newClass.intensity} onValueChange={(value) => setNewClass({ ...newClass, intensity: value as GymClass["intensity"] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newClass.price}
                  onChange={(e) => setNewClass({ ...newClass, price: parseFloat(e.target.value) || 25 })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newClass.description}
                  onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                  placeholder="Brief description of the class..."
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="schedule">Schedule</Label>
                <Input
                  id="schedule"
                  value={newClass.schedule}
                  onChange={(e) => setNewClass({ ...newClass, schedule: e.target.value })}
                  placeholder="Monday 09:00, Wednesday 09:00, Friday 09:00"
                />
                <p className="text-xs text-muted-foreground">Format: Day Time, Day Time (e.g., Monday 09:00, Wednesday 09:00)</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddClass} className="btn-premium">
                Add Class
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="card-gradient premium-shadow">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="full">Full</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((gymClass) => (
          <Card key={gymClass.id} className="card-gradient premium-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{gymClass.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <span>{gymClass.trainer}</span>
                    <Badge className={getIntensityColor(gymClass.intensity)} variant="secondary">
                      {gymClass.intensity}
                    </Badge>
                  </CardDescription>
                </div>
                <div className={`h-3 w-3 rounded-full ${getStatusColor(gymClass.status)}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {gymClass.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>{gymClass.duration} min</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <span>{gymClass.enrolled}/{gymClass.capacity}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-purple-500" />
                  <span>{gymClass.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold">${gymClass.price}</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Schedule:</p>
                <div className="space-y-1">
                  {gymClass.schedule.map((sch, index) => (
                    <div key={index} className="flex items-center justify-between text-xs bg-white/5 rounded px-2 py-1">
                      <span>{sch.day}</span>
                      <span>{sch.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Select value={gymClass.status} onValueChange={(value) => handleStatusChange(gymClass.id, value as GymClass["status"])}>
                  <SelectTrigger className="w-24 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="full">Full</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-600/10"
                    onClick={() => handleDeleteClass(gymClass.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <Card className="card-gradient premium-shadow">
          <CardContent className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Classes Found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || filterCategory !== "all" || filterStatus !== "all"
                ? "Try adjusting your search or filters."
                : "Get started by adding your first class."
              }
            </p>
            {!searchTerm && filterCategory === "all" && filterStatus === "all" && (
              <Button className="btn-premium" onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Class
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
